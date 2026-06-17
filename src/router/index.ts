import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface AppRouteMeta {
  title: string
  icon: string
  permission?: string
  hidden?: boolean
}

export const appRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '经营总览', icon: 'grid', permission: 'dashboard:view' },
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('@/views/MembersView.vue'),
    meta: { title: '会员管理', icon: 'users', permission: 'member:manage' },
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('@/views/CoursesView.vue'),
    meta: { title: '课程排期', icon: 'calendar', permission: 'course:manage' },
  },
  {
    path: '/coaches',
    name: 'coaches',
    component: () => import('@/views/CoachesView.vue'),
    meta: { title: '教练绩效', icon: 'award', permission: 'coach:manage' },
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/UploadView.vue'),
    meta: { title: '文件上传', icon: 'upload', permission: 'upload:manage' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登录', hidden: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      redirect: '/dashboard',
      children: appRoutes,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.name === 'login') {
    if (auth.isLoggedIn) return '/dashboard'
    return true
  }

  if (!auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  try {
    await auth.hydrate()
  } catch {
    auth.logout()
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const permission = to.meta.permission as string | undefined
  if (!auth.hasPermission(permission)) {
    return '/dashboard'
  }

  return true
})

export default router
