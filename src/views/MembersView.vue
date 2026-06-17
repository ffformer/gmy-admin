<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { memberApi } from '@/api/http'
import type { Member } from '@/api/types'

const loading = ref(false)
const showModal = ref(false)
const rows = ref<Member[]>([])
const total = ref(0)
const error = ref('')

const query = reactive({
  page: 1,
  pageSize: 8,
  keyword: '',
  status: '',
  type: '',
})

const form = reactive<Partial<Member>>({})

const statusText: Record<Member['status'], string> = {
  active: '正常',
  expiring: '即将到期',
  inactive: '已停用',
}

const statusClass: Record<Member['status'], string> = {
  active: 'success',
  expiring: 'warning',
  inactive: 'danger',
}

const title = computed(() => (form.id ? '编辑会员' : '新增会员'))

async function fetchData() {
  loading.value = true
  try {
    const result = await memberApi.page(query)
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

function reset() {
  query.keyword = ''
  query.status = ''
  query.type = ''
  search()
}

function openCreate() {
  Object.assign(form, {
    id: undefined,
    name: '',
    phone: '',
    level: '年卡会员',
    status: 'active',
    coach: '李牧',
    expireDate: '2027-01-01',
    balance: 0,
  })
  error.value = ''
  showModal.value = true
}

function openEdit(row: Member) {
  Object.assign(form, row)
  error.value = ''
  showModal.value = true
}

async function submit() {
  if (!form.name || !form.phone) {
    error.value = '请填写会员姓名和手机号'
    return
  }

  await memberApi.save(form)
  showModal.value = false
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="page-title">
      <div>
        <h1>会员管理</h1>
        <p>覆盖会员查询、状态筛选、分页、创建与编辑回填。</p>
      </div>
      <button class="btn primary" @click="openCreate">
        <AppIcon name="plus" />
        新增会员
      </button>
    </div>

    <section class="panel">
      <div class="toolbar">
        <label class="field">
          <span>关键词</span>
          <input v-model.trim="query.keyword" class="input" placeholder="姓名 / 手机号 / 教练" @keyup.enter="search" />
        </label>
        <label class="field">
          <span>会员状态</span>
          <select v-model="query.status" class="select">
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="expiring">即将到期</option>
            <option value="inactive">已停用</option>
          </select>
        </label>
        <label class="field">
          <span>会员类型</span>
          <select v-model="query.type" class="select">
            <option value="">全部类型</option>
            <option>私教会员</option>
            <option>年卡会员</option>
            <option>季卡会员</option>
            <option>体验会员</option>
          </select>
        </label>
        <button class="btn" @click="reset">重置</button>
        <button class="btn primary" @click="search">
          <AppIcon name="search" />
          搜索
        </button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>会员</th>
              <th>手机号</th>
              <th>类型</th>
              <th>状态</th>
              <th>专属教练</th>
              <th>到期时间</th>
              <th>余额</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8">加载中...</td>
            </tr>
            <tr v-for="row in rows" :key="row.id">
              <td>
                <div class="member-cell">
                  <span>{{ row.avatar }}</span>
                  <strong>{{ row.name }}</strong>
                </div>
              </td>
              <td>{{ row.phone }}</td>
              <td>{{ row.level }}</td>
              <td><span class="tag" :class="statusClass[row.status]">{{ statusText[row.status] }}</span></td>
              <td>{{ row.coach }}</td>
              <td>{{ row.expireDate }}</td>
              <td>¥{{ row.balance.toLocaleString('zh-CN') }}</td>
              <td><button class="btn subtle" @click="openEdit(row)">编辑</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationBar :page="query.page" :page-size="query.pageSize" :total="total" @change="query.page = $event; fetchData()" />
    </section>

    <div v-if="showModal" class="modal-mask">
      <form class="modal" @submit.prevent="submit">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="icon-btn" type="button" title="关闭" @click="showModal = false">
            <AppIcon name="close" />
          </button>
        </div>
        <div class="modal-body form-grid">
          <label class="field">
            <span>姓名</span>
            <input v-model.trim="form.name" class="input" />
          </label>
          <label class="field">
            <span>手机号</span>
            <input v-model.trim="form.phone" class="input" />
          </label>
          <label class="field">
            <span>会员类型</span>
            <select v-model="form.level" class="select">
              <option>私教会员</option>
              <option>年卡会员</option>
              <option>季卡会员</option>
              <option>体验会员</option>
            </select>
          </label>
          <label class="field">
            <span>状态</span>
            <select v-model="form.status" class="select">
              <option value="active">正常</option>
              <option value="expiring">即将到期</option>
              <option value="inactive">已停用</option>
            </select>
          </label>
          <label class="field">
            <span>专属教练</span>
            <input v-model.trim="form.coach" class="input" />
          </label>
          <label class="field">
            <span>到期时间</span>
            <input v-model="form.expireDate" class="input" type="date" />
          </label>
          <label class="field">
            <span>账户余额</span>
            <input v-model.number="form.balance" class="input" type="number" min="0" />
          </label>
          <p v-if="error" class="form-error">{{ error }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn subtle" type="button" @click="showModal = false">取消</button>
          <button class="btn primary" type="submit">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.member-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-cell span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: var(--surface-soft);
  color: var(--brand);
  font-weight: 900;
}

.form-grid {
  grid-template-columns: 1fr 1fr;
}

.form-error {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--danger);
  font-weight: 700;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
