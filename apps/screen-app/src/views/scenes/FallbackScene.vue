<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => String(route.meta.title ?? "未知场景"));
const description = computed(() => String(route.meta.description ?? ""));
const panels = computed(() => (Array.isArray(route.meta.panels) ? route.meta.panels : []));
</script>

<template>
  <section class="glass scene-board">
    <header class="glass-head">
      <h3>{{ title }}</h3>
    </header>
    <p>{{ description }}</p>
    <div class="chips">
      <span v-for="panel in panels" :key="String(panel)">{{ panel }}</span>
    </div>
  </section>
</template>

<style scoped>
p { color: rgba(226, 232, 240, 0.75); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.chips span {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.35);
}
</style>
