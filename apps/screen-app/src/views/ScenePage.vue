<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AccessScene from "@/views/scenes/AccessScene.vue";
import AlertScene from "@/views/scenes/AlertScene.vue";
import EnergyScene from "@/views/scenes/EnergyScene.vue";
import FallbackScene from "@/views/scenes/FallbackScene.vue";
import OverviewScene from "@/views/scenes/OverviewScene.vue";
import PropertyScene from "@/views/scenes/PropertyScene.vue";
import WorkorderScene from "@/views/scenes/WorkorderScene.vue";

const route = useRoute();
const views = {
  overview: OverviewScene,
  property: PropertyScene,
  workorders: WorkorderScene,
  energy: EnergyScene,
  access: AccessScene,
  alerts: AlertScene,
};

const title = computed(() => route.meta.title);
const description = computed(() => route.meta.description);
const accent = computed(() => route.meta.accent);
const view = computed(() => views[route.name as keyof typeof views] ?? FallbackScene);
</script>

<template>
  <section class="scene" :style="{ '--accent': accent }">
    <header class="scene-bar">
      <div>
        <span>SCENE</span>
        <h2>{{ title }}</h2>
      </div>
      <p>{{ description }}</p>
    </header>
    <component :is="view" />
  </section>
</template>

<style scoped>
.scene { position: relative; z-index: 1; }
.scene-bar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
}
.scene-bar span {
  color: var(--accent);
  letter-spacing: 0.28em;
  font-size: 12px;
}
h2 {
  margin: 2px 0 0;
  font-size: 28px;
  text-shadow: 0 0 18px color-mix(in srgb, var(--accent) 55%, transparent);
}
p {
  margin: 0;
  max-width: 640px;
  color: rgba(226, 232, 240, 0.74);
  line-height: 1.6;
  text-align: right;
}
@media (max-width: 800px) {
  .scene-bar { flex-direction: column; align-items: flex-start; }
  p { text-align: left; }
  h2 { font-size: 22px; }
}
</style>
