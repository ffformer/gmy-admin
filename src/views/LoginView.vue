<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const loginCacheKey = 'gmy-login-cache'
const saved = JSON.parse(localStorage.getItem(loginCacheKey) || '{}') as {
  username?: string
  password?: string
  remember?: boolean
}

const form = reactive({
  username: saved.username ?? '',
  password: saved.remember ? (saved.password ?? '') : '',
  remember: saved.remember ?? false,
})
const error = ref('')
let oldUsername = form.username

async function submit() {
  error.value = ''
  try {
    await auth.login(form)
    localStorage.setItem(
      loginCacheKey,
      JSON.stringify({
        username: form.username,
        password: form.remember ? form.password : '',
        remember: form.remember,
      }),
    )
    router.replace((route.query.redirect as string) || '/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  }
}

watch(
  () => form.username,
  (username) => {
    if (username !== oldUsername) {
      form.password = ''
      form.remember = false
      oldUsername = username
    }
  },
)
</script>

<template>
  <main class="login-page">
    <section class="login-visual">
      <p>GymPro Management</p>
      <h1>健身房全流程运营管理系统</h1>
      <div class="visual-grid">
        <span>会员周期</span>
        <span>课程排期</span>
        <span>权限控制</span>
        <span>数据看板</span>
      </div>
    </section>

    <form class="login-card panel" @submit.prevent="submit">
      <div>
        <span class="eyebrow">Welcome back</span>
        <h2>登录工作台</h2>
        <span style="font-size: 14px; color: grey">
          店长账号：13096752125 <br />教练主管：18587895134
          <br />前台账号：748686818<br />密码：abc147258369
        </span>
      </div>

      <label class="field">
        <span>账号</span>
        <input v-model.trim="form.username" class="input" autocomplete="username" />
      </label>
      <label class="field">
        <span>密码</span>
        <input
          v-model="form.password"
          class="input"
          type="password"
          autocomplete="current-password"
        />
      </label>
      <label class="remember">
        <input v-model="form.remember" type="checkbox" />
        <span>记住密码</span>
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn primary" type="submit" :disabled="auth.loading">
        {{ auth.loading ? '登录中...' : '进入系统' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 520px);
  align-items: center;
  gap: 36px;
  padding: 48px;
  background:
    linear-gradient(90deg, rgb(6 13 24 / 72%), rgb(6 13 24 / 28%)),
    url('/login-bg.png') center / cover no-repeat;
}

.login-visual {
  display: grid;
  gap: 22px;
  color: white;
}

.login-visual p,
.eyebrow {
  margin: 0;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.login-visual p {
  color: #bfdbfe;
}

.eyebrow {
  color: var(--brand);
}

.login-visual h1 {
  max-width: 680px;
  margin: 0;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 1.02;
}

.visual-grid {
  display: grid;
  max-width: 620px;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.visual-grid span {
  min-height: 84px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 8px;
  padding: 14px;
  background: rgb(255 255 255 / 10%);
  color: #e5eefc;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.login-card {
  display: grid;
  gap: 18px;
  padding: 28px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 20%);
}

.login-card h2 {
  margin: 8px 0 8px;
  font-size: 28px;
}

.login-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}

.remember input {
  width: 16px;
  height: 16px;
  accent-color: var(--brand);
}

.error {
  color: var(--danger) !important;
  font-weight: 700;
}

button:disabled {
  cursor: wait;
  opacity: 0.72;
}

@media (max-width: 860px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .visual-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
