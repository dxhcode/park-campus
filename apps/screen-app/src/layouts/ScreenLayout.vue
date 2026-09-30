<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import { site } from "@park/shared";
import { scenes } from "@/scenes";
import { useScreenStore } from "@/stores/screen";

const screen = useScreenStore();
let timer = 0;

onMounted(() => {
  timer = window.setInterval(() => screen.tick(), 1000);
});

onUnmounted(() => {
  window.clearInterval(timer);
});
</script>

<template>
  <div class="screen-root">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="orb orb-a" aria-hidden="true"></div>
    <div class="orb orb-b" aria-hidden="true"></div>
    <div class="scan" aria-hidden="true"></div>

    <header class="topbar">
      <div class="identity">
        <div class="mark">园</div>
        <div>
          <div class="badge">{{ site.badge }} · {{ screen.campusName }}</div>
          <h1>{{ site.name }} · {{ site.screenName }}</h1>
        </div>
      </div>
      <nav class="nav" aria-label="场景切换">
        <RouterLink v-for="scene in scenes" :key="scene.key" :to="scene.path">
          {{ scene.title }}
        </RouterLink>
      </nav>
      <div class="clock">
        <span>系统时间</span>
        <strong>{{ screen.clock }}</strong>
      </div>
    </header>

    <main class="stage">
      <router-view />
    </main>

    <footer class="status">
      <span class="pulse"></span>
      数据通道未接入 · 场景壳已就绪 · 静态原型
    </footer>
  </div>
</template>

<style scoped>
.screen-root {
  position: relative;
  min-height: 100vh;
  padding: 18px 22px 16px;
  overflow: hidden;
}
.bg-grid,
.orb,
.scan {
  position: fixed;
  pointer-events: none;
}
.bg-grid {
  inset: 0;
  background-image:
    linear-gradient(rgba(103, 232, 249, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at 50% 40%, #000 25%, transparent 80%);
  animation: drift 20s linear infinite;
}
.orb {
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(20px);
}
.orb-a {
  top: -120px;
  left: -80px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.28), transparent 68%);
}
.orb-b {
  right: -100px;
  bottom: -140px;
  background: radial-gradient(circle, rgba(245, 193, 108, 0.22), transparent 68%);
}
.scan {
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(180deg, transparent, rgba(103, 232, 249, 0.08), transparent);
  animation: scan 7s linear infinite;
}
.topbar,
.stage,
.status {
  position: relative;
  z-index: 1;
}
.topbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) auto minmax(180px, 1fr);
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 18px;
  background: rgba(8, 16, 32, 0.55);
  border: 1px solid rgba(103, 232, 249, 0.28);
  box-shadow: 0 0 32px rgba(34, 211, 238, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
}
.identity {
  display: flex;
  gap: 12px;
  align-items: center;
}
.mark {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  color: #07111f;
  font-weight: 800;
  background: linear-gradient(135deg, #67e8f9, #f5c16c);
  box-shadow: 0 0 22px rgba(103, 232, 249, 0.55);
}
.badge {
  color: #67e8f9;
  letter-spacing: 0.16em;
  font-size: 12px;
}
h1 {
  margin: 2px 0 0;
  font-size: 22px;
  letter-spacing: 0.06em;
}
.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.nav a {
  padding: 8px 12px;
  border-radius: 999px;
  color: rgba(226, 232, 240, 0.82);
  text-decoration: none;
  border: 1px solid rgba(148, 197, 255, 0.18);
  background: rgba(255, 255, 255, 0.03);
}
.nav a.router-link-active {
  color: #07111f;
  background: linear-gradient(90deg, #67e8f9, #e0f2fe);
  border-color: transparent;
  box-shadow: 0 0 18px rgba(103, 232, 249, 0.45);
}
.clock {
  justify-self: end;
  text-align: right;
}
.clock span {
  display: block;
  color: rgba(186, 230, 253, 0.7);
  font-size: 12px;
  letter-spacing: 0.14em;
}
.clock strong {
  font-variant-numeric: tabular-nums;
  font-size: 16px;
}
.stage {
  margin-top: 16px;
}
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: rgba(186, 230, 253, 0.75);
  font-size: 12px;
  letter-spacing: 0.12em;
}
.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 12px #34d399;
  animation: blink 1.6s ease-in-out infinite;
}
@keyframes drift {
  to { background-position: 0 56px, 56px 0; }
}
@keyframes scan {
  from { top: -10%; }
  to { top: 110%; }
}
@keyframes blink {
  50% { opacity: 0.35; }
}
@media (max-width: 1100px) {
  .topbar {
    grid-template-columns: 1fr;
  }
  .clock {
    justify-self: start;
    text-align: left;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bg-grid,
  .scan,
  .pulse {
    animation: none;
  }
}
</style>
