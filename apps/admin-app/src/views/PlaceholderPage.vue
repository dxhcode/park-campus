<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => route.meta.title);
const description = computed(() => route.meta.description);
const group = computed(() => route.meta.group);
const highlights = computed(() => route.meta.highlights ?? []);
</script>

<template>
  <section class="page">
    <header class="hero">
      <div>
        <div class="eyebrow">{{ group }}</div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
      <a-tag color="processing">原型占位</a-tag>
    </header>

    <div class="chips">
      <span v-for="item in highlights" :key="item">{{ item }}</span>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col v-for="item in highlights" :key="item" :xs="24" :sm="12" :xl="6">
        <a-card class="glow-card" :bordered="false">
          <div class="card-label">{{ item }}</div>
          <a-skeleton active :title="{ width: '46%' }" :paragraph="{ rows: 1, width: '70%' }" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="lower">
      <a-col :xs="24" :lg="16">
        <a-card class="glow-card" :bordered="false" title="列表示意">
          <a-skeleton active :paragraph="{ rows: 6 }" />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card class="glow-card" :bordered="false" title="接入说明">
          <a-empty description="数据接口将于后续阶段接入" />
        </a-card>
      </a-col>
    </a-row>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 22px 24px;
  border-radius: 18px;
  background:
    radial-gradient(420px 140px at 100% 0%, rgba(29, 109, 255, 0.16), transparent 70%),
    linear-gradient(180deg, #ffffff, #f8fbff);
  border: 1px solid rgba(29, 109, 255, 0.08);
  box-shadow: 0 16px 40px rgba(15, 35, 70, 0.06);
}
.eyebrow {
  color: #1d6dff;
  letter-spacing: 0.18em;
  font-size: 12px;
}
h1 {
  margin: 6px 0 8px;
  font-size: 30px;
  line-height: 1.2;
}
p {
  margin: 0;
  max-width: 720px;
  color: rgba(15, 23, 42, 0.68);
  line-height: 1.7;
}
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
.card-label {
  margin-bottom: 8px;
  color: rgba(15, 23, 42, 0.55);
  font-size: 13px;
}
.lower {
  margin-top: 0;
}
</style>
