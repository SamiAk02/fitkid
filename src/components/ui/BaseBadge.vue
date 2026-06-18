<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ tone?: 'mint' | 'sky' | 'warn' }>(), { tone: 'mint' })

const toneClasses: Record<string, string> = {
  mint: 'bg-mint-bg text-mint-text',
  sky: 'bg-sky-50 text-sky-700',
  warn: 'bg-warn-bg text-warn-text',
}

const classes = computed(
    () => `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[props.tone]}`,
)
</script>

<template>
  <span :class="classes"><slot /></span>
</template>