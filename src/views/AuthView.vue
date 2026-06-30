<script setup lang="ts">
import AuthForm from '../components/AuthForm.vue'
</script>

<template>
  <div class="w-full py-12">
    <div class="max-w-md mx-auto space-y-6 text-center mb-8">
      <h2 class="text-2xl font-extrabold text-ink tracking-tight">
        Willkommen bei FitKid
      </h2>
      <p class="text-sm text-muted">
        Logge dich ein, um deine Buchungen zu verwalten und neue Kurse zu sichern.
      </p>
    </div>
    <AuthForm />
  </div>
</template>