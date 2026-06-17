import type { LoginPayload, LoginResult, PageParams, PageResult } from './types'
import { coachList, courses, dashboardMetrics, members, users } from './mock'
import type { Coach, Course, DashboardMetrics, Member } from './types'

const sleep = (ms = 260) => new Promise((resolve) => window.setTimeout(resolve, ms))

const storageKey = 'gmy-admin-token'

export const tokenStorage = {
  get: () => localStorage.getItem(storageKey),
  set: (token: string) => localStorage.setItem(storageKey, token),
  clear: () => localStorage.removeItem(storageKey),
}

function assertAuth() {
  if (!tokenStorage.get()) {
    throw new Error('登录已过期，请重新登录')
  }
}

function pickPage<T>(rows: T[], params: PageParams): PageResult<T> {
  const page = Math.max(params.page, 1)
  const pageSize = Math.max(params.pageSize, 1)
  const start = (page - 1) * pageSize
  return {
    list: rows.slice(start, start + pageSize),
    total: rows.length,
  }
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    await sleep()
    const user = users.find(
      (item) => item.account === payload.username && item.password === payload.password,
    )

    if (!user) {
      throw new Error('账号或密码错误')
    }

    const { password: _password, ...profile } = user
    const token = `gmy-token-${profile.id}-${Date.now()}`
    tokenStorage.set(token)
    localStorage.setItem('gmy-admin-user', JSON.stringify(profile))
    return { token, user: profile }
  },

  async profile() {
    await sleep(120)
    assertAuth()
    const raw = localStorage.getItem('gmy-admin-user')
    if (!raw) {
      throw new Error('未找到用户信息')
    }
    return JSON.parse(raw) as LoginResult['user']
  },

  logout() {
    tokenStorage.clear()
    localStorage.removeItem('gmy-admin-user')
  },
}

export const dashboardApi = {
  async getMetrics(): Promise<DashboardMetrics> {
    await sleep()
    assertAuth()
    return dashboardMetrics
  },
}

export const memberApi = {
  async page(params: PageParams): Promise<PageResult<Member>> {
    await sleep()
    assertAuth()
    const keyword = params.keyword?.trim()
    const rows = members.filter((item) => {
      const text = `${item.cardNo}${item.name}${item.phone}${item.coach ?? ''}`.toLowerCase()
      const matchKeyword = keyword ? text.includes(keyword.toLowerCase()) : true
      const matchStatus = params.status ? item.status === params.status : true
      const matchType = params.type ? item.level === params.type : true
      return matchKeyword && matchStatus && matchType
    })

    return pickPage(rows, params)
  },

  async save(payload: Partial<Member>): Promise<Member> {
    await sleep()
    assertAuth()
    const cardNo = payload.cardNo ?? String(620000 + members.length + 1)
    const duplicated = members.some((item) => item.cardNo === cardNo && item.id !== payload.id)
    if (duplicated) {
      throw new Error('会员卡号已存在')
    }

    const member: Member = {
      id: payload.id ?? members.length + 1,
      cardNo,
      name: payload.name ?? '',
      phone: payload.phone ?? '',
      level: payload.level ?? '年卡会员',
      status: payload.status ?? 'active',
      coach: payload.level === '私教会员' ? (payload.coach ?? '李牧') : '',
      joinDate: payload.joinDate ?? new Date().toISOString().slice(0, 10),
      expireDate: payload.expireDate ?? '2027-01-01',
      avatar: payload.avatar || payload.name?.slice(0, 1) || '新',
    }

    const index = members.findIndex((item) => item.id === member.id)
    if (index >= 0) {
      members[index] = member
    } else {
      members.unshift(member)
    }

    return member
  },
}

export const courseApi = {
  async page(params: PageParams): Promise<PageResult<Course>> {
    await sleep()
    assertAuth()
    const keyword = params.keyword?.trim()
    const rows = courses.filter((item) => {
      const matchKeyword = keyword
        ? `${item.name}${item.coach}${item.room}`.toLowerCase().includes(keyword.toLowerCase())
        : true
      const matchStatus = params.status ? item.status === params.status : true
      const matchType = params.type ? item.type === params.type : true
      return matchKeyword && matchStatus && matchType
    })

    return pickPage(rows, params)
  },
}

export const coachApi = {
  async page(params: PageParams): Promise<PageResult<Coach>> {
    await sleep()
    assertAuth()
    const keyword = params.keyword?.trim()
    const rows = coachList.filter((item) => {
      const matchKeyword = keyword
        ? `${item.name}${item.specialty}${item.phone}`.toLowerCase().includes(keyword.toLowerCase())
        : true
      const matchStatus = params.status ? item.status === params.status : true
      return matchKeyword && matchStatus
    })

    return pickPage(rows, params)
  },
}
