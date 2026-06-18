<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { GoogleMap, Marker, InfoWindow, Circle } from 'vue3-google-map'
import CourseCard from '../components/ui/CourseCard.vue'
import { courses, type Course } from '@/data/courses'

type CourseWithDistance = Course & { distance: number | null }

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Startansicht: München/Haar-Mittelpunkt
const defaultCenter = { lat: 48.135, lng: 11.61 }
const mapCenter = ref({ ...defaultCenter })
const userLocation = ref<{ lat: number; lng: number } | null>(null)

const viewMode = ref<'map' | 'list'>('map')
const selectedCourse = ref<CourseWithDistance | null>(null)
const selectedRadius = ref<number>(10)
const isLocating = ref<boolean>(false)

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

// Alle Kurse, bei Ortung nach Entfernung sortiert
const coursesWithDistance = computed<CourseWithDistance[]>(() => {
  if (!userLocation.value) return courses.map((c) => ({ ...c, distance: null }))
  const loc = userLocation.value
  return courses
      .map((c) => ({ ...c, distance: calculateDistance(loc.lat, loc.lng, c.position.lat, c.position.lng) }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
})

const withinRadius = computed(() =>
    userLocation.value
        ? coursesWithDistance.value.filter((c) => (c.distance ?? Infinity) <= selectedRadius.value)
        : coursesWithDistance.value
)

// Fallback: wenn im Radius nichts liegt, zeige die nächstgelegenen statt einer leeren Karte
const radiusEmpty = computed(() => !!userLocation.value && withinRadius.value.length === 0)
const filteredCourses = computed(() =>
    radiusEmpty.value ? coursesWithDistance.value : withinRadius.value
)

function getUserLocation() {
  if (!navigator.geolocation) return
  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        userLocation.value = coords
        mapCenter.value = coords
        isLocating.value = false
      },
      () => {
        isLocating.value = false
      }
  )
}

onMounted(getUserLocation)
</script>

<template>
  <div class="w-full space-y-6">

    <header class="bg-surface border border-line rounded-card p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-black text-ink tracking-tight">Sportangebote im Umkreis</h1>
        <p class="text-sm text-muted">
          <template v-if="radiusEmpty">
            Keine Kurse im {{ selectedRadius }}-km-Umkreis – wir zeigen dir die nächstgelegenen ({{ filteredCourses.length }}).
          </template>
          <template v-else>
            {{ filteredCourses.length }} Angebote{{ userLocation ? ' in deinem Umkreis' : '' }} gefunden.
          </template>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div class="flex items-center gap-2 bg-surface-muted border border-line px-3 py-2 rounded-xl">
          <label for="radius" class="text-xs font-bold text-ink uppercase tracking-wider">Radius:</label>
          <select id="radius" v-model="selectedRadius" class="bg-transparent border-none text-sm font-semibold text-brand-500 focus:outline-none cursor-pointer">
            <option :value="2">2 km</option>
            <option :value="5">5 km</option>
            <option :value="10">10 km</option>
            <option :value="20">20 km</option>
          </select>
        </div>

        <button @click="getUserLocation" :disabled="isLocating" class="bg-surface border border-line hover:bg-surface-muted p-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
          {{ isLocating ? '📍 Ortung…' : '🎯 Ort aktualisieren' }}
        </button>

        <div class="bg-surface-muted p-1 rounded-xl border border-line flex gap-1 ml-auto md:ml-0">
          <button @click="viewMode = 'map'" :class="[viewMode === 'map' ? 'bg-surface shadow-sm text-brand-500' : 'text-muted', 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all']">🗺️ Karte</button>
          <button @click="viewMode = 'list'" :class="[viewMode === 'list' ? 'bg-surface shadow-sm text-brand-500' : 'text-muted', 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all']">📋 Liste</button>
        </div>
      </div>
    </header>

    <div v-if="viewMode === 'map'" class="w-full h-[600px] rounded-card overflow-hidden border border-line shadow-sm relative">
      <GoogleMap :api-key="apiKey" class="w-full h-full" :center="mapCenter" :zoom="userLocation ? 13 : 11">
        <Circle v-if="userLocation" :options="{ center: userLocation, radius: selectedRadius * 1000, fillColor: '#10b981', fillOpacity: 0.08, strokeColor: '#10b981', strokeOpacity: 0.4, strokeWeight: 1 }" />
        <Marker v-if="userLocation" :options="{ position: userLocation, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', title: 'Du bist hier' }" />
        <Marker v-for="course in filteredCourses" :key="course.id" :options="{ position: course.position }" @click="selectedCourse = course" />

        <InfoWindow v-if="selectedCourse" :options="{ position: selectedCourse.position }" @closeclick="selectedCourse = null">
          <div class="p-2 max-w-xs font-sans">
            <span class="text-[10px] font-bold text-brand-500 uppercase block">{{ selectedCourse.club }}</span>
            <h4 class="font-bold text-ink text-sm mt-0.5">{{ selectedCourse.title }}</h4>
            <p class="text-xs text-muted mt-1">🕒 {{ selectedCourse.time }} • 💰 {{ selectedCourse.price }}</p>
            <p class="text-[11px] text-muted mt-1">📍 {{ selectedCourse.address }}</p>
            <p v-if="selectedCourse.distance !== null" class="text-[11px] text-brand-500 font-semibold mt-1">
              ~ {{ selectedCourse.distance.toFixed(1) }} km entfernt
            </p>
          </div>
        </InfoWindow>
      </GoogleMap>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      <CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" />
    </div>

  </div>
</template>