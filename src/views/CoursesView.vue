<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { courseApi } from '@/api/http'
import type { Course } from '@/api/types'

const rows = ref<Course[]>([])
const total = ref(0)
const loading = ref(false)
const query = reactive({
  page: 1,
  pageSize: 6,
  keyword: '',
  status: '',
  type: '',
})

const statusText: Record<Course['status'], string> = {
  open: '预约中',
  full: '已满员',
  closed: '已停课',
}

const statusClass: Record<Course['status'], string> = {
  open: 'success',
  full: 'warning',
  closed: 'danger',
}

async function fetchData() {
  loading.value = true
  try {
    const result = await courseApi.page(query)
    rows.value = result.list
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function search() {
  query.page = 1
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="page-title">
      <div>
        <h1>课程排期</h1>
        <p>按课程类型、预约状态和教练检索团课排期。</p>
      </div>
    </div>

    <section class="panel">
      <div class="toolbar">
        <label class="field">
          <span>关键词</span>
          <input v-model.trim="query.keyword" class="input" placeholder="课程 / 教练 / 教室" @keyup.enter="search" />
        </label>
        <label class="field">
          <span>课程状态</span>
          <select v-model="query.status" class="select">
            <option value="">全部状态</option>
            <option value="open">预约中</option>
            <option value="full">已满员</option>
            <option value="closed">已停课</option>
          </select>
        </label>
        <label class="field">
          <span>课程类型</span>
          <select v-model="query.type" class="select">
            <option value="">全部类型</option>
            <option>力量训练</option>
            <option>燃脂塑形</option>
            <option>瑜伽普拉提</option>
            <option>康复拉伸</option>
          </select>
        </label>
        <span></span>
        <button class="btn primary" @click="search">搜索</button>
      </div>

      <div class="course-grid">
        <article v-for="course in rows" :key="course.id" class="course-card">
          <div class="course-head">
            <div>
              <span>{{ course.type }}</span>
              <h2>{{ course.name }}</h2>
            </div>
            <span class="tag" :class="statusClass[course.status]">{{ statusText[course.status] }}</span>
          </div>
          <div class="course-meta">
            <span>教练 {{ course.coach }}</span>
            <span>{{ course.room }}</span>
            <span>{{ course.time }}</span>
          </div>
          <div class="progress">
            <span :style="{ width: `${(course.booked / course.capacity) * 100}%` }"></span>
          </div>
          <p>{{ course.booked }} / {{ course.capacity }} 已预约</p>
        </article>
        <p v-if="loading" class="loading">加载中...</p>
      </div>

      <PaginationBar :page="query.page" :page-size="query.pageSize" :total="total" @change="query.page = $event; fetchData()" />
    </section>
  </div>
</template>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  padding: 16px;
}

.course-card {
  display: grid;
  gap: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  background: var(--surface);
}

.course-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.course-head span:first-child {
  color: var(--brand);
  font-size: 12px;
  font-weight: 900;
}

.course-head h2 {
  margin: 6px 0 0;
  font-size: 18px;
}

.course-meta {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-weight: 700;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: var(--surface-soft);
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--brand);
}

.course-card p,
.loading {
  margin: 0;
  color: var(--muted);
  font-weight: 800;
}

@media (max-width: 1120px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
