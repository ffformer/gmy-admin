<script setup lang="ts">
const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

function previous() {
  emit('change', Math.max(props.page - 1, 1))
}

function next() {
  emit('change', Math.min(props.page + 1, Math.ceil(props.total / props.pageSize) || 1))
}
</script>

<template>
  <div class="pagination">
    <span>共 {{ total }} 条，第 {{ page }} / {{ Math.ceil(total / pageSize) || 1 }} 页</span>
    <div class="pagination-actions">
      <button class="btn subtle" :disabled="page <= 1" @click="previous">上一页</button>
      <button class="btn subtle" :disabled="page >= Math.ceil(total / pageSize)" @click="next">
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
}
</style>
