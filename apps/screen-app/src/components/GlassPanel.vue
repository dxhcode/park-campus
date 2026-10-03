<script setup lang="ts">
defineProps<{ title?: string; extra?: string }>();
</script>

<template>
  <section class="glass">
    <header v-if="title" class="glass-head">
      <h3>{{ title }}</h3>
      <em v-if="extra">{{ extra }}</em>
    </header>
    <div class="glass-body">
      <slot />
    </div>
  </section>
</template>
