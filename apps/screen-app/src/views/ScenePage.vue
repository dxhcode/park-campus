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
      <a-tag color="cyan">待接入</a-tag>
    </header>

    <article class="soon">
      <div class="visual" aria-hidden="true">
        <div class="ring"></div>
        <div class="core">待接入</div>
      </div>
      <div class="copy">
        <div class="kicker">COMING SOON</div>
        <h3>地图与图表尚未接入</h3>
        <p>这一屏先留作场景入口。实时 KPI、地图和曲线会在后续态势里补上，现在不放空骨架。</p>
        <div class="chips">
          <span v-for="panel in panels" :key="panel">{{ panel }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.scene-head,
.soon {
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
  line-height: 1.7;
}
.soon {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  min-height: 360px;
  padding: 36px 40px;
  border-radius: 22px;
  background:
    radial-gradient(420px 180px at 0% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
    linear-gradient(180deg, rgba(12, 24, 44, 0.78), rgba(6, 12, 24, 0.62));
  border: 1px solid color-mix(in srgb, var(--accent) 48%, transparent);
  box-shadow: inset 0 0 32px rgba(8, 20, 40, 0.35), 0 0 28px color-mix(in srgb, var(--accent) 16%, transparent);
  backdrop-filter: blur(16px);
}
.visual {
  position: relative;
  display: grid;
  place-items: center;
  width: 168px;
  height: 168px;
}
.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--accent) 75%, white);
  box-shadow: 0 0 28px color-mix(in srgb, var(--accent) 35%, transparent), inset 0 0 24px color-mix(in srgb, var(--accent) 18%, transparent);
  animation: spin 18s linear infinite;
}
.core {
  position: relative;
  letter-spacing: 0.28em;
  color: var(--accent);
  font-size: 13px;
}
h3 {
  margin: 8px 0 10px;
  font-size: 28px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}
.chips span {
  padding: 6px 12px;
  border-radius: 999px;
  color: rgba(224, 242, 254, 0.9);
  font-size: 13px;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: rgba(8, 16, 32, 0.45);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 800px) {
  .soon {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  h2,
  h3 {
    font-size: 24px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ring {
    animation: none;
  }
}
</style>
