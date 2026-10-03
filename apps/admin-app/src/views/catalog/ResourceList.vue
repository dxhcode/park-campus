<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { parkByKey, screenHref } from "@park/shared";
import ListEmpty from "@/components/ListEmpty.vue";
import { showValue, tagColor } from "@/catalog/present";
import { resourceByKey } from "@/catalog/resources";
import type { CatalogRecord, FieldDef } from "@/catalog/types";
import { leafMenus } from "@/menus";
import { useAppStore } from "@/stores/app";
import { useCatalogStore } from "@/stores/catalog";

const route = useRoute();
const router = useRouter();
const app = useAppStore();
const store = useCatalogStore();

const def = computed(() => resourceByKey(String(route.meta.resource ?? "")));
const screenJump = computed(() => {
  const key = def.value?.key;
  const park = app.parkKey;
  const short = parkByKey(park).short;
  if (key === "energy") return { label: `能耗大屏 · ${short}`, href: screenHref("/energy", { from: "/energy", park }) };
  if (key === "security") return { label: `通行安防 · ${short}`, href: screenHref("/access", { from: "/security", park }) };
  if (key === "visitors") return { label: `通行大屏 · ${short}`, href: screenHref("/access", { from: "/visitors", park }) };
  return null;
});
const highlights = computed(() => leafMenus().find((item) => item.key === def.value?.key)?.highlights ?? []);
const items = computed(() => (def.value ? (store.bags[def.value.key] ?? []) : []));
const filterFields = computed(() => def.value?.fields.filter((field) => field.filter) ?? []);

const filters = reactive({
  keyword: "",
  values: {} as Record<string, string | undefined>,
});

function resetFilters() {
  filters.keyword = "";
  filters.values = {};
  for (const field of filterFields.value) filters.values[field.key] = undefined;
}

resetFilters();

const filtersActive = computed(() => Boolean(filters.keyword.trim() || Object.values(filters.values).some(Boolean)));

const filtered = computed(() => {
  const current = def.value;
  if (!current) return [];
  const keyword = filters.keyword.trim().toLowerCase();
  const searchKeys = current.fields.filter((field) => field.search || field.key === current.nameField).map((field) => field.key);
  return items.value.filter((row) => {
    if (keyword) {
      const haystack = [row.code, ...searchKeys.map((key) => row.fields[key] ?? "")].join(" ").toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    for (const field of filterFields.value) {
      const picked = filters.values[field.key];
      if (picked && row.fields[field.key] !== picked) return false;
    }
    return true;
  });
});

const stats = computed(() => {
  const current = def.value;
  if (!current) return [];
  return current.stats.map((stat) => {
    const value = stat.field
      ? items.value.filter((row) => row.fields[stat.field!] === stat.equals).length
      : items.value.length;
    return { label: stat.label, tone: stat.tone, value };
  });
});

const fieldMap = computed(() => {
  const map = new Map<string, FieldDef>();
  for (const field of def.value?.fields ?? []) {
    if (field.list) map.set(field.key, field);
  }
  return map;
});

const columns = computed(() => {
  const current = def.value;
  if (!current) return [];
  return [
    { title: "编号", dataIndex: "code", key: "code", width: 150 },
    ...current.fields
      .filter((field) => field.list)
      .map((field) => ({
        title: field.label,
        key: field.key,
        width: field.width ?? (field.key === current.nameField ? 200 : 140),
        ellipsis: field.kind === "text",
      })),
    { title: "更新", dataIndex: "updatedAt", key: "updatedAt", width: 150 },
    { title: "操作", key: "actions", width: 140, fixed: "right" as const },
  ];
});

const scrollX = computed(() => Math.max(1080, columns.value.reduce((sum, column) => sum + (Number(column.width) || 140), 0)));

function asRow(record: object) {
  return record as CatalogRecord;
}

function fieldOf(key: unknown) {
  return fieldMap.value.get(String(key));
}

function open(id: string) {
  if (!def.value) return;
  router.push(`${def.value.path}/${id}`);
}

function customRow(record: CatalogRecord) {
  return {
    style: { cursor: "pointer" },
    onClick: () => open(record.id),
  };
}

function resetData() {
  if (!def.value) return;
  store.reset(def.value.key);
  message.success(`已恢复${def.value.noun}示例数据`);
}
</script>

<template>
  <a-result v-if="!def" status="404" title="台账不存在" sub-title="这个菜单还没有对应的本地数据。">
    <template #extra>
      <a-button type="primary" @click="router.push('/dashboard')">返回工作台</a-button>
    </template>
  </a-result>

  <section v-else class="page-stack">
    <header class="page-hero">
      <div>
        <div class="eyebrow">{{ def.group }}</div>
        <h1>{{ def.title }}</h1>
        <p>{{ def.description }}</p>
      </div>
      <a-space wrap>
        <a-button v-if="screenJump" :href="screenJump.href">{{ screenJump.label }}</a-button>
        <a-popconfirm :title="`清除本地改动，恢复${def.noun}示例数据？`" ok-text="恢复" cancel-text="取消" @confirm="resetData">
          <a-button>恢复示例</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="router.push(`${def.path}/new`)">{{ def.createLabel }}</a-button>
      </a-space>
    </header>

    <div v-if="highlights.length" class="chips">
      <span v-for="item in highlights" :key="item">{{ item }}</span>
    </div>

    <div class="kpi-grid">
      <article v-for="item in stats" :key="item.label" class="kpi">
        <span>{{ item.label }}</span>
        <strong :class="item.tone">{{ item.value }}</strong>
      </article>
    </div>

    <a-card class="glow-card" :bordered="false">
      <div class="filters">
        <a-input-search v-model:value="filters.keyword" allow-clear class="search" placeholder="编号、名称或关键字" />
        <a-select
          v-for="field in filterFields"
          :key="field.key"
          v-model:value="filters.values[field.key]"
          allow-clear
          show-search
          option-filter-prop="label"
          class="filter"
          :placeholder="field.label"
          :options="(field.options ?? []).map((value) => ({ value, label: value }))"
        />
        <a-button @click="resetFilters">重置</a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="filtered"
        :row-key="(record: CatalogRecord) => record.id"
        :pagination="{ pageSize: 8, showTotal: (total: number) => `共 ${total} 条` }"
        :scroll="{ x: scrollX }"
        :custom-row="customRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="fieldOf(column.key)?.tag && asRow(record).fields[String(column.key)]">
            <a-tag :color="tagColor(asRow(record).fields[String(column.key)])">{{ asRow(record).fields[String(column.key)] }}</a-tag>
          </template>
          <template v-else-if="fieldOf(column.key)">
            {{ showValue(fieldOf(column.key)!, asRow(record).fields[String(column.key)] ?? "") }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space @click.stop>
              <a-button type="link" size="small" @click="open(asRow(record).id)">详情</a-button>
              <a-button type="link" size="small" @click="router.push(`${def.path}/${asRow(record).id}/edit`)">编辑</a-button>
            </a-space>
          </template>
        </template>
        <template #emptyText>
          <ListEmpty
            :filtered="filtersActive"
            :description="filtersActive ? `没有符合筛选条件的${def.noun}` : `还没有${def.noun}`"
            :create-label="def.createLabel"
            @clear="resetFilters"
            @create="router.push(`${def.path}/new`)"
          />
        </template>
      </a-table>
    </a-card>
  </section>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chips span {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(29, 109, 255, 0.08);
  color: #1e3a8a;
  font-size: 12px;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}
.search {
  flex: 1 1 240px;
  min-width: 200px;
}
.filter {
  flex: 1 1 150px;
  min-width: 140px;
}
</style>
