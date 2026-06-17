<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  helper: string
  tone?: 'green' | 'orange' | 'dark'
}>()
</script>

<template>
  <article class="metric" :class="tone">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <small>{{ helper }}</small>
  </article>
</template>

<style scoped>
.metric {
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.metric span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

.metric strong {
  font-size: 30px;
  line-height: 1;
}

.metric small {
  color: var(--muted);
}

.metric.green {
  border-color: rgb(15 118 110 / 25%);
}

.metric.orange {
  border-color: rgb(192 86 33 / 25%);
}

.metric.dark {
  border-color: rgb(31 36 33 / 20%);
}
</style>
