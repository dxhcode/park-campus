<script setup lang="ts">
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
  <div class="list-empty">
    <a-empty :description="description">
      <p>{{ filtered ? "可以清空条件后再看，或直接新建一条。" : "新建后的内容会留在这台浏览器里。" }}</p>
      <a-space wrap>
        <a-button v-if="filtered" @click="$emit('clear')">清空筛选</a-button>
        <a-button type="primary" @click="$emit('create')">{{ createLabel }}</a-button>
      </a-space>
    </a-empty>
  </div>
</template>

<style scoped>
.list-empty {
  padding: 28px 12px 12px;
}
.list-empty p {
  margin: 0 0 14px;
  color: rgba(15, 23, 42, 0.55);
}
</style>
