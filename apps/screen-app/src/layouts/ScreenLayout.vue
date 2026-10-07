<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { message } from "ant-design-vue";
import {
  adminFromLabel,
  adminHref,
  clearSession,
  demoAccounts,
  isParkKey,
  loginWithDemo,
  parks,
  readSession,
  safeAdminPath,
  sceneAdminFallback,
  site,
  type ParkKey,
  type SessionUser,
} from "@park/shared";
import { RouteMotion } from "@park/components";
import KpiTicker from "@/components/KpiTicker.vue";
import { cockpitOf } from "@/data/parks";
import { scenes } from "@/scenes";
import { useScreenStore } from "@/stores/screen";

const route = useRoute();
const router = useRouter();
const screen = useScreenStore();
const session = ref<SessionUser | null>(readSession());
const unlockOpen = ref(false);
const park = computed(() => cockpitOf(screen.parkKey));
const fromLabel = computed(() => adminFromLabel(route.query.from));
const backHref = computed(() => {
  const sceneName = typeof route.name === "string" ? route.name : "overview";
  const fallback = sceneAdminFallback[sceneName] ?? "/dashboard";
  return adminHref(safeAdminPath(route.query.from, fallback), { park: screen.parkKey });
});
let timer = 0;

function syncPark() {
  const raw = route.query.park;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value === "string" && isParkKey(value) && value !== screen.parkKey) screen.setPark(value);
}

function pickPark(key: ParkKey) {
  screen.setPark(key);
  router.replace({ query: { ...route.query, park: key } });
}

watch(() => route.query.park, syncPark, { immediate: true });

function refreshSession() {
  session.value = readSession();
}

function enter(username: string, password: string) {
  const result = loginWithDemo(username, password);
  if (!result.ok) {
    message.warning(result.message);
    return;
  }
  refreshSession();
  unlockOpen.value = false;
  message.success(`已解锁，${result.user.displayName}`);
}

function leave() {
  clearSession();
  refreshSession();
  message.success("已退出演示会话，大屏仍可浏览");
}

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
          <div class="badge">{{ site.badge }} · {{ park.name }}</div>
          <h1>{{ site.name }} · {{ site.screenName }}</h1>
          <div class="park-switch" role="group" aria-label="切换园区">
            <button
              v-for="item in parks"
              :key="item.key"
              type="button"
              :class="{ on: item.key === screen.parkKey }"
              :title="item.name"
              @click="pickPark(item.key)"
            >
              {{ item.short }}
            </button>
          </div>
        </div>
      </div>
      <nav class="nav" aria-label="场景切换">
        <RouterLink v-for="scene in scenes" :key="scene.key" :to="{ path: scene.path, query: route.query }">
          {{ scene.title }}
        </RouterLink>
      </nav>
      <div class="clock">
        <span>系统时间</span>
        <strong>{{ screen.clock }}</strong>
        <button type="button" class="unlock" @click="unlockOpen = true">
          {{ session ? `${session.displayName} · ${session.roleName}` : "开放浏览 · 演示解锁" }}
        </button>
        <a class="back-link" :href="backHref">返回管理端</a>
      </div>
    </header>

    <KpiTicker :park="park" :second="screen.now.getSeconds()" />
    <div v-if="fromLabel" class="hop-ribbon">
      <span>演示跳转 · 来自{{ fromLabel }}</span>
      <a :href="backHref">回到{{ fromLabel }}</a>
    </div>

    <main class="stage">
      <router-view v-slot="{ Component }">
        <RouteMotion>
          <component :is="Component" :key="route.path" />
        </RouteMotion>
      </router-view>
    </main>

    <footer class="status">
      <span class="pulse"></span>
      {{ park.city }} · {{ park.hotline }} · 演示数据可从管理端跳入
    </footer>
  </div>

  <a-modal v-model:open="unlockOpen" title="演示解锁" :footer="null" width="460px">
    <p class="unlock-copy">大屏不拦截浏览。解锁后写入与管理端相同的本地会话；同域打开后台时无需再次登录。</p>
    <div class="unlock-list">
      <button
        v-for="account in demoAccounts"
        :key="account.username"
        type="button"
        @click="enter(account.username, account.password)"
      >
        <strong>{{ account.displayName }}</strong>
        <span>{{ account.username }} / {{ account.password }} · {{ account.roleName }}</span>
      </button>
    </div>
    <div class="unlock-actions">
      <a-button v-if="session" danger @click="leave">退出会话</a-button>
      <a-button type="primary" @click="unlockOpen = false">继续开放浏览</a-button>
    </div>
  </a-modal>
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
  grid-template-columns: minmax(220px, 1.1fr) minmax(0, auto) minmax(168px, 0.9fr);
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
  font-size: clamp(16px, 2vw, 22px);
  letter-spacing: 0.04em;
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
  font-size: 13px;
  letter-spacing: 0.04em;
  color: rgba(226, 232, 240, 0.82);
  text-decoration: none;
  border: 1px solid rgba(148, 197, 255, 0.18);
  background: rgba(255, 255, 255, 0.03);
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.nav a.router-link-active {
  color: #07111f;
  background: linear-gradient(90deg, #67e8f9, #e0f2fe);
  border-color: transparent;
  box-shadow: 0 0 18px rgba(103, 232, 249, 0.45);
  animation: nav-pop 0.28s ease;
}
@keyframes nav-pop {
  from {
    transform: translateY(4px);
    opacity: 0.55;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  justify-self: end;
  min-width: 0;
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
.unlock {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.35);
  background: rgba(8, 16, 32, 0.45);
  color: #e0f2fe;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}
.unlock-copy {
  margin-top: 0;
  color: rgba(226, 232, 240, 0.82);
}
.unlock-list {
  display: grid;
  gap: 8px;
}
.unlock-list button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(103, 232, 249, 0.35);
  background: rgba(8, 16, 32, 0.72);
  color: #e8f1ff;
  cursor: pointer;
  text-align: left;
}
.unlock-list span {
  color: rgba(186, 230, 253, 0.72);
  font-size: 12px;
}
.unlock-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
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
    align-items: flex-start;
    justify-self: start;
    text-align: left;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bg-grid,
  .scan,
  .pulse,
  .nav a.router-link-active {
    animation: none;
  }
  .nav a {
    transition: none;
  }
}
</style>
