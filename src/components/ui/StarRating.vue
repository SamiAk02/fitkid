<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabaseClient'

const props = defineProps<{ courseId: string }>()

const userRating = ref(0)
const avgRating = ref(0)
const totalRatings = ref(0)
const hoveredStar = ref(0)
const submitting = ref(false)

async function load() {
  const { data: userData } = await supabase.auth.getUser()

  // Durchschnitt laden
  const { data: all } = await supabase
      .from('ratings')
      .select('stars')
      .eq('course_id', props.courseId)

  if (all && all.length > 0) {
    totalRatings.value = all.length
    avgRating.value = Math.round((all.reduce((s, r) => s + r.stars, 0) / all.length) * 10) / 10
  }

  // Eigene Bewertung laden
  if (userData.user) {
    const { data: own } = await supabase
        .from('ratings')
        .select('stars')
        .eq('course_id', props.courseId)
        .eq('user_id', userData.user.id)
        .maybeSingle()

    if (own) userRating.value = own.stars
  }
}

async function rate(stars: number) {
  submitting.value = true
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return

  await supabase.from('ratings').upsert(
      { course_id: props.courseId, user_id: userData.user.id, stars },
      { onConflict: 'course_id,user_id' }
  )

  userRating.value = stars
  await load()
  submitting.value = false
}

onMounted(load)
</script>

<template>
  <div class="flex items-center gap-2 mt-3">
    <!-- Sterne -->
    <div class="flex items-center gap-0.5">
      <button
          v-for="star in 5"
          :key="star"
          @click="rate(star)"
          @mouseenter="hoveredStar = star"
          @mouseleave="hoveredStar = 0"
          :disabled="submitting"
          class="text-lg leading-none transition-transform hover:scale-110 disabled:opacity-50"
      >
        <span :class="star <= (hoveredStar || userRating) ? 'text-amber-400' : 'text-line'">★</span>
      </button>
    </div>

    <!-- Durchschnitt -->
    <span v-if="totalRatings > 0" class="text-xs text-muted">
      {{ avgRating }} ({{ totalRatings }})
    </span>
    <span v-else class="text-xs text-muted">Noch keine Bewertung</span>
  </div>
</template>