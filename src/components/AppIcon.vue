<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      v-if="name === 'grid'"
      d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
    />
    <path
      v-else-if="name === 'users'"
      d="M8.5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7-1a3.5 3.5 0 1 1 .01 0H15.5ZM2.5 20a6 6 0 0 1 12 0v.5h-12V20Zm12.2.5a7.4 7.4 0 0 0-1.6-4.6 5 5 0 0 1 8.4 3.6v1h-6.8Z"
    />
    <path
      v-else-if="name === 'calendar'"
      d="M7 2h2v3h6V2h2v3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM6 13h4v4H6v-4Z"
    />
    <path
      v-else-if="name === 'award'"
      d="M12 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm-4 1.2A8 8 0 0 0 12 16a8 8 0 0 0 4-.8V22l-4-2.2L8 22v-6.8Z"
    />
    <path
      v-else-if="name === 'upload'"
      d="M11 16V7.8l-3.3 3.3-1.4-1.4L12 4l5.7 5.7-1.4 1.4L13 7.8V16h-2Zm-6 2h14v2H5v-2Z"
    />
    <path
      v-else-if="name === 'logout'"
      d="M4 3h9v2H6v14h7v2H4V3Zm11.5 5 4 4-4 4-1.4-1.4 1.6-1.6H10v-2h5.7l-1.6-1.6L15.5 8Z"
    />
    <path
      v-else-if="name === 'search'"
      d="M10.5 4a6.5 6.5 0 0 1 5.1 10.5l4 4-1.4 1.4-4-4A6.5 6.5 0 1 1 10.5 4Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
    />
    <path
      v-else-if="name === 'plus'"
      d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"
    />
    <path
      v-else-if="name === 'close'"
      d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z"
    />
    <path v-else d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7-6.6 3.7L5.4 8 12 4.3Zm-7 5.4 6 3.4v6.2l-6-3.3V9.7Zm8 9.6v-6.2l6-3.4V16l-6 3.3Z" />
  </svg>
</template>

<style scoped>
.app-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
