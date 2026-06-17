import type { Coach, Course, DashboardMetrics, Member, Role, UserProfile } from './types'

export const users: Array<UserProfile & { password: string }> = [
  {
    id: 1,
    name: '刘大强',
    account: '13096752125',
    password: 'abc147258369',
    role: 'admin',
    avatar: '刘',
    permissions: ['dashboard:view', 'member:manage', 'course:manage', 'coach:manage'],
  },
  {
    id: 2,
    name: '张老三',
    account: '18587895134',
    password: 'abc147258369',
    role: 'coach',
    avatar: '张',
    permissions: ['dashboard:view', 'member:manage', 'course:manage'],
  },
  {
    id: 3,
    name: '前台运营',
    account: '748686818',
    password: 'abc147258369',
    role: 'frontdesk',
    avatar: 'FD',
    permissions: ['dashboard:view', 'member:manage'],
  },
]

const memberNames = [
  '沈知夏',
  '陈屿',
  '赵晴',
  '何砚',
  '许诺',
  '孟然',
  '宋一辰',
  '顾清',
  '唐野',
  '陆景',
  '苏梨',
  '白澈',
  '程砚秋',
  '秦晚',
  '江临',
  '夏川',
  '温语',
  '韩序',
]

const coaches = ['李牧', '周启航', '程思远', '叶柠', '顾北辰']
const levels: Member['level'][] = ['私教会员', '年卡会员', '季卡会员', '体验会员']
const statuses: Member['status'][] = ['active', 'expiring', 'inactive']

export const members: Member[] = Array.from({ length: 48 }, (_, index) => {
  const id = index + 1
  const status = statuses[index % statuses.length] ?? 'active'
  return {
    id,
    cardNo: String(620000 + id),
    name: memberNames[index % memberNames.length] ?? `会员${id}`,
    phone: `138${String(32000000 + id * 137).slice(0, 8)}`,
    level: levels[index % levels.length] ?? '年卡会员',
    status,
    coach: levels[index % levels.length] === '私教会员' ? (coaches[index % coaches.length] ?? '李牧') : '',
    joinDate: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 25) + 1).padStart(2, '0')}`,
    expireDate: `2026-${String(((index + 5) % 12) + 1).padStart(2, '0')}-${String((index % 25) + 1).padStart(2, '0')}`,
    avatar: (memberNames[index % memberNames.length] ?? '会员').slice(0, 1),
  }
})

export const courses: Course[] = [
  ['晨间燃脂循环', '燃脂塑形', '叶柠', 24, 18, '周一 08:30', 'A101', 'open'],
  ['核心力量进阶', '力量训练', '李牧', 16, 16, '周一 19:30', 'B203', 'full'],
  ['普拉提体态修复', '瑜伽普拉提', '程思远', 18, 11, '周二 18:30', '瑜伽房', 'open'],
  ['肩颈舒缓拉伸', '康复拉伸', '周启航', 20, 9, '周三 12:20', '康复区', 'open'],
  ['HIIT 极限燃动', '燃脂塑形', '顾北辰', 22, 22, '周三 20:00', 'A102', 'full'],
  ['臀腿专项塑形', '力量训练', '叶柠', 14, 6, '周四 19:00', 'B201', 'open'],
  ['低冲击康复训练', '康复拉伸', '程思远', 12, 4, '周五 10:00', '康复区', 'open'],
  ['周末综合体能', '力量训练', '李牧', 26, 0, '周六 16:00', 'A101', 'closed'],
].map(([name, type, coach, capacity, booked, time, room, status], index) => ({
  id: index + 1,
  name,
  type,
  coach,
  capacity: Number(capacity),
  booked: Number(booked),
  time,
  room,
  status,
})) as Course[]

export const coachList: Coach[] = [
  {
    id: 1,
    name: '李牧',
    specialty: '力量训练 / 体能提升',
    rating: 4.9,
    lessons: 168,
    conversion: 42,
    status: 'active',
    phone: '13900012810',
  },
  {
    id: 2,
    name: '周启航',
    specialty: '康复拉伸 / 动作评估',
    rating: 4.8,
    lessons: 132,
    conversion: 35,
    status: 'active',
    phone: '13900012811',
  },
  {
    id: 3,
    name: '叶柠',
    specialty: '燃脂塑形 / 私教陪练',
    rating: 4.9,
    lessons: 154,
    conversion: 48,
    status: 'active',
    phone: '13900012812',
  },
  {
    id: 4,
    name: '程思远',
    specialty: '普拉提 / 体态矫正',
    rating: 4.7,
    lessons: 97,
    conversion: 31,
    status: 'vacation',
    phone: '13900012813',
  },
]

export const roleNames: Record<Role, string> = {
  admin: '店长',
  coach: '教练主管',
  frontdesk: '前台运营',
}

export const dashboardMetrics: DashboardMetrics = {
  todayCheckins: 286,
  activeMembers: 1846,
  monthlyRevenue: 328600,
  courseCompletion: 87,
  trend: [42, 55, 49, 68, 73, 81, 96],
  category: [
    { name: '私教课', value: 46, color: '#2563eb' },
    { name: '团课', value: 28, color: '#0284c7' },
    { name: '会员卡', value: 19, color: '#334155' },
  ],
  recentOrders: [
    { id: 'GMY20260607001', member: '沈知夏', item: '私教 12 节包', amount: 5880, time: '09:42' },
    { id: 'GMY20260607002', member: '陈屿', item: '年卡续费', amount: 2680, time: '10:18' },
    { id: 'GMY20260607003', member: '赵晴', item: '普拉提团课', amount: 399, time: '11:05' },
  ],
}
