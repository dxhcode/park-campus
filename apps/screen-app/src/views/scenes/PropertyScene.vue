<script setup lang="ts">
import { computed } from "vue";
import { bars, radar } from "@/charts";
import EChart from "@/components/EChart.vue";
import GlassPanel from "@/components/GlassPanel.vue";
import { levelTone, sumOnline, usePark } from "@/composables/usePark";

const { park } = usePark();
const quality = computed(() => radar(park.value.serviceRadar));
const online = computed(() => sumOnline(park.value));
const onlineRate = computed(() => Math.round((online.value.online / online.value.total) * 100));
const progress = computed(() => Math.round(park.value.shifts.reduce((sum, item) => sum + item.progress, 0) / park.value.shifts.length));
const facilityBars = computed(() =>
  bars(
    park.value.facilities.map((item) => ({ name: item.name, value: Math.round((item.online / item.total) * 100) })),
    "#38bdf8",
    true,
  ),
);
</script>

<template>
  <div class="scene-board">
    <div class="stat-row">
      <article><span>在岗人数</span><strong>{{ park.shifts.reduce((sum, item) => sum + item.members, 0) }}<em>人</em></strong></article>
      <article><span>设施在线</span><strong>{{ onlineRate }}<em>%</em></strong></article>
      <article><span>巡检进度</span><strong>{{ progress }}<em>%</em></strong></article>
      <article><span>遗留事项</span><strong>{{ park.issues.length }}<em>项</em></strong></article>
    </div>
    <div class="layout-property">
      <div class="shifts">
        <article v-for="shift in park.shifts" :key="shift.name" class="shift">
          <span>{{ shift.lead }} · {{ shift.members }} 人</span>
          <strong>{{ shift.name }}</strong>
          <span>{{ shift.focus }}</span>
          <div class="bar" :title="`${shift.progress}%`"><i :style="{ width: `${shift.progress}%` }"></i></div>
        </article>
      </div>
      <GlassPanel title="班组质量" extra="五维">
        <EChart :option="quality" />
      </GlassPanel>
      <GlassPanel title="设施在线率" :extra="`${online.online}/${online.total}`">
        <EChart :option="facilityBars" />
      </GlassPanel>
      <GlassPanel title="今日遗留" :extra="park.dutyName">
        <ul class="feed">
          <li v-for="item in park.issues" :key="item.title">
            <span>{{ item.team }}</span>
            <strong>{{ item.title }}</strong>
            <em :class="['tag', levelTone(item.status)]">{{ item.status }}</em>
          </li>
        </ul>
      </GlassPanel>
    </div>
  </div>
</template>

<style scoped>
.feed li { grid-template-columns: 52px minmax(0, 1fr); }
.feed em { grid-column: 2; }
</style>
