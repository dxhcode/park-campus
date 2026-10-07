<script setup lang="ts">
import { computed } from "vue";
import { KpiTicker as ParkKpiTicker, type TickerItem } from "@park/components";
import { queryAlertTicker } from "@park/mock";
import { parkMasterIds } from "@park/shared";
import type { Cockpit } from "@/data/parks";

const props = defineProps<{ park: Cockpit; second: number }>();

const items = computed<TickerItem[]>(() => {
  const park = props.park;
  const people = park.peopleToday + (props.second % 5);
  const power = park.powerNow + (props.second % 4) * 3;
  const metrics: TickerItem[] = [
    { id: "name", label: park.name, value: park.city, level: "指标" },
    { id: "companies", label: "在园企业", value: park.companies, unit: "家", level: "指标" },
    { id: "people", label: "今日通行", value: people.toLocaleString("zh-CN"), unit: "人次", level: "指标" },
    { id: "vehicles", label: "在园车辆", value: park.vehiclesToday, unit: "辆", level: "指标" },
    { id: "power", label: "实时负荷", value: power.toLocaleString("zh-CN"), unit: "kW", level: "指标" },
    { id: "water", label: "今日用水", value: park.waterToday, unit: "t", level: "指标" },
    { id: "orders", label: "未闭环工单", value: park.openOrders, unit: "单", level: "指标" },
    { id: "overtime", label: "超时工单", value: park.overtimeOrders, unit: "单", level: "预警" },
    { id: "alerts", label: "未确认告警", value: park.alertsOpen, unit: "条", level: "告警" },
    { id: "receivable", label: "本月应收", value: park.receivable, level: "指标" },
    { id: "collected", label: "本月已收", value: park.collected, level: "指标" },
    { id: "overdue", label: "逾期账单", value: park.overdueBills, unit: "笔", level: "预警" },
    { id: "occupancy", label: "出租率", value: park.occupancy, unit: "%", level: "指标" },
    { id: "duty", label: "值班", value: `${park.dutyName} ${park.dutyPhone}`, level: "指标" },
    { id: "hotline", label: "服务热线", value: park.hotline, level: "提示" },
  ];
  const alerts = queryAlertTicker({ parkId: parkMasterIds[park.key] }).map((item) => ({
    id: item.id,
    label: item.title,
    value: item.location,
    time: item.time,
    level: item.level,
  }));
  return [...metrics, ...alerts];
});
</script>

<template>
  <ParkKpiTicker class="campus-ticker" :items="items" label="园区指标滚动条" :duration="36" />
</template>

<style scoped>
.campus-ticker {
  margin-top: 12px;
}
</style>
