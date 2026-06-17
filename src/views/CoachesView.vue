<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { coachApi } from '@/api/http'
import type { Coach } from '@/api/types'

const rows = ref<Coach[]>([])
const total = ref(0)
const query = reactive({
  page: 1,
  pageSize: 5,
  keyword: '',
  status: '',
})

async function fetchData() {
  const result = await coachApi.page(query)
  rows.value = result.list
  total.value = result.total
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
        <h1>教练绩效</h1>
        <p>展示教练课程量、评分、成交转化与在岗状态。</p>
      </div>
    </div>

    <section class="panel">
      <div class="toolbar coach-toolbar">
        <label class="field">
          <span>关键词</span>
          <input v-model.trim="query.keyword" class="input" placeholder="姓名 / 专长 / 手机号" @keyup.enter="search" />
        </label>
        <label class="field">
          <span>状态</span>
          <select v-model="query.status" class="select">
            <option value="">全部</option>
            <option value="active">在岗</option>
            <option value="vacation">休假</option>
          </select>
        </label>
        <button class="btn primary" @click="search">搜索</button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>教练</th>
              <th>专长</th>
              <th>评分</th>
              <th>授课数</th>
              <th>转化率</th>
              <th>手机号</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coach in rows" :key="coach.id">
              <td><strong>{{ coach.name }}</strong></td>
              <td>{{ coach.specialty }}</td>
              <td>{{ coach.rating }}</td>
              <td>{{ coach.lessons }}</td>
              <td>{{ coach.conversion }}%</td>
              <td>{{ coach.phone }}</td>
              <td>
                <span class="tag" :class="coach.status === 'active' ? 'success' : 'warning'">
                  {{ coach.status === 'active' ? '在岗' : '休假' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationBar :page="query.page" :page-size="query.pageSize" :total="total" @change="query.page = $event; fetchData()" />
    </section>
  </div>
</template>

<style scoped>
.coach-toolbar {
  grid-template-columns: minmax(220px, 1fr) minmax(140px, 180px) auto;
}
</style>
