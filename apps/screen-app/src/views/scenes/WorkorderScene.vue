<script setup lang="ts">
import { computed } from "vue";
import { palette } from "@park/shared";
import { bars, ring } from "@/charts";
import CountUp from "@/components/CountUp.vue";
import EChart from "@/components/EChart.vue";
import GlassPanel from "@/components/GlassPanel.vue";
import { levelTone, usePark } from "@/composables/usePark";

const { park } = usePark();
const mix = computed(() => ring(park.value.orderStatus));
const categories = computed(() => bars(park.value.orderCategories, palette.gold, true));
const wall = computed(() => [...park.value.orders, ...park.value.orders]);
</script>

<template>
  <div class="scene-board">
    <div class="stat-row">
      <article><span>未闭环</span><strong><CountUp :value="park.openOrders" /><em>单</em></strong></article>
      <article><span>今日完工</span><strong><CountUp :value="park.doneToday" /><em>单</em></strong></article>
      <article><span>超时</span><strong><CountUp :value="park.overtimeOrders" /><em>单</em></strong></article>
      <article><span>紧急未闭环</span><strong>{{ park.orders.filter((item) => item.level === '紧急' && item.status !== '今日完工').length }}<em>单</em></strong></article>
    </div>
    <div class="layout-orders">
      <GlassPanel title="状态结构">
        <EChart :option="mix" />
      </GlassPanel>
      <GlassPanel title="工单墙" extra="实时滚动">
        <div class="wall-window">
          <div class="wall-track">
            <article v-for="(item, index) in wall" :key="`${item.code}-${index}`">
              <span>{{ item.code }} · {{ item.age }}</span>
              <strong>{{ item.title }}</strong>
              <span>{{ item.place }}</span>
              <em :class="['tag', levelTone(item.level)]">{{ item.level }} · {{ item.status }}</em>
            </article>
          </div>
        </div>
      </GlassPanel>
      <GlassPanel title="类别分布">
        <EChart :option="categories" />
      </GlassPanel>
      <GlassPanel class="wide-orders" title="在途清单" :extra="`${park.openOrders} 单未闭环`">
        <ul class="feed">
          <li v-for="item in park.orders" :key="item.code">
            <span>{{ item.age }}</span>
            <strong>{{ item.title }}</strong>
            <em :class="['tag', levelTone(item.status)]">{{ item.status }}</em>
          </li>
        </ul>
      </GlassPanel>
    </div>
  </div>
</template>

<style scoped>
.wide-orders { grid-column: 1 / -1; }
.wall-track article {
  margin-bottom: 8px;
}
.layout-orders {
  grid-template-rows: minmax(240px, 1fr) 220px;
}
@media (max-width: 1100px) {
  .wide-orders { grid-column: auto; }
}
</style>
