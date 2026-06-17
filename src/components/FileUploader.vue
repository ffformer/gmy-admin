<script setup lang="ts">
import { ref } from 'vue'
import { uploadApi } from '@/api/http'

interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

const uploading = ref(false)
const files = ref<UploadedFile[]>([])
const error = ref('')

async function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  error.value = ''
  if (file.size > 5 * 1024 * 1024) {
    error.value = '文件不能超过 5MB'
    input.value = ''
    return
  }

  uploading.value = true
  try {
    files.value.unshift(await uploadApi.upload(file))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '上传失败'
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>

<template>
  <section class="uploader panel">
    <label class="dropzone">
      <input type="file" accept=".png,.jpg,.jpeg,.pdf,.xlsx,.csv" @change="onChange" />
      <strong>{{ uploading ? '上传中...' : '选择文件上传' }}</strong>
      <span>支持图片、PDF、Excel 和 CSV，单文件不超过 5MB</span>
    </label>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="files.length" class="file-list">
      <article v-for="file in files" :key="file.url" class="file-row">
        <div>
          <strong>{{ file.name }}</strong>
          <span>{{ (file.size / 1024).toFixed(1) }} KB · {{ file.type }}</span>
        </div>
        <a class="btn subtle" :href="file.url" target="_blank" rel="noreferrer">预览</a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.uploader {
  padding: 18px;
}

.dropzone {
  display: grid;
  min-height: 190px;
  place-items: center;
  gap: 8px;
  border: 1px dashed #bcb3a7;
  border-radius: 8px;
  background: var(--surface-soft);
  text-align: center;
}

.dropzone input {
  display: none;
}

.dropzone strong {
  font-size: 20px;
}

.dropzone span,
.file-row span {
  color: var(--muted);
}

.error {
  margin: 12px 0 0;
  color: var(--danger);
  font-weight: 700;
}

.file-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  background: var(--surface);
}

.file-row div {
  display: grid;
  gap: 4px;
}
</style>
