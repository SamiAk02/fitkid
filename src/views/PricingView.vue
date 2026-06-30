<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

type Billing = 'monthly' | 'yearly'

interface Feature { text: string; included: boolean }
interface Plan {
  id: string
  name: string
  tagline: string
  priceMonthly: number
  priceYearly: number
  checkins: string
  cta: string
  highlight: boolean
  badge?: string
  features: Feature[]
}

const router = useRouter()
const billing = ref<Billing>('monthly')
const selectedPlan = ref<string | null>(null)
const referralCode = ref('')
const referralDiscount = ref(0)
const referralCopied = ref(false)
const loadingProfile = ref(true)

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Entdecken',
    tagline: 'Finden, vergleichen, loslegen',
    priceMonthly: 0,
    priceYearly: 0,
    checkins: 'Kursgebühr direkt beim Verein',
    cta: 'Kostenlos starten',
    highlight: false,
    features: [
      { text: 'Alle Kurse & Karte durchsuchen', included: true },
      { text: 'BuT-Lotse: Anspruch prüfen & Antrag', included: true },
      { text: '1 Kinderprofil', included: true },
      { text: 'Buchung mit Warteliste', included: true },
      { text: 'Inklusiv-Check-ins', included: false },
      { text: 'Prioritäts-Buchung', included: false },
    ],
  },
  {
    id: 'aktiv',
    name: 'Aktiv',
    tagline: 'Die Sport-Flatrate für deine Familie',
    priceMonthly: 39.99,
    priceYearly: 439.89,
    checkins: '4 Check-ins / Monat',
    cta: 'Aktiv-Abo wählen',
    highlight: true,
    badge: 'Beliebt',
    features: [
      { text: 'Alles aus „Entdecken"', included: true },
      { text: '4 Inklusiv-Check-ins pro Monat', included: true },
      { text: 'Max. 4× pro Anbieter / Monat', included: true },
      { text: 'Prioritäts-Buchung – keine Warteliste', included: true },
      { text: 'Bis zu 2 Kinderprofile', included: true },
      { text: '10 % Rabatt bei Partner-Vereinen', included: true },
    ],
  },
  {
    id: 'familie',
    name: 'Familie+',
    tagline: 'Für aktive Familien mit mehreren Kindern',
    priceMonthly: 79.99,
    priceYearly: 879.89,
    checkins: '8 Check-ins / Monat',
    cta: 'Familie+ wählen',
    highlight: false,
    features: [
      { text: 'Alles aus „Aktiv"', included: true },
      { text: '8 Inklusiv-Check-ins pro Monat', included: true },
      { text: 'Max. 8× pro Anbieter / Monat', included: true },
      { text: 'Bis zu 5 Kinderprofile', included: true },
      { text: 'Exklusive Premium-Kurse', included: true },
      { text: 'Geschwister-Rabatt', included: true },
    ],
  },
]

