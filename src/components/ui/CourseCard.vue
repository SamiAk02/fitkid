<script setup lang="ts">
import { computed } from 'vue'
import { categories, type Course } from '../../data/courses'

const props = defineProps<{ course: Course }>()

const cat = computed(() => categories[props.course.category])
const isFull = computed(() => props.course.spotsLeft <= 0)
const isFree = computed(() => /gratis/i.test(props.course.price))
</script>

<template>
  <div
      class="h-full flex flex-col bg-surface border border-line rounded-card p-5 shadow-sm hover:shadow-md hover:border-brand-500 transition-all"
  >

    <!-- Kopf: Kategorie + Status -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" :class="cat.badge">
        {{ cat.icon }} {{ cat.label }}
      </span>
      <span
          class="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
          :class="isFull ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
      >
        {{ isFull ? '⏳ Warteliste' : `✓ ${course.spotsLeft} Plätze frei` }}
      </span>
    </div>

    <!-- Titel + Verein -->
    <h4 class="font-extrabold text-ink text-base leading-snug tracking-tight">{{ course.title }}</h4>
    <p class="text-sm text-muted mt-0.5">{{ course.club }}</p>

    <!-- Info-Raster -->
    <div class="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-ink/80">
      <p class="flex items-center gap-1.5"><span>🎂</span>{{ course.ageGroup }}</p>
      <p class="flex items-center gap-1.5"><span>🕒</span>{{ course.time }}</p>
      <p class="flex items-center gap-1.5 col-span-2"><span>📍</span>{{ course.address }}</p>
    </div>

    <!-- Fußzeile: Preis + Abo-Hinweis + CTA (dank mt-auto immer unten) -->
    <div class="mt-auto pt-5 flex items-end justify-between gap-3">
      <div class="flex flex-col gap-1">
        <span
            class="text-sm font-bold px-2.5 py-1 rounded-lg w-fit"
            :class="isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-mint-bg text-ink'"
        >
          {{ course.price }}
        </span>
        <span
            v-if="course.includedInPlan"
            class="text-[11px] font-semibold text-brand-700 flex items-center gap-1"
        >
          🎟️ Im {{ course.includedInPlan === 'aktiv' ? 'Aktiv' : 'Familie+' }}-Abo enthalten
        </span>
      </div>
      <button
          class="text-sm font-bold px-4 py-2 rounded-xl transition-all"
          :class="isFull
          ? 'bg-surface border border-line text-ink hover:border-brand-500'
          : 'bg-brand-700 text-white hover:bg-brand-800'"
      >
        {{ isFull ? 'Auf Warteliste' : 'Platz sichern' }}
      </button>
    </div>
  </div>
</template>