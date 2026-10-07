<script setup lang="ts">
import { GlassCard } from "@park/components";

defineProps<{ title?: string; extra?: string }>();
</script>

<template>
  <GlassCard class="campus-panel" :title="title">
    <template v-if="extra" #extra>
      <em>{{ extra }}</em>
    </template>
    <slot />
  </GlassCard>
</template>

<style scoped>
.campus-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.campus-panel :deep(.park-glass__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.campus-panel :deep(.park-glass__body > *) {
  flex: 1;
  min-height: 0;
}

.campus-panel :deep(.park-glass__extra) {
  font-style: normal;
}
</style>