function euro(n: number): string {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

function monthlyDisplay(p: Plan): number {
  let price = billing.value === 'monthly' ? p.priceMonthly : Math.round((p.priceYearly / 12) * 100) / 100
  if (referralDiscount.value > 0 && p.priceMonthly > 0) {
    price = price * (1 - referralDiscount.value / 100)
    price = Math.round(price * 100) / 100
  }
  return price
}

const referralLink = computed(() => {
  if (!referralCode.value) return ''
  return `${window.location.origin}${window.location.pathname}#/login?ref=${referralCode.value}`
})

async function copyReferralLink() {
  if (!referralLink.value) return
  await navigator.clipboard.writeText(referralLink.value)
  referralCopied.value = true
  setTimeout(() => referralCopied.value = false, 2000)
}

function selectPlan(planId: string) {
  selectedPlan.value = planId
}

async function loadProfile() {
  loadingProfile.value = true
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return

  const { data } = await supabase
      .from('profiles')
      .select('referral_code, referral_discount_percent')
      .eq('id', userData.user.id)
      .maybeSingle()

  if (data) {
    referralCode.value = data.referral_code ?? ''
    referralDiscount.value = data.referral_discount_percent ?? 0
  }
  loadingProfile.value = false
}

onMounted(loadProfile)
</script>

<template>
  <div class="w-full space-y-10">

    <!-- Kopf -->
    <header class="text-center max-w-2xl mx-auto space-y-3">
      <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-ink">Ein Abo, alle Sportkurse.</h2>
      <p class="text-sm text-muted">
        Statt jeden Kurs einzeln zu zahlen: ein fairer Monatsbeitrag mit Check-ins.
        Suchen und der BuT-Lotse sind und bleiben kostenlos.
      </p>
    </header>

    <!-- Rabatt-Banner -->
    <div
        v-if="referralDiscount > 0"
        class="max-w-3xl mx-auto rounded-card bg-emerald-50 border border-emerald-200 px-5 py-4 flex items-center gap-3"
    >
      <span class="text-2xl">🎉</span>
      <div>
        <p class="font-bold text-emerald-800">Du hast {{ referralDiscount }}% Empfehlungsrabatt!</p>
        <p class="text-sm text-emerald-700">Dein Rabatt wird automatisch auf alle Abo-Preise angerechnet.</p>
      </div>
    </div>

    <!-- Abrechnungs-Umschalter -->
    <div class="flex justify-center">
      <div class="inline-flex items-center bg-surface border border-line rounded-full p-1 shadow-sm">
        <button
            @click="billing = 'monthly'"
            class="px-5 py-2 rounded-full text-sm font-semibold transition-all"
            :class="billing === 'monthly' ? 'bg-brand-700 text-white' : 'text-muted hover:text-ink'"
        >
          Monatlich
        </button>
        <button
            @click="billing = 'yearly'"
            class="px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
            :class="billing === 'yearly' ? 'bg-brand-700 text-white' : 'text-muted hover:text-ink'"
        >
          Jährlich
          <span class="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">−1 Monat</span>
        </button>
      </div>
    </div>

    <!-- Tarif-Karten -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
      <div
          v-for="plan in plans"
          :key="plan.id"
          class="relative h-full flex flex-col bg-surface border rounded-card p-6 shadow-sm transition-all cursor-pointer"
          :class="[
          plan.highlight ? 'border-brand-500 ring-2 ring-brand-500 md:scale-[1.03]' : 'border-line',
          selectedPlan === plan.id ? 'ring-2 ring-emerald-500 border-emerald-500' : ''
        ]"
          @click="selectPlan(plan.id)"
      >
        <span
            v-if="plan.badge"
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm"
        >
          ⭐ {{ plan.badge }}
        </span>

        <div v-if="selectedPlan === plan.id" class="absolute top-3 right-3 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
          ✓ Ausgewählt
        </div>

        <h3 class="font-extrabold text-ink text-lg">{{ plan.name }}</h3>
        <p class="text-sm text-muted mt-1 min-h-[2.5rem]">{{ plan.tagline }}</p>

        <!-- Preis -->
        <div class="mt-5 mb-1">
          <template v-if="plan.priceMonthly === 0">
            <span class="text-4xl font-black text-ink">Gratis</span>
          </template>
          <template v-else>
            <span class="text-4xl font-black text-ink">{{ euro(monthlyDisplay(plan)) }} €</span>
            <span class="text-muted text-sm font-medium">/ Monat</span>
            <span v-if="referralDiscount > 0" class="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              −{{ referralDiscount }}% Rabatt
            </span>
          </template>
        </div>
        <p class="text-xs text-muted min-h-[1rem]">
          <template v-if="plan.priceMonthly === 0">Dauerhaft kostenlos</template>
          <template v-else-if="billing === 'yearly'">{{ euro(plan.priceYearly) }} € pro Jahr · 1 Monat geschenkt</template>
          <template v-else>Monatlich kündbar</template>
        </p>

        <!-- Check-in-Kontingent -->
        <div class="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-700 bg-brand-50 rounded-xl px-3 py-2">
          <span>🎟️</span>{{ plan.checkins }}
        </div>

        <!-- CTA -->
        <button
            class="mt-5 w-full text-sm font-bold py-3 rounded-xl transition-all"
            :class="selectedPlan === plan.id
            ? 'bg-emerald-600 text-white'
            : plan.highlight
              ? 'bg-brand-700 text-white hover:bg-brand-800'
              : 'bg-surface border border-line text-ink hover:border-brand-500'"
            @click.stop="selectPlan(plan.id)"
        >
          {{ selectedPlan === plan.id ? '✓ Ausgewählt' : plan.cta }}
        </button>

        <!-- Features -->
        <ul class="mt-6 space-y-3 text-sm">
          <li
              v-for="f in plan.features"
              :key="f.text"
              class="flex items-start gap-2"
              :class="f.included ? 'text-ink/80' : 'text-muted/60 line-through'"
          >
            <span :class="f.included ? 'text-emerald-600' : 'text-muted/50'">{{ f.included ? '✓' : '✕' }}</span>
            {{ f.text }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Referral-Box -->
    <div class="max-w-3xl mx-auto rounded-card bg-surface border border-line p-6 space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🔗</span>
        <div>
          <h3 class="font-extrabold text-ink">Freunde einladen, Rabatt kassieren</h3>
          <p class="text-sm text-muted">Für jede Mama/jeden Papa, die sich über deinen Link anmeldet, bekommst du <strong>+5% Rabatt</strong> auf dein Abo</p>
        </div>
      </div>

      <div v-if="loadingProfile" class="text-sm text-muted">Lade Referral-Link…</div>
      <div v-else class="space-y-3">
        <div class="flex gap-2">
          <input
              :value="referralLink"
              readonly
              class="flex-1 bg-mint-bg border border-line rounded-xl px-3 py-2 text-sm text-ink/80 truncate focus:outline-none"
          />
          <button
              @click="copyReferralLink"
              class="text-sm font-bold px-4 py-2 rounded-xl bg-brand-700 text-white hover:bg-brand-800 transition-all whitespace-nowrap"
          >
            {{ referralCopied ? '✓ Kopiert!' : '📋 Kopieren' }}
          </button>
        </div>

        <div class="flex items-center gap-3 text-sm">
          <span class="text-muted">Dein aktueller Empfehlungsrabatt:</span>
          <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {{ referralDiscount > 0 ? `${referralDiscount}% 🎉` : 'Noch kein Rabatt' }}
          </span>
        </div>
      </div>
    </div>

    <!-- BuT-Lotse Hinweis -->
    <div class="max-w-3xl mx-auto rounded-card bg-mint-bg border border-line p-6 flex flex-col sm:flex-row items-start gap-4">
      <span class="text-2xl">🤝</span>
      <div class="space-y-2 flex-1">
        <p class="font-bold text-ink">Wenig Budget? Der Staat zahlt 15 €/Monat mit.</p>
        <p class="text-sm text-ink/80">
          Über das Bildungs- und Teilhabepaket (BuT) bekommt dein Kind 15 € pro Monat für den
          Vereinsbeitrag. Unser kostenloser BuT-Lotse prüft in 30 Sekunden, ob ihr Anspruch habt –
          und zeigt den Antrag Schritt für Schritt.
        </p>
        <button
            @click="router.push('/but')"
            class="mt-1 bg-brand-700 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-brand-800 transition-all"
        >
          BuT-Anspruch prüfen
        </button>
      </div>
    </div>

  </div>
</template>