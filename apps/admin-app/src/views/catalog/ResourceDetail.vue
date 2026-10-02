<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { showValue, tagColor } from "@/catalog/present";
import { resourceByKey } from "@/catalog/resources";
import { useCatalogStore } from "@/stores/catalog";

const route = useRoute();
const router = useRouter();
const store = useCatalogStore();

const def = computed(() => resourceByKey(String(route.meta.resource ?? "")));
const item = computed(() => (def.value ? store.byId(def.value.key, String(route.params.id)) : undefined));

function syncTitle() {
  const current = def.value;
  if (!current) return;
  const name = item.value?.fields[current.nameField];
  document.title = `${name || current.title} · 园区运营平台`;
}

watch(item, syncTitle);
onMounted(syncTitle);

function remove() {
  if (!def.value || !item.value) return;
  store.remove(def.value.key, item.value.id);
  message.success("已从本机台账删除");
  router.push(def.value.path);
}
</script>

<template>
  <a-result v-if="!def" status="404" title="台账不存在">
    <template #extra>
      <a-button type="primary" @click="router.push('/dashboard')">返回工作台</a-button>
    </template>
  </a-result>
  <a-result v-else-if="!item" status="404" :title="`${def.noun}不存在`" sub-title="可能已删除，或恢复示例数据后编号变了。">
    <template #extra>
      <a-button type="primary" @click="router.push(def.path)">返回列表</a-button>
    </template>
  </a-result>

  <section v-else class="page-stack">
    <header class="page-hero">
      <div>
        <div class="eyebrow">{{ item.code }} · {{ def.group }}</div>
        <h1>{{ item.fields[def.nameField] || def.title }}</h1>
        <p>{{ def.description }}</p>
      </div>
      <a-space wrap>
        <a-button @click="router.push(def.path)">返回列表</a-button>
        <a-button type="primary" @click="router.push(`${def.path}/${item.id}/edit`)">编辑</a-button>
        <a-popconfirm title="从本机台账删除这条记录？" ok-text="删除" cancel-text="取消" @confirm="remove">
          <a-button danger>删除</a-button>
        </a-popconfirm>
      </a-space>
    </header>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card class="glow-card" :bordered="false" title="档案">
          <a-descriptions bordered :column="2" size="middle">
            <a-descriptions-item
              v-for="field in def.fields"
              :key="field.key"
              :label="field.label"
              :span="field.kind === 'textarea' ? 2 : 1"
            >
              <a-tag v-if="field.tag && item.fields[field.key]" :color="tagColor(item.fields[field.key])">
                {{ item.fields[field.key] }}
              </a-tag>
              <template v-else>{{ showValue(field, item.fields[field.key] ?? "") }}</template>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card class="glow-card" :bordered="false" title="维护信息">
          <a-descriptions :column="1" size="middle">
            <a-descriptions-item label="编号">{{ item.code }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ item.createdAt }}</a-descriptions-item>
            <a-descriptions-item label="最近更新">{{ item.updatedAt }}</a-descriptions-item>
            <a-descriptions-item label="维护人">{{ item.updatedBy }}</a-descriptions-item>
          </a-descriptions>
          <p class="hint">删除和编辑只影响这台浏览器。列表里的「恢复示例」会带回初始数据。</p>
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<style scoped>
.hint {
  margin: 16px 0 0;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.7;
}
:deep(.ant-descriptions-item-content) {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
