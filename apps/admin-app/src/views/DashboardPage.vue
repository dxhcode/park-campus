<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { shanghaiToday } from "@park/shared";
import { remainOf, statusOf } from "@/data/bills";
import { resourceByKey } from "@/catalog/resources";
import { useBillStore } from "@/stores/bills";
import { useCatalogStore } from "@/stores/catalog";
import { useSessionStore } from "@/stores/session";
import { useWorkorderStore } from "@/stores/workorders";
import { formatYuan } from "@/utils/storage";

const today = shanghaiToday();
const session = useSessionStore();
const catalog = useCatalogStore();
const workorders = useWorkorderStore();
const bills = useBillStore();

const shortcuts = [
  { title: "报修工单", path: "/workorders", desc: "受理、派单与完工" },
  { title: "物业缴费", path: "/billing", desc: "账单与收款" },
  { title: "访客通行", path: "/visitors", desc: "预约审核" },
  { title: "入驻企业", path: "/enterprise/companies", desc: "名录与联系人" },
  { title: "合同管理", path: "/enterprise/contracts", desc: "到期与草稿" },
  { title: "通知公告", path: "/notices", desc: "发布与置顶" },
  { title: "能源监测", path: "/energy", desc: "表计读数" },
  { title: "安防监控", path: "/security", desc: "点位状态" },
];

function rowsOf(key: string) {
  return catalog.bags[key] ?? [];
}

function href(key: string, id: string) {
  const def = resourceByKey(key);
  return def ? `${def.path}/${id}` : "/dashboard";
}

const openOrders = computed(() =>
  workorders.items.filter((item) => item.status === "待受理" || item.status === "处理中").slice(0, 4),
);
const openBills = computed(() =>
  bills.items
    .map((item) => ({ ...item, status: statusOf(item, today), remain: remainOf(item) }))
    .filter((item) => item.status !== "已缴清")
    .slice(0, 4),
);
const pendingVisitors = computed(() => rowsOf("visitors").filter((item) => item.fields.status === "待审核").slice(0, 4));
const pinnedNotices = computed(() =>
  rowsOf("notices").filter((item) => item.fields.status === "已发布" && item.fields.pinned === "是").slice(0, 4),
);
const expiringContracts = computed(() => rowsOf("contracts").filter((item) => item.fields.status === "即将到期").slice(0, 4));
const meterAlerts = computed(() => rowsOf("energy").filter((item) => item.fields.status === "异常" || item.fields.status === "离线").slice(0, 4));

const kpis = computed(() => [
  { label: "未闭环工单", value: String(workorders.items.filter((item) => item.status !== "已完工" && item.status !== "已关闭").length), tone: "orange", path: "/workorders" },
  { label: "待收账单", value: String(bills.items.filter((item) => statusOf(item, today) !== "已缴清").length), tone: "red", path: "/billing" },
  { label: "待审核访客", value: String(rowsOf("visitors").filter((item) => item.fields.status === "待审核").length), tone: "blue", path: "/visitors" },
  { label: "在园企业", value: String(rowsOf("companies").filter((item) => item.fields.status === "在园").length), tone: "green", path: "/enterprise/companies" },
]);
</script>

