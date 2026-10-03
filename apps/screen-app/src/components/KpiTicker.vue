<script setup lang="ts">
import { computed } from "vue";
import type { Cockpit } from "@/data/parks";

const props = defineProps<{ park: Cockpit; second: number }>();

const items = computed(() => {
  const park = props.park;
  const people = park.peopleToday + (props.second % 5);
  const power = park.powerNow + (props.second % 4) * 3;
  return [
    { label: park.name, value: park.city },
    { label: "在园企业", value: `${park.companies} 家` },
    { label: "今日通行", value: `${people.toLocaleString("zh-CN")} 人次` },
    { label: "在园车辆", value: `${park.vehiclesToday} 辆` },
    { label: "实时负荷", value: `${power.toLocaleString("zh-CN")} kW` },
    { label: "今日用水", value: `${park.waterToday} t` },
    { label: "未闭环工单", value: `${park.openOrders} 单` },
    { label: "超时工单", value: `${park.overtimeOrders} 单` },
    { label: "未确认告警", value: `${park.alertsOpen} 条` },
    { label: "本月应收", value: park.receivable },
    { label: "本月已收", value: park.collected },
    { label: "逾期账单", value: `${park.overdueBills} 笔` },
    { label: "出租率", value: `${park.occupancy}%` },
    { label: "值班", value: `${park.dutyName} ${park.dutyPhone}` },
    { label: "服务热线", value: park.hotline },
  ];
});

const loop = computed(() => [...items.value, ...items.value]);
</script>

<template>
  <div class="ticker" aria-label="园区指标滚动条">
    <div class="ticker-track">
      <span v-for="(item, index) in loop" :key="`${item.label}-${index}`">
        <em>{{ item.label }}</em>
        <strong>{{ item.value }}</strong>
      </span>
    </div>
  </div>
</template>
