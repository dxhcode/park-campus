<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = withDefaults(defineProps<{ value: number; digits?: number }>(), { digits: 0 });
const shown = ref(0);
let frame = 0;

function run(target: number) {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    shown.value = target;
    return;
  }
  const from = shown.value;
  const start = performance.now();
  cancelAnimationFrame(frame);
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / 720);
    const eased = 1 - (1 - progress) ** 3;
    shown.value = from + (target - from) * eased;
    if (progress < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}

onMounted(() => run(props.value));
watch(() => props.value, run);
onUnmounted(() => cancelAnimationFrame(frame));

const text = computed(() =>
  shown.value.toLocaleString("zh-CN", {
    minimumFractionDigits: props.digits,
    maximumFractionDigits: props.digits,
  }),
);
</script>

<template>{{ text }}</template>
