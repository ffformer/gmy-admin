<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { memberApi } from '@/api/http'
import type { Member } from '@/api/types'

const rows = ref<Member[]>([])
const total = ref(0)
const loading = ref(false)
const showModal = ref(false)
const error = ref('')

const query = reactive({ page: 1, pageSize: 8, keyword: '', status: '', type: '' })
const form = reactive<Partial<Member>>({})

const statusMap = {
  active: ['正常', 'success'],
  expiring: ['即将到期', 'warning'],
  inactive: ['已停用', 'danger'],
} as const

const title = computed(() => (form.id ? '编辑会员' : '新增会员'))

async function fetchData() {
  loading.value = true
  const result = await memberApi.page(query)
  rows.value = result.list
  total.value = result.total
  loading.value = false
}

function search() {
  query.page = 1
  fetchData()
}

function reset() {
  Object.assign(query, { page: 1, keyword: '', status: '', type: '' })
  fetchData()
}

function nextCardNo() {
  const maxNo = Math.max(...rows.value.map((item) => Number(item.cardNo)), 620000)
  return String(maxNo + 1).padStart(6, '0')
}

function openForm(row?: Member) {
  Object.assign(form, row ?? {
    name: '',
    cardNo: nextCardNo(),
    phone: '',
    level: '年卡会员',
    status: 'active',
    coach: '',
    expireDate: '2027-01-01',
    avatar: '',
  })
  error.value = ''
  showModal.value = true
}

function uploadAvatar(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  form.avatar = URL.createObjectURL(file)
}

async function submit() {
  if (!form.name || !form.phone) {
    error.value = '请填写姓名和手机号'
    return
  }
  try {
    await memberApi.save(form)
    showModal.value = false
    fetchData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '保存失败'
  }
}

watch(
  () => form.level,
  (level) => {
    if (level !== '私教会员') form.coach = ''
  },
)

onMounted(fetchData)
</script>

<template>
  <div>
    <div class="page-title">
      <div>
        <h1>会员管理</h1>
        <p>管理会员资料、会员类型、到期状态和私教归属。</p>
      </div>
      <button class="btn primary" @click="openForm()">
        <AppIcon name="plus" /> 新增会员
      </button>
    </div>

    <section class="panel">
      <div class="toolbar member-toolbar">
        <label class="field">
          <span>关键词</span>
          <input v-model.trim="query.keyword" class="input" placeholder="卡号 / 姓名 / 手机号" @keyup.enter="search" />
        </label>
        <label class="field">
          <span>状态</span>
          <select v-model="query.status" class="select">
            <option value="">全部</option>
            <option value="active">正常</option>
            <option value="expiring">即将到期</option>
            <option value="inactive">已停用</option>
          </select>
        </label>
        <label class="field">
          <span>类型</span>
          <select v-model="query.type" class="select">
            <option value="">全部</option>
            <option>私教会员</option>
            <option>年卡会员</option>
            <option>季卡会员</option>
            <option>体验会员</option>
          </select>
        </label>
        <button class="btn" @click="reset">重置</button>
        <button class="btn primary" @click="search">搜索</button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>会员</th>
              <th>卡号</th>
              <th>手机号</th>
              <th>类型</th>
              <th>专属私教</th>
              <th>到期时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="8">加载中...</td></tr>
            <tr v-for="row in rows" :key="row.id">
              <td>
                <div class="member-cell">
                  <img v-if="row.avatar.startsWith('blob:')" :src="row.avatar" alt="" />
                  <span v-else>{{ row.avatar }}</span>
                  <strong>{{ row.name }}</strong>
                </div>
              </td>
              <td>{{ row.cardNo }}</td>
              <td>{{ row.phone }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.level === '私教会员' ? row.coach : '-' }}</td>
              <td>{{ row.expireDate }}</td>
              <td><span class="tag" :class="statusMap[row.status][1]">{{ statusMap[row.status][0] }}</span></td>
              <td><button class="btn subtle" @click="openForm(row)">编辑</button></td>
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
          <label class="avatar-upload">
            <img v-if="form.avatar?.startsWith('blob:')" :src="form.avatar" alt="" />
            <span v-else>{{ form.name?.slice(0, 1) || '照' }}</span>
            <input type="file" accept="image/*" @change="uploadAvatar" />
          </label>

          <label class="field">
            <span>姓名</span>
            <input v-model.trim="form.name" class="input" />
          </label>
          <label class="field">
            <span>会员卡号</span>
            <input v-model.trim="form.cardNo" class="input" maxlength="6" />
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
          <label v-if="form.level === '私教会员'" class="field">
            <span>专属私教</span>
            <input v-model.trim="form.coach" class="input" placeholder="例如：李牧" />
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
            <span>到期时间</span>
            <input v-model="form.expireDate" class="input" type="date" />
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
.member-toolbar {
  grid-template-columns: minmax(200px, 1fr) repeat(2, 150px) auto auto;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-cell span,
.member-cell img,
.avatar-upload span,
.avatar-upload img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
}

.member-cell span,
.avatar-upload span {
  display: grid;
  place-items: center;
  background: #eef4ff;
  color: var(--brand);
  font-weight: 800;
}

.form-grid {
  grid-template-columns: 100px 1fr 1fr;
}

.avatar-upload {
  grid-row: span 3;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
}

.avatar-upload span,
.avatar-upload img {
  width: 74px;
  height: 74px;
  font-size: 24px;
}

.avatar-upload::after {
  content: '上传照片';
}

.avatar-upload input {
  display: none;
}

.form-error {
  grid-column: 2 / -1;
  margin: 0;
  color: var(--danger);
  font-weight: 700;
}

@media (max-width: 760px) {
  .member-toolbar,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
