<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { parkByKey, screenHref } from "@park/shared";
import {
  priorityColor,
  statusColor,
  workorderCategories,
  workorderPriorities,
  workorderStatuses,
  type Workorder,
} from "@/data/workorders";
import ListEmpty from "@/components/ListEmpty.vue";
import { useAppStore } from "@/stores/app";
import { useWorkorderStore } from "@/stores/workorders";

const router = useRouter();
const app = useAppStore();
const store = useWorkorderStore();
const screenLink = computed(() => screenHref("/workorders", { from: "/workorders", park: app.parkKey }));
const screenLabel = computed(() => `工单大屏 · ${parkByKey(app.parkKey).short}`);

const filters = reactive({
  keyword: "",
  status: undefined as string | undefined,
  priority: undefined as string | undefined,
  category: undefined as string | undefined,
  urgentOpen: false,
});

const stats = computed(() => {
  const count = (status: string) => store.items.filter((item) => item.status === status).length;
  const urgent = store.items.filter((item) => item.priority === "紧急" && item.status !== "已完工" && item.status !== "已关闭").length;
  return [
    { label: "待受理", value: count("待受理"), tone: "orange", status: "待受理", urgentOpen: false },
    { label: "处理中", value: count("处理中"), tone: "blue", status: "处理中", urgentOpen: false },
    { label: "待验收", value: count("待验收"), tone: "purple", status: "待验收", urgentOpen: false },
    { label: "紧急未闭环", value: urgent, tone: "red", status: undefined as string | undefined, urgentOpen: true },
  ];
});

const filtered = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase();
  return store.items.filter((item) => {
    const haystack = `${item.code} ${item.title} ${item.company} ${item.location} ${item.reporter} ${item.building}`.toLowerCase();
    if (keyword && !haystack.includes(keyword)) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.urgentOpen && !(item.priority === "紧急" && item.status !== "已完工" && item.status !== "已关闭")) return false;
    return true;
  });
});

const columns = [
  { title: "单号", dataIndex: "code", key: "code", width: 150 },
  { title: "标题", dataIndex: "title", key: "title", ellipsis: true },
  { title: "位置", key: "location", ellipsis: true },
  { title: "企业", dataIndex: "company", key: "company", ellipsis: true },
  { title: "优先级", key: "priority", width: 90 },
  { title: "状态", key: "status", width: 100 },
  { title: "处理人", dataIndex: "assignee", key: "assignee", width: 140 },
  { title: "报修时间", dataIndex: "createdAt", key: "createdAt", width: 150 },
  { title: "操作", key: "actions", width: 140, fixed: "right" as const },
];

const filtersActive = computed(
  () => Boolean(filters.keyword.trim() || filters.status || filters.priority || filters.category || filters.urgentOpen),
);

function resetFilters() {
  filters.keyword = "";
  filters.status = undefined;
  filters.priority = undefined;
  filters.category = undefined;
  filters.urgentOpen = false;
}

function statOn(item: { status?: string; urgentOpen: boolean }) {
  if (filters.keyword.trim() || filters.priority || filters.category) return false;
  if (item.urgentOpen) return filters.urgentOpen && !filters.status;
  return filters.status === item.status && !filters.urgentOpen;
}

function applyStat(item: { status?: string; urgentOpen: boolean }) {
  const active = statOn(item);
  resetFilters();
  if (active) return;
  if (item.urgentOpen) filters.urgentOpen = true;
  else filters.status = item.status;
}

function open(id: string) {
  router.push(`/workorders/${id}`);
}

function customRow(record: Workorder) {
  return {
    style: { cursor: "pointer" },
    onClick: () => open(record.id),
  };
}

function resetData() {
  store.reset();
  message.success("已恢复报修示例数据");
}

function asRow(record: object) {
  return record as Workorder;
}
</script>

<template>
  <section class="page-stack">
    <header class="page-hero">
      <div>
        <div class="eyebrow">物业服务</div>
        <h1>报修工单</h1>
        <p>受理、派单、验收和完工都在浏览器里走通。点击上方指标可筛选，改动写入本机。</p>
      </div>
      <a-space wrap>
        <a-button :href="screenLink">{{ screenLabel }}</a-button>
        <a-popconfirm title="清除本地改动，恢复 12 条示例工单？" ok-text="恢复" cancel-text="取消" @confirm="resetData">
          <a-button>恢复示例</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="router.push('/workorders/new')">新建工单</a-button>
      </a-space>
    </header>

    <div class="kpi-grid">
      <button
        v-for="item in stats"
        :key="item.label"
        type="button"
        class="kpi"
        :class="{ on: statOn(item) }"
        :aria-pressed="statOn(item)"
        @click="applyStat(item)"
      >
        <span>{{ item.label }}</span>
        <strong :class="item.tone">{{ item.value }}</strong>
      </button>
    </div>

    <a-card class="glow-card" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="filters.keyword" allow-clear placeholder="单号、标题、企业、位置、报修人" />
        <a-select v-model:value="filters.status" allow-clear placeholder="状态" :options="workorderStatuses.map((value) => ({ value, label: value }))" />
        <a-select v-model:value="filters.priority" allow-clear placeholder="优先级" :options="workorderPriorities.map((value) => ({ value, label: value }))" />
        <a-select v-model:value="filters.category" allow-clear placeholder="类别" :options="workorderCategories.map((value) => ({ value, label: value }))" />
        <a-button @click="resetFilters">重置</a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="filtered"
        :row-key="(record: Workorder) => record.id"
        :pagination="{ pageSize: 8, showTotal: (total: number) => `共 ${total} 条` }"
        :scroll="{ x: 1180 }"
        :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'location'">{{ asRow(record).building }} · {{ asRow(record).location }}</template>
          <template v-else-if="column.key === 'assignee'">{{ asRow(record).assignee || "待指派" }}</template>
          <template v-else-if="column.key === 'priority'">
            <a-tag :color="priorityColor(asRow(record).priority)">{{ asRow(record).priority }}</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="statusColor(asRow(record).status)">{{ asRow(record).status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space @click.stop>
              <a-button type="link" size="small" @click="open(asRow(record).id)">详情</a-button>
              <a-button type="link" size="small" @click="router.push(`/workorders/${asRow(record).id}/edit`)">编辑</a-button>
            </a-space>
          </template>
        </template>
        <template #emptyText>
          <ListEmpty
            :filtered="filtersActive"
            :description="filtersActive ? '没有符合筛选条件的工单' : '还没有工单'"
            create-label="新建工单"
            @clear="resetFilters"
            @create="router.push('/workorders/new')"
          />
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
@media (max-width: 960px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
