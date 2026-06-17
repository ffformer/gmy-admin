<script setup lang="ts">
defineProps<{
  data: number[]
  labels: string[]
}>()
</script>

<template>
  <div class="chart" aria-label="趋势柱状图">
    <div v-for="(item, index) in data" :key="index" class="bar-item">
      <div class="bar-track">
        <span class="bar" :style="{ height: `${Math.max(item, 8)}%` }"></span>
      </div>
      <small>{{ labels[index] }}</small>
    </div>
  </div>
</template>

<style scoped>
.chart {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  min-height: 230px;
  align-items: end;
}

.bar-item {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.bar-track {
  position: relative;
  width: 100%;
  height: 190px;
  border-radius: 8px;
  background: var(--surface-soft);
  overflow: hidden;
}

.bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(180deg, var(--brand), var(--accent));
}

small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}
</style>
