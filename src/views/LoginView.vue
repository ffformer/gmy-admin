<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({
  username: 'admin',
  password: '123456',
})
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.login(form)
    router.replace((route.query.redirect as string) || '/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-visual">
      <p>GymPro Management</p>
      <h1>健身房全流程运营管理系统</h1>
      <div class="visual-grid">
        <span>会员生命周期</span>
        <span>课程排期</span>
        <span>权限控制</span>
        <span>数据看板</span>
      </div>
    </section>

    <form class="login-card panel" @submit.prevent="submit">
      <div>
        <span class="eyebrow">Welcome back</span>
        <h2>登录工作台</h2>
        <p>演示账号：admin / 123456，也可使用 coach / frontdesk 查看不同权限。</p>
      </div>

      <label class="field">
        <span>账号</span>
        <input v-model.trim="form.username" class="input" autocomplete="username" />
      </label>
      <label class="field">
        <span>密码</span>
        <input v-model="form.password" class="input" type="password" autocomplete="current-password" />
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
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 520px);
  align-items: center;
  gap: 36px;
  padding: 48px;
}

.login-visual {
  display: grid;
  gap: 22px;
}

.login-visual p,
.eyebrow {
  margin: 0;
  color: var(--brand);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
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
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px;
  background: rgb(255 253 249 / 70%);
  color: var(--muted);
  font-weight: 800;
}

.login-card {
  display: grid;
  gap: 18px;
  padding: 28px;
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
