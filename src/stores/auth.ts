import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, tokenStorage } from '@/api/http'
import type { LoginPayload, UserProfile } from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(tokenStorage.get() ?? '')
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => Boolean(token.value))
  const role = computed(() => user.value?.role)
  const permissions = computed(() => user.value?.permissions ?? [])

  function hasPermission(permission?: string) {
    if (!permission) return true
    return permissions.value.includes(permission)
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const result = await authApi.login(payload)
      token.value = result.token
      user.value = result.user
      return result
    } finally {
      loading.value = false
    }
  }

  async function hydrate() {
    if (!token.value || user.value) return
    user.value = await authApi.profile()
  }

  function logout() {
    authApi.logout()
    token.value = ''
    user.value = null
  }

  return {
    token,
    user,
    loading,
    isLoggedIn,
    role,
    permissions,
    hasPermission,
    login,
    hydrate,
    logout,
  }
})
