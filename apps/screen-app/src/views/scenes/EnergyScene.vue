<script setup lang="ts">
import { computed } from "vue";
import { palette } from "@park/shared";
import { bars, flowLines, ring } from "@/charts";
import CountUp from "@/components/CountUp.vue";
import EChart from "@/components/EChart.vue";
import GlassPanel from "@/components/GlassPanel.vue";
import { levelTone, usePark } from "@/composables/usePark";

const { park } = usePark();
const trend = computed(() =>
  flowLines(park.value.hours, [
    { name: "用电 kW", data: park.value.powerSeries, color: palette.green },
    { name: "用水 t", data: park.value.waterSeries, color: palette.cyan },
  ]),
);
const split = computed(() => ring(park.value.energySplit));
const buildings = computed(() => bars(park.value.buildingsEnergy, palette.green));
const abnormal = computed(() => park.value.meters.filter((item) => item.status !== "正常").length);
</script>

<template>
  <div class="scene-board">
    <div class="stat-row">
      <article><span>实时负荷</span><strong><CountUp :value="park.powerNow" /><em>kW</em></strong></article>
      <article><span>今日用水</span><strong><CountUp :value="park.waterToday" /><em>t</em></strong></article>
      <article><span>单位能耗</span><strong class="text">{{ park.intensity }}</strong></article>
      <article><span>异常表计</span><strong><CountUp :value="abnormal" /><em>块</em></strong></article>
    </div>
    <div class="layout-energy">
      <GlassPanel title="分时水电" extra="演示曲线">
        <EChart :option="trend" />
      </GlassPanel>
      <GlassPanel title="用能结构">
        <EChart :option="split" />
      </GlassPanel>
      <GlassPanel title="楼宇用电" extra="kW">
        <EChart :option="buildings" />
      </GlassPanel>
      <GlassPanel title="表计">
        <div class="meter-col">
          <article v-for="item in park.meters" :key="item.name" :class="['meter', levelTone(item.status)]">
            <span>{{ item.kind }} · {{ item.building }}</span>
            <strong>{{ item.name }}</strong>
            <span>{{ item.value }}</span>
            <em :class="['tag', levelTone(item.status)]">{{ item.status }}</em>
          </article>
        </div>
      </GlassPanel>
    </div>
  </div>
</template>

<style scoped>
.text { font-size: 18px !important; }
.meter-col { display: flex; flex-direction: column; gap: 8px; height: 100%; }
</style>
