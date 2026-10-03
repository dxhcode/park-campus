<script setup lang="ts">
import { computed } from "vue";
import { bars, flowLines } from "@/charts";
import CountUp from "@/components/CountUp.vue";
import EChart from "@/components/EChart.vue";
import GlassPanel from "@/components/GlassPanel.vue";
import { levelTone, usePark } from "@/composables/usePark";

const { park } = usePark();
const flow = computed(() =>
  flowLines(park.value.hours, [
    { name: "人行", data: park.value.peopleSeries, color: "#a78bfa" },
    { name: "车行", data: park.value.vehicleSeries, color: "#67e8f9" },
  ]),
);
const gates = computed(() =>
  bars(
    park.value.gates.map((item) => ({ name: item.name, value: item.people + item.cars })),
    "#a78bfa",
    true,
  ),
);
const onSite = computed(() => park.value.visitors.filter((item) => item.status === "在园").length);
const dots = computed(() =>
  Array.from({ length: 18 }, (_, index) => ({
    id: index,
    online: index < Math.round((park.value.camerasOnline / park.value.camerasTotal) * 18),
    label: `${park.value.map.buildings[index % park.value.map.buildings.length]?.name ?? "园区"}-${index + 1}`,
  })),
);
</script>

<template>
  <div class="scene-board">
    <div class="stat-row">
      <article><span>人行通行</span><strong><CountUp :value="park.peopleToday" /><em>人次</em></strong></article>
      <article><span>车辆通行</span><strong><CountUp :value="park.vehiclesToday" /><em>辆次</em></strong></article>
      <article><span>访客在园</span><strong><CountUp :value="onSite" /><em>人</em></strong></article>
      <article><span>点位在线</span><strong>{{ park.camerasOnline }}<em>/ {{ park.camerasTotal }}</em></strong></article>
    </div>
    <div class="layout-access">
      <GlassPanel title="人车分时" extra="演示曲线">
        <EChart :option="flow" />
      </GlassPanel>
      <GlassPanel title="闸口流量">
        <EChart :option="gates" />
      </GlassPanel>
      <GlassPanel title="视频点位" :extra="`${park.camerasOnline} 路在线`">
        <div class="cams">
          <span v-for="dot in dots" :key="dot.id" :class="{ off: !dot.online }" :title="dot.label"></span>
        </div>
        <p class="muted">示意点位，不播放画面。热线 {{ park.hotline }}</p>
      </GlassPanel>
      <GlassPanel title="访客">
        <ul class="feed">
          <li v-for="item in park.visitors" :key="item.name">
            <span>{{ item.status.slice(0, 2) }}</span>
            <strong>{{ item.name }} · {{ item.company }}</strong>
            <em :class="['tag', levelTone(item.status === '在园' ? '正常' : '待')]">{{ item.host }} · {{ item.status }}</em>
          </li>
        </ul>
      </GlassPanel>
    </div>
  </div>
</template>

<style scoped>
.cams {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  padding: 8px 0 12px;
}
.cams span {
  height: 28px;
  border-radius: 8px;
  background: rgba(167, 139, 250, 0.85);
  box-shadow: 0 0 12px rgba(167, 139, 250, 0.8);
  animation: blink 2.4s ease-in-out infinite;
}
.cams span.off {
  background: rgba(148, 163, 184, 0.25);
  box-shadow: none;
  animation: none;
}
.cams span:nth-child(3n) { animation-delay: 0.4s; }
.cams span:nth-child(4n) { animation-delay: 0.8s; }
@keyframes blink { 50% { opacity: 0.45; } }
@media (prefers-reduced-motion: reduce) {
  .cams span { animation: none; }
}
</style>
