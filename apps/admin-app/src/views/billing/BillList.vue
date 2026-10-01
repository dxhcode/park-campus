<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { shanghaiToday } from "@park/shared";
import { billStatusColor, billTypes, paidOf, remainOf, statusOf, type Bill } from "@/data/bills";
import { useBillStore } from "@/stores/bills";
import { formatYuan } from "@/utils/storage";

const router = useRouter();
const store = useBillStore();
const today = shanghaiToday();

const filters = reactive({
  keyword: "",
  status: undefined as string | undefined,
  type: undefined as string | undefined,
  period: "",
});

const rows = computed(() =>
  store.items.map((item) => ({
    ...item,
    paid: paidOf(item),
    remain: remainOf(item),
    status: statusOf(item, today),
  })),
);

const stats = computed(() => {
  const open = rows.value.filter((item) => item.status !== "已缴清");
  const receivedThisMonth = store.items
    .flatMap((item) => item.payments)
    .filter((pay) => pay.paidAt.startsWith(today.slice(0, 7)))
    .reduce((sum, pay) => sum + pay.amount, 0);
  return [
    { label: "待收金额", value: `¥ ${formatYuan(open.reduce((sum, item) => sum + item.remain, 0))}` },
    { label: "逾期笔数", value: String(rows.value.filter((item) => item.status === "已逾期").length) },
    { label: "本月已收", value: `¥ ${formatYuan(receivedThisMonth)}` },
    { label: "账单总数", value: String(rows.value.length) },
  ];
});

const filtered = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase();
  return rows.value.filter((item) => {
    const haystack = `${item.code} ${item.company} ${item.room} ${item.building} ${item.contact}`.toLowerCase();
    if (keyword && !haystack.includes(keyword)) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.period.trim() && !item.period.includes(filters.period.trim())) return false;
    return true;
  });
});

const columns = [
  { title: "单号", dataIndex: "code", key: "code", width: 150 },
  { title: "企业", dataIndex: "company", key: "company", ellipsis: true },
  { title: "房间", key: "room", width: 180 },
  { title: "类型", dataIndex: "type", key: "type", width: 90 },
  { title: "账期", dataIndex: "period", key: "period", width: 100 },
  { title: "应收", key: "amount", width: 120 },
  { title: "已收", key: "paid", width: 120 },
  { title: "状态", key: "status", width: 110 },
  { title: "到期", dataIndex: "dueDate", key: "dueDate", width: 120 },
  { title: "操作", key: "actions", width: 150, fixed: "right" as const },
];

function resetFilters() {
  filters.keyword = "";
  filters.status = undefined;
  filters.type = undefined;
  filters.period = "";
}

function open(id: string) {
  router.push(`/billing/${id}`);
}

function customRow(record: Bill & { status: string }) {
  return {
    class: record.status === "已逾期" ? "row-overdue" : "",
    style: { cursor: "pointer" },
    onClick: () => open(record.id),
  };
}

function resetData() {
  store.reset();
  message.success("已恢复缴费示例数据");
}

function asRow(record: object) {
  return record as Bill & { paid: number; remain: number; status: ReturnType<typeof statusOf> };
}
</script>

<template>
  <section class="page-stack">
    <header class="page-hero">
      <div>
        <div class="eyebrow">物业服务 · {{ today }}</div>
        <h1>物业缴费</h1>
        <p>查看临港智慧园区的物业费、能耗和停车账单。可以开立新账单，也可以对未结清账单登记收款。</p>
      </div>
      <a-space wrap>
        <a-popconfirm title="清除本地改动，恢复示例账单？" ok-text="恢复" cancel-text="取消" @confirm="resetData">
          <a-button>恢复示例</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="router.push('/billing/new')">开立账单</a-button>
      </a-space>
    </header>

    <div class="kpi-grid">
      <article v-for="item in stats" :key="item.label" class="kpi">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>

    <a-card class="glow-card" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="filters.keyword" allow-clear placeholder="单号、企业、房间、联系人" />
        <a-select
          v-model:value="filters.status"
          allow-clear
          placeholder="状态"
          :options="['待缴费', '部分缴纳', '已缴清', '已逾期'].map((value) => ({ value, label: value }))"
        />
        <a-select v-model:value="filters.type" allow-clear placeholder="费用类型" :options="billTypes.map((value) => ({ value, label: value }))" />
        <a-input v-model:value="filters.period" allow-clear placeholder="账期 2026-09" />
        <a-button @click="resetFilters">重置</a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="filtered"
        :row-key="(record: Bill) => record.id"
        :pagination="{ pageSize: 8, showTotal: (total: number) => `共 ${total} 条` }"
        :scroll="{ x: 1280 }"
        :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'room'">{{ asRow(record).building }} · {{ asRow(record).room }}</template>
          <template v-else-if="column.key === 'amount'">¥ {{ formatYuan(asRow(record).amount) }}</template>
          <template v-else-if="column.key === 'paid'">¥ {{ formatYuan(asRow(record).paid) }}</template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="billStatusColor(asRow(record).status)">{{ asRow(record).status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space @click.stop>
              <a-button type="link" size="small" @click="open(asRow(record).id)">详情</a-button>
              <a-button
                v-if="asRow(record).status !== '已缴清'"
                type="link"
                size="small"
                @click="router.push(`/billing/${asRow(record).id}/pay`)"
              >
                收款
              </a-button>
            </a-space>
          </template>
        </template>
        <template #emptyText>
          <a-empty description="没有符合筛选条件的账单" />
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(120px, 0.7fr)) auto;
  gap: 10px;
  margin-bottom: 14px;
}
:deep(.row-overdue) td {
  background: rgba(244, 63, 94, 0.05);
}
@media (max-width: 960px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
