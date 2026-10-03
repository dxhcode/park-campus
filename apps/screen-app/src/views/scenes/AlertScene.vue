<script setup lang="ts">
import { computed } from "vue";
import { bars, ring } from "@/charts";
import CountUp from "@/components/CountUp.vue";
import EChart from "@/components/EChart.vue";
import GlassPanel from "@/components/GlassPanel.vue";
import { levelTone, usePark } from "@/composables/usePark";

const { park } = usePark();
const levels = computed(() => ring(park.value.alertLevels));
const systems = computed(() => bars(park.value.alertSystems, "#fb7185", true));
const openCount = computed(() => park.value.alerts.filter((item) => item.status !== "已关闭").length);
const pending = computed(() => park.value.alerts.filter((item) => item.status === "未确认").length);
const handling = computed(() => park.value.alerts.filter((item) => item.status === "处置中").length);
const wall = computed(() => [...park.value.alerts, ...park.value.alerts]);
</script>

<template>
  <div class="scene-board">
    <div class="stat-row">
      <article><span>未关闭</span><strong><CountUp :value="openCount" /><em>条</em></strong></article>
      <article><span>未确认</span><strong><CountUp :value="pending" /><em>条</em></strong></article>
      <article><span>处置中</span><strong><CountUp :value="handling" /><em>条</em></strong></article>
      <article><span>今日关闭</span><strong><CountUp :value="park.closedToday" /><em>条</em></strong></article>
    </div>
    <div class="layout-alerts">
      <GlassPanel title="等级">
        <EChart :option="levels" />
      </GlassPanel>
      <GlassPanel title="告警墙" :extra="`${park.alertsHigh} 条高等级`">
        <div class="wall-window">
          <div class="wall-track">
            <article v-for="(item, index) in wall" :key="`${item.title}-${index}`" :class="{ bad: item.level === '紧急' }">
              <span>{{ item.time }} · {{ item.place }}</span>
              <strong>{{ item.title }}</strong>
              <em :class="['tag', levelTone(item.level)]">{{ item.level }} · {{ item.status }}</em>
            </article>
          </div>
        </div>
      </GlassPanel>
      <GlassPanel title="来源系统">
        <EChart :option="systems" />
      </GlassPanel>
    </div>
  </div>
</template>

<style scoped>
.wall-track article { margin-bottom: 8px; }
.wall-track article.bad { border-color: rgba(251, 113, 133, 0.65); }
.layout-alerts { min-height: 520px; }
.wall-window { max-height: 460px; }
</style>
