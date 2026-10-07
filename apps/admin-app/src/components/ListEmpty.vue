<script setup lang="ts">
import { EmptyState } from "@park/components";

defineProps<{
  filtered: boolean;
  description: string;
  createLabel: string;
}>();

defineEmits<{
  clear: [];
  create: [];
}>();
</script>

<template>
  <EmptyState
    tone="admin"
    :variant="filtered ? 'search' : 'empty'"
    :title="description"
    :description="filtered ? '可以清空条件后再看，或直接新建一条。' : '新建后的内容会留在这台浏览器里。'"
    :secondary-text="filtered ? '清空筛选' : ''"
    :primary-text="createLabel"
    @secondary="$emit('clear')"
    @primary="$emit('create')"
  />
</template>
