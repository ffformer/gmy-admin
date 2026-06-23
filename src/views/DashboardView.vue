<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MetricCard from '@/components/MetricCard.vue'
import SimpleBarChart from '@/components/SimpleBarChart.vue'
import { dashboardApi } from '@/api/http'
import type { DashboardMetrics } from '@/api/types'

const metrics = ref<DashboardMetrics | null>(null)

onMounted(async () => {
  metrics.value = await dashboardApi.getMetrics()
})

function money(value: number) {
  return `¥${value.toLocaleString('zh-CN')}`
}
</script>

<template>
  <div>
    <div class="page-title">
      <div>
        <h1>经营总览</h1>
        <p>会员增长、课程消耗和营收趋势视图。</p>
      </div>
    </div>

    <template v-if="metrics">
      <section class="metrics-grid">
        <MetricCard label="今日入场" :value="metrics.todayCheckins" helper="较昨日 +12.4%" tone="green" />
        <MetricCard label="有效会员" :value="metrics.activeMembers" helper="本月新增 126 人" tone="dark" />
        <MetricCard label="月度营收" :value="money(metrics.monthlyRevenue)" helper="私教收入占比 46%" tone="orange" />
        <MetricCard label="课程履约率" :value="`${metrics.courseCompletion}%`" helper="缺课率下降 3.1%" tone="green" />
      </section>

      <section class="dashboard-grid">
        <article class="panel chart-card">
          <div class="section-head">
            <div>
              <h2>近 7 日入场趋势</h2>
              <p>用于观察门店客流波动和课程排期压力。</p>
            </div>
          </div>
          <SimpleBarChart :data="metrics.trend" :labels="['周四', '周五', '周六', '周日', '周一', '周二', '周三']" />
        </article>

        <article class="panel">
          <div class="section-head">
            <div>
              <h2>营收结构</h2>
              <p>按业务线汇总本月成交金额。</p>
            </div>
          </div>
          <div class="donut-list">
            <div v-for="item in metrics.category" :key="item.name" class="donut-row">
              <span :style="{ background: item.color }"></span>
              <strong>{{ item.name }}</strong>
              <em>{{ item.value }}%</em>
            </div>
          </div>
        </article>
      </section>

      <article class="panel">
        <div class="section-head">
          <div>
            <h2>近期订单</h2>
            <p>模拟订单接口数据，可扩展为真实收银流水。</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>会员</th>
                <th>项目</th>
                <th>金额</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in metrics.recentOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.member }}</td>
                <td>{{ order.item }}</td>
                <td>{{ money(order.amount) }}</td>
                <td>{{ order.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </template>
  </div>
</template>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.8fr);
  gap: 16px;
  margin: 16px 0;
}

.chart-card,
.panel {
  padding: 18px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.section-head h2 {
  margin: 0 0 6px;
  font-size: 18px;
}

.section-head p {
  margin: 0;
  color: var(--muted);
}

.donut-list {
  display: grid;
  gap: 14px;
}

.donut-row {
  display: grid;
  grid-template-columns: 14px 1fr auto;
  align-items: center;
  gap: 10px;
}

.donut-row span {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.donut-row em {
  color: var(--muted);
  font-style: normal;
  font-weight: 900;
}

@media (max-width: 1120px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
