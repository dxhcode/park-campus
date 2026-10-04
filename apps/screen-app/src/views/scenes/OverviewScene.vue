<script setup lang="ts">
import { computed } from "vue";
import { palette } from "@park/shared";
import { bars, flowLines, gauge, ring } from "@/charts";
import CountUp from "@/components/CountUp.vue";
import EChart from "@/components/EChart.vue";
import GlassPanel from "@/components/GlassPanel.vue";
import ParkMap from "@/components/ParkMap.vue";
import { usePark } from "@/composables/usePark";

const { park } = usePark();
const occupancy = computed(() => gauge(park.value.occupancy));
const industries = computed(() => ring(park.value.industries));
const flow = computed(() =>
  flowLines(park.value.hours, [
    { name: "通行人次", data: park.value.peopleSeries, color: palette.cyan },
    { name: "用电 kW", data: park.value.powerSeries, color: palette.gold },
  ]),
);
const money = computed(() =>
  bars(
    [
      { name: "应收折算", value: Number(park.value.receivable.replace(/[^\d.]/g, "")) },
      { name: "已收折算", value: Number(park.value.collected.replace(/[^\d.]/g, "")) },
    ],
    palette.green,
  ),
);
</script>

<template>
  <div class="scene-board">
    <div class="stat-row">
      <article><span>在园企业</span><strong><CountUp :value="park.companies" /><em>家</em></strong></article>
      <article><span>今日通行</span><strong><CountUp :value="park.peopleToday" /><em>人次</em></strong></article>
      <article><span>实时负荷</span><strong><CountUp :value="park.powerNow" /><em>kW</em></strong></article>
      <article><span>逾期账单</span><strong><CountUp :value="park.overdueBills" /><em>笔</em></strong></article>
    </div>
    <div class="layout-overview">
      <GlassPanel title="产业结构" :extra="`${park.companies} 家`">
        <EChart :option="industries" />
      </GlassPanel>
      <GlassPanel title="园区空间" :extra="park.area">
        <ParkMap :park="park" />
      </GlassPanel>
      <GlassPanel title="出租与收费" :extra="park.collected">
        <div class="split">
          <EChart :option="occupancy" />
          <EChart :option="money" />
        </div>
      </GlassPanel>
      <GlassPanel class="wide" title="今日通行与负荷" extra="08:00–19:00">
        <EChart :option="flow" />
      </GlassPanel>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-rows: 1.1fr 0.9fr;
  height: 100%;
  min-height: 280px;
}
</style>
