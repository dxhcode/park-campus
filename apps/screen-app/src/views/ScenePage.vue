<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => route.meta.title);
const description = computed(() => route.meta.description);
const accent = computed(() => route.meta.accent);
const panels = computed(() => route.meta.panels ?? []);
</script>

<template>
  <section class="scene" :style="{ '--accent': accent }">
    <header class="scene-head">
      <div>
        <div class="kicker">SCENE</div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
      <a-tag color="cyan">空数据壳</a-tag>
    </header>

    <div class="kpis">
      <article v-for="panel in panels" :key="panel" class="glass">
        <header>
          <span>{{ panel }}</span>
          <i></i>
        </header>
        <strong>—</strong>
        <a-skeleton active :title="false" :paragraph="{ rows: 1, width: '60%' }" />
      </article>
    </div>

    <div class="board">
      <article class="glass wide">
        <header>
          <span>主视图占位</span>
          <em>图表 / 地图后续接入</em>
        </header>
        <div class="viewport">
          <div class="frame"></div>
          <p>等待数据层</p>
        </div>
      </article>
      <article class="glass side">
        <header>
          <span>事件流</span>
          <em>暂无告警</em>
        </header>
        <a-skeleton v-for="row in 4" :key="row" active :title="false" :paragraph="{ rows: 2 }" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.scene-head,
.kpis,
.board {
  position: relative;
  z-index: 1;
}
.scene-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 14px;
}
.kicker {
  color: var(--accent);
  letter-spacing: 0.28em;
  font-size: 12px;
}
h2 {
  margin: 4px 0 6px;
  font-size: 32px;
  text-shadow: 0 0 18px color-mix(in srgb, var(--accent) 55%, transparent);
}
p {
  margin: 0;
  max-width: 760px;
  color: rgba(226, 232, 240, 0.74);
}
.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.glass {
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(12, 24, 44, 0.72), rgba(6, 12, 24, 0.55));
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  box-shadow: inset 0 0 24px rgba(8, 20, 40, 0.35), 0 0 24px color-mix(in srgb, var(--accent) 18%, transparent);
  backdrop-filter: blur(14px);
}
.glass header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(226, 232, 240, 0.8);
  font-size: 13px;
}
.glass header i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}
.glass strong {
  display: block;
  margin: 8px 0 4px;
  font-size: 28px;
  color: white;
}
.glass header em {
  color: rgba(186, 230, 253, 0.62);
  font-style: normal;
  font-size: 12px;
}
.board {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.8fr);
  gap: 12px;
  margin-top: 12px;
}
.viewport {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 280px;
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  background:
    linear-gradient(rgba(103, 232, 249, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.08) 1px, transparent 1px),
    rgba(2, 8, 20, 0.45);
  background-size: 32px 32px, 32px 32px, auto;
}
.frame {
  position: absolute;
  inset: 18px;
  border: 1px dashed color-mix(in srgb, var(--accent) 70%, white);
  border-radius: 12px;
}
.viewport p {
  position: relative;
  letter-spacing: 0.24em;
  color: var(--accent);
}
.side :deep(.ant-skeleton) {
  margin-top: 14px;
}
@media (max-width: 1100px) {
  .kpis,
  .board {
    grid-template-columns: 1fr;
  }
}
</style>