<template>
  <section class="page-stack">
    <header class="page-hero">
      <div>
        <div class="eyebrow">首页 · {{ today }}</div>
        <h1>工作台</h1>
        <p>{{ session.user?.displayName ?? "同事" }}，临港智慧园区今天仍需处理的报修、欠费、访客和公告都汇总在这里。</p>
      </div>
    </header>

    <div class="kpi-grid">
      <RouterLink v-for="item in kpis" :key="item.label" class="kpi kpi-link" :to="item.path">
        <span>{{ item.label }}</span>
        <strong :class="item.tone">{{ item.value }}</strong>
      </RouterLink>
    </div>

    <div class="shortcuts">
      <RouterLink v-for="item in shortcuts" :key="item.path" class="shortcut" :to="item.path">
        <strong>{{ item.title }}</strong>
        <span>{{ item.desc }}</span>
      </RouterLink>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <a-card class="glow-card" :bordered="false" title="未闭环报修">
          <RouterLink v-for="item in openOrders" :key="item.id" class="line" :to="`/workorders/${item.id}`">
            <span>{{ item.code }}</span>
            <strong>{{ item.title }}</strong>
            <em>{{ item.status }}</em>
          </RouterLink>
          <a-empty v-if="!openOrders.length" description="没有未闭环工单" />
          <RouterLink class="more" to="/workorders">查看报修</RouterLink>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card class="glow-card" :bordered="false" title="未结清账单">
          <RouterLink v-for="item in openBills" :key="item.id" class="line" :to="`/billing/${item.id}`">
            <span>{{ item.code }}</span>
            <strong>{{ item.company }}</strong>
            <em>{{ item.status }} · ¥ {{ formatYuan(item.remain) }}</em>
          </RouterLink>
          <a-empty v-if="!openBills.length" description="没有未结清账单" />
          <RouterLink class="more" to="/billing">查看缴费</RouterLink>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card class="glow-card" :bordered="false" title="待审核访客">
          <RouterLink v-for="item in pendingVisitors" :key="item.id" class="line" :to="href('visitors', item.id)">
            <span>{{ item.fields.visitDate }}</span>
            <strong>{{ item.fields.name }} · {{ item.fields.hostCompany }}</strong>
            <em>{{ item.fields.purpose }}</em>
          </RouterLink>
          <a-empty v-if="!pendingVisitors.length" description="没有待审核访客" />
          <RouterLink class="more" to="/visitors">查看访客</RouterLink>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card class="glow-card" :bordered="false" title="置顶公告">
          <RouterLink v-for="item in pinnedNotices" :key="item.id" class="line" :to="href('notices', item.id)">
            <span>{{ item.fields.publishAt }}</span>
            <strong>{{ item.fields.title }}</strong>
            <em>{{ item.fields.scope }}</em>
          </RouterLink>
          <a-empty v-if="!pinnedNotices.length" description="没有置顶公告" />
          <RouterLink class="more" to="/notices">查看公告</RouterLink>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card class="glow-card" :bordered="false" title="即将到期合同">
          <RouterLink v-for="item in expiringContracts" :key="item.id" class="line" :to="href('contracts', item.id)">
            <span>{{ item.fields.endAt }}</span>
            <strong>{{ item.fields.title }}</strong>
            <em>{{ item.fields.company }}</em>
          </RouterLink>
          <a-empty v-if="!expiringContracts.length" description="没有即将到期的合同" />
          <RouterLink class="more" to="/enterprise/contracts">查看合同</RouterLink>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card class="glow-card" :bordered="false" title="异常表计">
          <RouterLink v-for="item in meterAlerts" :key="item.id" class="line" :to="href('energy', item.id)">
            <span>{{ item.fields.kind }}</span>
            <strong>{{ item.fields.name }}</strong>
            <em>{{ item.fields.status }} · {{ item.fields.building }}</em>
          </RouterLink>
          <a-empty v-if="!meterAlerts.length" description="没有异常或离线表计" />
          <RouterLink class="more" to="/energy">查看表计</RouterLink>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<style scoped>
.kpi-link,
.shortcut,
.line,
.more {
  text-decoration: none;
  color: inherit;
}
.kpi-link,
.shortcut {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.kpi-link:hover,
.shortcut:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(29, 109, 255, 0.12);
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.shortcut {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(29, 109, 255, 0.08);
}
.shortcut span,
.line em,
.line span {
  color: rgba(15, 23, 42, 0.55);
  font-style: normal;
}
.line {
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 2px 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}
.line strong {
  grid-column: 2;
  grid-row: 1;
}
.line em {
  grid-column: 1 / -1;
  font-size: 12px;
}
.more {
  display: inline-block;
  margin-top: 12px;
  color: #1d6dff;
}
@media (max-width: 960px) {
  .shortcuts {
    grid-template-columns: 1fr 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .kpi-link,
  .shortcut {
    transition: none;
  }
}
</style>
