<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path: string) => route.path === path
const isLoginPage = () => route.name === 'login'
</script>

<template>
  <div class="min-h-screen bg-surface-muted font-sans flex flex-col">

    <!-- Navigation: ausgeblendet auf der Login-Seite -->
    <header v-if="!isLoginPage()" class="bg-surface border-b border-line sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <!-- Logo (Klick bringt dich immer zu Home) -->
        <router-link to="/" class="font-bold text-lg text-ink" style="text-decoration: none;">
          ⚽ FitKid
        </router-link>

        <!-- Die beiden einzigen funktionierenden Routen -->
        <nav class="flex items-center gap-4">

          <router-link
              to="/"
              class="px-4 py-2 rounded-xl text-sm font-semibold"
              :class="isActive('/') ? 'bg-brand-50 text-brand-500' : 'text-muted hover:bg-surface-muted'"
              style="text-decoration: none;"
          >
            🏠 Home
          </router-link>

          <router-link
              to="/explore"
              class="px-4 py-2 rounded-xl text-sm font-semibold"
              :class="isActive('/explore') ? 'bg-brand-50 text-brand-500' : 'text-muted hover:bg-surface-muted'"
              style="text-decoration: none;"
          >
            🔍 Sport-Suche
          </router-link>
          <router-link
              to="/pricing"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-decoration-none"
              :class="isActive('/pricing') ? 'bg-brand-50 text-brand-500' : 'text-muted hover:bg-surface-muted'"
          >
            💳 Abos
          </router-link>

          <router-link
              to="/meine-buchungen"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-decoration-none"
              :class="isActive('/meine-buchungen') ? 'bg-brand-50 text-brand-500' : 'text-muted hover:bg-surface-muted'"
          >
            📅 Buchungen
          </router-link>

        </nav>
      </div>
    </header>

    <!-- Hier werden die Ansichten reingeladen -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

  </div>
</template>