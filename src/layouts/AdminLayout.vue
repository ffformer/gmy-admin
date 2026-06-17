<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { appRoutes } from '@/router'
import { roleNames } from '@/api/mock'
import { useAuthStore } from '@/stores/auth'

interface MenuItem {
  path: string
  meta: {
    title: string
    icon: string
    permission?: string
  }
}

const auth = useAuthStore()
const router = useRouter()

const menuItems: MenuItem[] = appRoutes.map((route) => ({
  path: route.path,
  meta: {
    title: String(route.meta?.title ?? ''),
    icon: String(route.meta?.icon ?? ''),
    permission: route.meta?.permission ? String(route.meta.permission) : undefined,
  },
}))

const menus = computed(() =>
  menuItems.filter((route) => auth.hasPermission(route.meta.permission)),
)

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/dashboard">
        <span>GMY</span>
        <div>
          <strong>GymPro</strong>
          <small>健身房运营中台</small>
        </div>
      </RouterLink>

      <nav class="nav">
        <RouterLink v-for="route in menus" :key="route.path" :to="route.path" class="nav-link">
          <AppIcon :name="route.meta.icon" />
          <span>{{ route.meta.title }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <strong>GymPro 健身房管理系统</strong>
          <span>会员、课程、教练与经营数据管理</span>
        </div>
        <div class="user-box" v-if="auth.user">
          <span class="avatar">{{ auth.user.avatar }}</span>
          <div>
            <strong>{{ auth.user.name }}</strong>
            <small>{{ roleNames[auth.user.role] }}</small>
          </div>
          <button class="icon-btn" title="退出登录" @click="logout">
            <AppIcon name="logout" />
          </button>
        </div>
      </header>

      <section class="content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 260px minmax(0, 1fr);
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  height: 100vh;
  flex-direction: column;
  gap: 28px;
  border-right: 1px solid var(--line);
  background: var(--surface);
  padding: 24px 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand > span {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 8px;
  background: var(--brand);
  color: white;
  font-weight: 900;
}

.brand div {
  display: grid;
  gap: 2px;
}

.brand small,
.topbar span,
.user-box small {
  color: var(--muted);
}

.nav {
  display: grid;
  gap: 8px;
}

.nav-link {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  padding: 0 12px;
  color: var(--muted);
  font-weight: 800;
}

.nav-link.router-link-active {
  background: var(--ink);
  color: white;
}

.workspace {
  min-width: 0;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
  padding: 0 28px;
}

.topbar > div:first-child {
  display: grid;
  gap: 4px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: var(--brand);
  color: white;
  font-weight: 900;
}

.user-box div {
  display: grid;
}

.content {
  padding: 28px;
}

@media (max-width: 860px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    padding-bottom: 12px;
  }

  .nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .topbar {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px;
  }

  .content {
    padding: 18px;
  }
}
</style>
