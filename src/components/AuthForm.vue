<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const route = useRoute()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const fullName = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Referral-Code aus URL auslesen (?ref=XXXXX)
const refCode = ref((route.query.ref as string) ?? '')

function resetMessages() {
  errorMsg.value = ''
  successMsg.value = ''
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function handleSubmit() {
  resetMessages()

  if (!email.value.trim() || !password.value.trim()) {
    errorMsg.value = 'Bitte E-Mail und Passwort angeben.'
    return
  }
  if (mode.value === 'signup' && !fullName.value.trim()) {
    errorMsg.value = 'Bitte deinen Namen angeben.'
    return
  }

  loading.value = true

  try {
    if (mode.value === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: email.value.trim(),
        password: password.value,
      })
      if (error) throw error

      if (data.user) {
        // Profil mit zufälligem Referral-Code anlegen
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName.value.trim(),
          referral_code: generateReferralCode(),
        })

        // Falls über Referral-Link registriert, Bonus dem Werber gutschreiben
        if (refCode.value) {
          await supabase.rpc('apply_referral', {
            p_referral_code: refCode.value,
            p_referred_id: data.user.id,
          })
        }
      }

      successMsg.value = data.session
          ? 'Konto erstellt! Du bist eingeloggt.'
          : 'Konto erstellt! Bitte bestätige deine E-Mail-Adresse.'

      if (data.session) router.push('/')

    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value,
      })
      if (error) throw error
      router.push('/')
    }
  } catch (err) {
    errorMsg.value = err instanceof Error ? err.message : 'Etwas ist schiefgelaufen.'
  } finally {
    loading.value = false
  }
}

function switchMode(newMode: 'login' | 'signup') {
  mode.value = newMode
  resetMessages()
}
</script>

<template>
  <div class="max-w-sm mx-auto bg-surface border border-line rounded-card p-6 shadow-sm space-y-5">

    <!-- Tabs -->
    <div class="flex gap-2 bg-mint-bg p-1 rounded-xl">
      <button
          @click="switchMode('login')"
          class="flex-1 text-sm font-bold py-2 rounded-lg transition-all"
          :class="mode === 'login' ? 'bg-surface text-ink shadow-sm' : 'text-muted'"
      >
        Login
      </button>
      <button
          @click="switchMode('signup')"
          class="flex-1 text-sm font-bold py-2 rounded-lg transition-all"
          :class="mode === 'signup' ? 'bg-surface text-ink shadow-sm' : 'text-muted'"
      >
        Registrieren
      </button>
    </div>

    <!-- Referral-Hinweis falls Link genutzt -->
    <div v-if="refCode && mode === 'signup'" class="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 font-semibold">
      🎉 Du wurdest eingeladen! Nach der Registrierung bekommt dein Freund/deine Freundin 5% Rabatt.
    </div>

    <!-- Demo-Hinweis -->
    <div class="bg-mint-bg border border-line rounded-xl px-4 py-3 text-xs text-muted space-y-1">
      <p class="font-bold text-ink">Demo-Zugang:</p>
      <p>demo@fitkid.app / Demo2026!</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div v-if="mode === 'signup'">
        <label class="text-xs font-semibold text-ink/70">Name</label>
        <input
            v-model="fullName"
            type="text"
            class="w-full mt-1 bg-mint-bg border border-line rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
            placeholder="Dein Name"
        />
      </div>

      <div>
        <label class="text-xs font-semibold text-ink/70">E-Mail</label>
        <input
            v-model="email"
            type="email"
            class="w-full mt-1 bg-mint-bg border border-line rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
            placeholder="du@beispiel.de"
        />
      </div>

      <div>
        <label class="text-xs font-semibold text-ink/70">Passwort</label>
        <input
            v-model="password"
            type="password"
            class="w-full mt-1 bg-mint-bg border border-line rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
            placeholder="••••••••"
        />
      </div>

      <p v-if="errorMsg" class="text-xs text-red-600 font-semibold">{{ errorMsg }}</p>
      <p v-if="successMsg" class="text-xs text-emerald-600 font-semibold">{{ successMsg }}</p>

      <button
          type="submit"
          :disabled="loading"
          class="w-full text-sm font-bold px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 transition-all disabled:opacity-50"
      >
        {{ loading ? '...' : (mode === 'login' ? 'Einloggen' : 'Konto erstellen') }}
      </button>
    </form>
  </div>
</template>