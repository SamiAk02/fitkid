<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CourseCard from '../components/ui/CourseCard.vue'
import { courses as allCourses, categories, type CategoryKey } from '../data/courses'

const router = useRouter()
const courses = ref(allCourses)        // bestehende Filterlogik nutzt courses.value weiter
// ⛔️ die alten lokalen `categories`- und `courses`-Blöcke hier löschen
export type CategoryKey =
    | 'turnen'
    | 'schwimmen'
    | 'fussball'
    | 'tanzen'
    | 'kampfsport'
    | 'leichtathletik'

export interface Course {
  id: string
  title: string
  club: string
  category: CategoryKey
  address: string
  price: string
  time: string
  ageGroup: string
  spotsLeft: number
  includedInPlan?: 'aktiv' | 'familie'
}


const searchQuery = ref('')
const activeCategory = ref<CategoryKey | null>(null)

const categoryList = computed(
    () => Object.entries(categories) as [CategoryKey, (typeof categories)[CategoryKey]][]
)

const filteredCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return courses.value.filter((c) => {
    if (activeCategory.value && c.category !== activeCategory.value) return false
    if (!q) return true
    const haystack = `${c.title} ${c.club} ${c.address} ${categories[c.category].label}`.toLowerCase()
    return haystack.includes(q)
  })
})

function toggleCategory(key: CategoryKey) {
  activeCategory.value = activeCategory.value === key ? null : key
}
</script>

<template>
  <div class="w-full space-y-10">

    <!-- Hero Banner -->
    <section class="bg-gradient-to-br from-brand-700 to-brand-800 rounded-card p-8 sm:p-12 text-white shadow-sm relative overflow-hidden">
      <div class="max-w-xl relative z-10 space-y-4">
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
          Alle Sportkurse auf einen Blick.
        </h2>
        <p class="text-sm text-mint-bg/90 max-w-md">
          Finde freie Plätze in Vereinen in Haar, München und Umgebung. Nutze die Karte,
          um Kurse in deiner direkten Nachbarschaft zu entdecken.
        </p>
        <div class="pt-2 flex gap-3">
          <button
              @click="router.push('/explore')"
              class="bg-white text-brand-800 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-brand-50 transition-all"
          >
            🗺️ Zur interaktiven Karte
          </button>
        </div>
      </div>
    </section>

    <!-- Suchleiste -->
    <div class="relative max-w-2xl">
      <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-lg">🔍</span>
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Kurs, Verein oder Stadtteil suchen…"
          class="w-full bg-surface border border-line rounded-2xl py-3.5 pl-12 pr-4 text-sm text-ink placeholder-muted focus:outline-none focus:border-brand-500 transition-all shadow-sm"
      />
    </div>

    <!-- Dezenter BuT-Hinweis -->
    <div class="rounded-2xl bg-mint-bg border border-line px-4 py-3 flex items-center gap-3">
      <span class="text-lg">🤝</span>
      <p class="text-sm text-ink/80 flex-1">
        Wenig Budget? Der Staat zahlt über das Bildungspaket 15 €/Monat zum Vereinsbeitrag dazu.
      </p>
      <button
          @click="router.push('/but')"
          class="text-sm font-bold text-brand-700 hover:underline whitespace-nowrap"
      >
        Anspruch prüfen →
      </button>
    </div>

    <!-- Kategorie-Filter -->
    <div class="flex flex-wrap gap-2">
      <button
          @click="activeCategory = null"
          class="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
          :class="!activeCategory ? 'bg-brand-700 text-white border-brand-700' : 'bg-surface text-ink border-line hover:border-brand-500'"
      >
        Alle
      </button>
      <button
          v-for="[key, cfg] in categoryList"
          :key="key"
          @click="toggleCategory(key)"
          class="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
          :class="activeCategory === key ? 'bg-brand-700 text-white border-brand-700' : 'bg-surface text-ink border-line hover:border-brand-500'"
      >
        {{ cfg.icon }} {{ cfg.label }}
      </button>
    </div>

    <!-- Kartenliste -->
    <section class="space-y-6">
      <div class="flex items-baseline justify-between">
        <h3 class="font-extrabold text-ink text-xl tracking-tight">Aktuelle Sportangebote</h3>
        <span class="text-sm text-muted">{{ filteredCourses.length }} Kurse</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        <CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" />
      </div>

      <div
          v-if="filteredCourses.length === 0"
          class="text-center py-12 text-muted border border-dashed border-line rounded-card bg-surface"
      >
        Keine Kurse für deine Suche gefunden.
      </div>
    </section>

  </div>
</template>