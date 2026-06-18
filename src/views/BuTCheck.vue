<script setup lang="ts">
import { ref, computed } from 'vue'

type Verdict = 'likely' | 'maybe' | 'tooOld'

const benefitOptions = [
  { id: 'buergergeld', label: 'Bürgergeld' },
  { id: 'wohngeld', label: 'Wohngeld' },
  { id: 'kinderzuschlag', label: 'Kinderzuschlag' },
  { id: 'sozialhilfe', label: 'Sozialhilfe (SGB XII)' },
  { id: 'asyl', label: 'Asylbewerberleistungen' },
  { id: 'keine', label: 'Keine davon' },
]

const childUnder18 = ref<boolean | null>(null)
const benefits = ref<string[]>([])
const showResult = ref(false)

const canEvaluate = computed(() => childUnder18.value !== null && benefits.value.length > 0)

function toggleBenefit(id: string) {
  if (id === 'keine') {
    benefits.value = ['keine']
    return
  }
  benefits.value = benefits.value.filter((b) => b !== 'keine')
  benefits.value = benefits.value.includes(id)
      ? benefits.value.filter((b) => b !== id)
      : [...benefits.value, id]
}

const verdict = computed<Verdict>(() => {
  if (childUnder18.value === false) return 'tooOld'
  const hasRealBenefit = benefits.value.some((b) => b !== 'keine')
  return hasRealBenefit ? 'likely' : 'maybe'
})

const steps = [
  { title: 'Zuständige Stelle finden', text: 'Bei Bürgergeld ist das Jobcenter zuständig, sonst deine Kommune – Stadt, Gemeinde oder Landratsamt (Bildungspaket-/Sozialstelle).' },
  { title: 'Antrag besorgen', text: 'Formular „Bildung und Teilhabe – Soziale & kulturelle Teilhabe“ online herunterladen oder im Bürgerbüro holen.' },
  { title: 'Nachweise sammeln', text: 'Leistungsbescheid (z. B. Bürgergeld) plus eine Anmelde- oder Mitgliedsbestätigung des Kurses mit den Kosten.' },
  { title: 'Antrag einreichen', text: 'Vollständig und leserlich abgeben – fehlende Unterlagen sind der häufigste Grund für Verzögerungen.' },
  { title: 'Bewilligung abwarten', text: 'Die Pauschale von 15 €/Monat wird meist direkt an den Verein überwiesen, manche Kommunen zahlen an die Familie.' },
]

function reset() {
  childUnder18.value = null
  benefits.value = []
  showResult.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8">

    <header class="space-y-2">
      <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-ink">BuT-Lotse</h2>
      <p class="text-sm text-muted">
        Prüfe in unter einer Minute, ob dein Kind Anspruch auf 15 € pro Monat für den Vereinsbeitrag hat.
      </p>
    </header>

    <!-- Frage 1 -->
    <div class="space-y-3">
      <p class="font-semibold text-ink">1. Lebt mindestens ein Kind unter 18 Jahren im Haushalt?</p>
      <div class="flex gap-2">
        <button
            v-for="opt in [{ v: true, l: 'Ja' }, { v: false, l: 'Nein' }]"
            :key="opt.l"
            @click="childUnder18 = opt.v; showResult = false"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all"
            :class="childUnder18 === opt.v ? 'bg-brand-700 text-white border-brand-700' : 'bg-surface text-ink border-line hover:border-brand-500'"
        >
          {{ opt.l }}
        </button>
      </div>
    </div>

    <!-- Frage 2 -->
    <div class="space-y-3">
      <p class="font-semibold text-ink">2. Bezieht ihr eine dieser Leistungen? (Mehrfachauswahl)</p>
      <div class="flex flex-wrap gap-2">
        <button
            v-for="opt in benefitOptions"
            :key="opt.id"
            @click="toggleBenefit(opt.id); showResult = false"
            class="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
            :class="benefits.includes(opt.id) ? 'bg-brand-700 text-white border-brand-700' : 'bg-surface text-ink border-line hover:border-brand-500'"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Auswerten -->
    <button
        @click="showResult = true"
        :disabled="!canEvaluate"
        class="w-full text-sm font-bold py-3 rounded-xl transition-all"
        :class="canEvaluate ? 'bg-brand-700 text-white hover:bg-brand-800' : 'bg-surface border border-line text-muted cursor-not-allowed'"
    >
      Anspruch prüfen
    </button>

    <!-- Ergebnis -->
    <div v-if="showResult" class="space-y-6">

      <!-- Verdikt -->
      <div
          class="rounded-card border p-5 flex items-start gap-3"
          :class="verdict === 'likely'
          ? 'bg-emerald-50 border-emerald-200'
          : verdict === 'maybe'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-surface border-line'"
      >
        <span class="text-2xl">{{ verdict === 'likely' ? '✅' : verdict === 'maybe' ? '🟡' : 'ℹ️' }}</span>
        <div class="space-y-1">
          <p class="font-bold text-ink">
            <template v-if="verdict === 'likely'">Sehr wahrscheinlich anspruchsberechtigt</template>
            <template v-else-if="verdict === 'maybe'">Eventuell – ein Zwischenschritt fehlt</template>
            <template v-else>Für Sport gilt der Anspruch nur bis 18</template>
          </p>
          <p class="text-sm text-ink/80">
            <template v-if="verdict === 'likely'">
              Da ihr eine anspruchsbegründende Leistung bezieht und ein Kind unter 18 im Haushalt lebt,
              steht euch die Teilhabe-Pauschale von 15 € pro Monat und Kind für den Vereinsbeitrag zu.
            </template>
            <template v-else-if="verdict === 'maybe'">
              Ohne eine der genannten Leistungen kann der Anspruch über Wohngeld oder Kinderzuschlag
              entstehen. Prüft zuerst, ob ihr darauf Anspruch habt – beantragt ihr das, lassen sich die
              BuT-Leistungen gleich mitbeantragen.
            </template>
            <template v-else>
              Die Teilhabe-Leistung für Sport, Kultur und Freizeit gibt es nur bis zum 18. Geburtstag.
              Bildungsleistungen wie Lernförderung gelten bis 25 – aber nicht für Vereinsbeiträge.
            </template>
          </p>
        </div>
      </div>

      <!-- Antragsschritte (nur wenn sinnvoll) -->
      <div v-if="verdict !== 'tooOld'" class="space-y-3">
        <h3 class="font-extrabold text-ink text-lg">So beantragst du es</h3>
        <ol class="space-y-3">
          <li v-for="(s, i) in steps" :key="s.title" class="flex gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-brand-700 text-white text-sm font-bold flex items-center justify-center">
              {{ i + 1 }}
            </span>
            <div>
              <p class="font-semibold text-ink text-sm">{{ s.title }}</p>
              <p class="text-sm text-muted">{{ s.text }}</p>
            </div>
          </li>
        </ol>
      </div>

      <button
          @click="reset"
          class="text-sm font-semibold text-brand-700 hover:underline"
      >
        ↺ Test zurücksetzen
      </button>

      <!-- Disclaimer -->
      <p class="text-xs text-muted border-t border-line pt-4">
        Diese Einschätzung ist eine unverbindliche Orientierung und kein Bescheid. Verbindlich entscheidet
        deine zuständige Stelle (Jobcenter bzw. Kommune). Rechtsgrundlage: § 6b BKGG, § 28 SGB II, § 34 SGB XII.
      </p>
    </div>

  </div>
</template>