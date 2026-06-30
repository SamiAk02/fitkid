<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { categories, type Course } from '@/data/courses'
import { supabase } from '@/lib/supabaseClient'
import StarRating from './StarRating.vue'

const props = defineProps<{ course: Course }>()

const cat = computed(() => categories[props.course.category])

const nextSession = ref<{ id: string; spots_left: number; starts_at: string } | null>(null)
const loadingSession = ref(true)

const isFull = computed(() => (nextSession.value ? nextSession.value.spots_left <= 0 : false))
const isFree = computed(() => /gratis/i.test(props.course.price))

const showModal = ref(false)
const isBooked = ref(false)
const childName = ref('')
const formError = ref('')
const submitting = ref(false)

async function loadNextSession() {
  loadingSession.value = true
  const { data, error } = await supabase
      .from('sessions')
      .select('id, spots_left, starts_at')
      .eq('course_id', props.course.id)
      .eq('status', 'scheduled')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(1)
      .maybeSingle()

  if (!error && data) {
    nextSession.value = data
  }
  loadingSession.value = false
}

function openModal() {
  if (isBooked.value || !nextSession.value) return
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  formError.value = ''
}

async function confirmBooking() {
  if (!childName.value.trim()) {
    formError.value = 'Bitte Name des Kindes angeben.'
    return
  }
  if (!nextSession.value) return

  submitting.value = true
  formError.value = ''

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    formError.value = 'Bitte zuerst einloggen.'
    submitting.value = false
    return
  }

  const { error } = await supabase.rpc('book_session', {
    p_session_id: nextSession.value.id,
    p_child_name: childName.value.trim(),
  })

  if (error) {
    formError.value = error.message
  } else {
    isBooked.value = true
    showModal.value = false
    await loadNextSession()
  }

  submitting.value = false
}

onMounted(loadNextSession)
</script>

<template>
  <div class="h-full flex flex-col bg-surface border border-line rounded-card p-5 shadow-sm hover:shadow-md hover:border-brand-500 transition-all">

    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" :class="cat.badge">
        {{ cat.icon }} {{ cat.label }}
      </span>
      <span
          v-if="!loadingSession && nextSession"
          class="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          :class="isFull ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
      >
        {{ isFull ? '⏳ Warteliste' : `✓ ${nextSession.spots_left} Plätze frei` }}
      </span>
      <span v-else-if="!loadingSession && !nextSession" class="text-xs font-bold px-2.5 py-1 rounded-full bg-surface border border-line text-muted">
        Kein Termin
      </span>
    </div>

    <h4 class="font-extrabold text-ink text-base leading-snug tracking-tight">{{ course.title }}</h4>
    <p class="text-sm text-muted mt-0.5">{{ course.club }}</p>

    <!-- Info-Raster -->
    <div class="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-ink/80">
      <p class="flex items-center gap-1.5"><span>🎂</span>{{ course.ageGroup }}</p>
      <p class="flex items-center gap-1.5"><span>🕒</span>{{ course.time }}</p>
      <p class="flex items-center gap-1.5 col-span-2"><span>📍</span>{{ course.address }}</p>
    </div>

    <!-- Sterne-Bewertung -->
    <StarRating :course-id="course.id" />

    <!-- Footer -->
    <div class="mt-auto pt-5 flex items-end justify-between gap-3">
      <div class="flex flex-col gap-1">
        <span
            class="text-sm font-bold px-2.5 py-1 rounded-lg w-fit"
            :class="isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-mint-bg text-ink'"
        >
          {{ course.price }}
        </span>
        <span v-if="course.includedInPlan" class="text-[11px] font-semibold text-brand-700 flex items-center gap-1">
          🎟️ Im {{ course.includedInPlan === 'aktiv' ? 'Aktiv' : 'Familie+' }}-Abo enthalten
        </span>
      </div>
      <button
          @click="openModal"
          :disabled="isBooked || !nextSession"
          class="text-sm font-bold px-4 py-2 rounded-xl transition-all"
          :class="isBooked
          ? 'bg-emerald-100 text-emerald-700 cursor-default'
          : isFull
            ? 'bg-surface border border-line text-ink hover:border-brand-500'
            : 'bg-brand-700 text-white hover:bg-brand-800'"
      >
        {{ isBooked ? '✓ Angemeldet' : (isFull ? 'Auf Warteliste' : 'Platz sichern') }}
      </button>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="bg-surface rounded-card p-6 w-full max-w-sm shadow-lg space-y-4">
          <div>
            <h3 class="font-extrabold text-ink text-lg">{{ course.title }}</h3>
            <p class="text-sm text-muted">{{ course.club }} · {{ course.time }}</p>
          </div>

          <div>
            <label class="text-xs font-semibold text-ink/70">Name des Kindes</label>
            <input
                v-model="childName"
                type="text"
                class="w-full mt-1 bg-mint-bg border border-line rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="Vor- und Nachname"
            />
          </div>

          <p v-if="formError" class="text-xs text-red-600 font-semibold">{{ formError }}</p>

          <div class="flex gap-3 pt-2">
            <button @click="closeModal" class="flex-1 text-sm font-bold px-4 py-2.5 rounded-xl border border-line text-ink hover:border-brand-500 transition-all">
              Abbrechen
            </button>
            <button
                @click="confirmBooking"
                :disabled="submitting"
                class="flex-1 text-sm font-bold px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 transition-all disabled:opacity-50"
            >
              {{ submitting ? '...' : 'Verbindlich anmelden' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>