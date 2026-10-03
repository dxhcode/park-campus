<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { init, type ECharts, type EChartsOption } from "echarts";

const props = defineProps<{ option: EChartsOption }>();
const el = ref<HTMLDivElement | null>(null);
let chart: ECharts | null = null;
let observer: ResizeObserver | null = null;

function render() {
  if (!el.value) return;
  if (!chart) chart = init(el.value, undefined, { renderer: "canvas" });
  chart.setOption(props.option, true);
}

onMounted(() => {
  render();
  observer = new ResizeObserver(() => chart?.resize());
  if (el.value) observer.observe(el.value);
});

watch(() => props.option, render, { deep: true });

onUnmounted(() => {
  observer?.disconnect();
  chart?.dispose();
  chart = null;
});
</script>

<template>
  <div ref="el" class="echart"></div>
</template>

<style scoped>
.echart {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>
