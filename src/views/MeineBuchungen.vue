<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

interface BookingRow {
  id: string
  status: string
  child_name: string
  sessions: {
    id: string
    starts_at: string
    ends_at: string
    courses: {
      title: string
      club: string
      address: string
      category: string
    }
  }
}

const bookings = ref<BookingRow[]>([])
const loading = ref(true)
const errorMsg = ref('')
const weekOffset = ref(0) // 0 = aktuelle Woche, +1 = nächste, -1 = vorherige

const weekdayLabels = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

function getWeekStart(offset: number): Date {
  const now = new Date()
  const day = now.getDay() // 0 = So, 1 = Mo, ...
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(now.getDate() + diffToMonday + offset * 7)
  return monday
}

const weekStart = computed(() => getWeekStart(weekOffset.value))
const weekEnd = computed(() => {
  const end = new Date(weekStart.value)
  end.setDate(end.getDate() + 7)
  return end
})

const weekLabel = computed(() => {
  const start = weekStart.value
  const end = new Date(weekStart.value)
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  return `${fmt(start)} – ${fmt(end)}`
})

async function loadBookings() {
  loading.value = true
  errorMsg.value = ''

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    errorMsg.value = 'Nicht eingeloggt.'
    loading.value = false
    return
  }

  const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, status, child_name,
        sessions (
          id, starts_at, ends_at,
          courses ( title, club, address, category )
        )
      `)
      .eq('user_id', userData.user.id)
      .order('id')

  if (error) {
    errorMsg.value = error.message
  } else {
    // Supabase liefert verschachtelte Relationen je nach Konfiguration als Array oder Objekt;
    // hier normalisieren wir auf das erwartete Objekt-Format.
    bookings.value = (data ?? []).map((b: any) => ({
      ...b,
      sessions: Array.isArray(b.sessions) ? b.sessions[0] : b.sessions,
    })).map((b: any) => ({
      ...b,
      sessions: {
        ...b.sessions,
        courses: Array.isArray(b.sessions?.courses) ? b.sessions.courses[0] : b.sessions?.courses,
      },
    }))
  }

  loading.value = false
}

const bookingsThisWeek = computed(() => {
  return bookings.value.filter((b) => {
    if (b.status === 'cancelled') return false
    const start = new Date(b.sessions.starts_at)
    return start >= weekStart.value && start < weekEnd.value
  })
})

const bookingsByDay = computed(() => {
  const grouped: BookingRow[][] = Array.from({ length: 7 }, () => [])
  for (const b of bookingsThisWeek.value) {
    const start = new Date(b.sessions.starts_at)
    const dayIndex = (start.getDay() + 6) % 7 // Mo = 0 ... So = 6
    grouped[dayIndex].push(b)
  }
  for (const day of grouped) {
    day.sort((a, b) => new Date(a.sessions.starts_at).getTime() - new Date(b.sessions.starts_at).getTime())
  }
  return grouped
})

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function dateForDay(index: number): string {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + index)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

function prevWeek() {
  weekOffset.value -= 1
}
function nextWeek() {
  weekOffset.value += 1
}
function thisWeek() {
  weekOffset.value = 0
}

onMounted(loadBookings)
</script>

<template>
  <div class="w-full space-y-6">

    <div class="flex items-center justify-between flex-wrap gap-3">
      <h2 class="text-2xl font-extrabold text-ink tracking-tight">Meine Buchungen</h2>
      <div class="flex items-center gap-2">
        <button
            @click="prevWeek"
            class="px-3 py-2 rounded-xl border border-line text-sm font-semibold hover:border-brand-500 transition-all"
        >
          ←
        </button>
        <button
            @click="thisWeek"
            class="px-3 py-2 rounded-xl border border-line text-sm font-semibold hover:border-brand-500 transition-all"
        >
          {{ weekLabel }}
        </button>
        <button
            @click="nextWeek"
            class="px-3 py-2 rounded-xl border border-line text-sm font-semibold hover:border-brand-500 transition-all"
        >
          →
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-muted">Lade Buchungen…</div>
    <div v-else-if="errorMsg" class="text-center py-12 text-red-600 font-semibold">{{ errorMsg }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
      <div
          v-for="(day, index) in bookingsByDay"
          :key="index"
          class="bg-surface border border-line rounded-card p-4 min-h-[140px] flex flex-col gap-3"
      >
        <div class="flex items-baseline justify-between">
          <span class="text-sm font-extrabold text-ink">{{ weekdayLabels[index] }}</span>
          <span class="text-xs text-muted">{{ dateForDay(index) }}</span>
        </div>

        <div v-if="day.length === 0" class="text-xs text-muted italic">Keine Termine</div>

        <div
            v-for="booking in day"
            :key="booking.id"
            class="rounded-xl p-3 text-xs space-y-1"
            :class="booking.status === 'waitlist' ? 'bg-amber-50 border border-amber-200' : 'bg-mint-bg border border-line'"
        >
          <p class="font-bold text-ink">{{ booking.sessions.courses.title }}</p>
          <p class="text-muted">{{ booking.sessions.courses.club }}</p>
          <p class="text-ink/80">
            🕒 {{ formatTime(booking.sessions.starts_at) }} – {{ formatTime(booking.sessions.ends_at) }}
          </p>
          <p class="text-ink/80">👤 {{ booking.child_name }}</p>
          <span
              v-if="booking.status === 'waitlist'"
              class="inline-block text-[10px] font-bold text-amber-700"
          >
            ⏳ Warteliste
          </span>
        </div>
      </div>
    </div>

  </div>
</template>