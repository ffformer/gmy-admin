export type Role = 'admin' | 'coach' | 'frontdesk'

export interface UserProfile {
  id: number
  name: string
  account: string
  role: Role
  avatar: string
  permissions: string[]
}

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserProfile
}

export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  type?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export interface Member {
  id: number
  cardNo: string
  name: string
  phone: string
  level: '私教会员' | '年卡会员' | '季卡会员' | '体验会员'
  status: 'active' | 'expiring' | 'inactive'
  coach?: string
  joinDate: string
  expireDate: string
  avatar: string
}

export interface Course {
  id: number
  name: string
  type: '力量训练' | '燃脂塑形' | '瑜伽普拉提' | '康复拉伸'
  coach: string
  capacity: number
  booked: number
  time: string
  room: string
  status: 'open' | 'full' | 'closed'
}

export interface Coach {
  id: number
  name: string
  specialty: string
  rating: number
  lessons: number
  conversion: number
  status: 'active' | 'vacation'
  phone: string
}

export interface DashboardMetrics {
  todayCheckins: number
  activeMembers: number
  monthlyRevenue: number
  courseCompletion: number
  trend: number[]
  category: Array<{ name: string; value: number; color: string }>
  recentOrders: Array<{ id: string; member: string; item: string; amount: number; time: string }>
}
