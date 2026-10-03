<script setup lang="ts">
import { computed, ref } from "vue";
import type { Cockpit } from "@/data/parks";

const props = defineProps<{ park: Cockpit }>();
const active = ref("");
const current = computed(() => props.park.map.buildings.find((item) => item.name === active.value));

function toggle(name: string) {
  active.value = active.value === name ? "" : name;
}
</script>

<template>
  <div class="map-wrap">
    <svg viewBox="0 0 800 480" role="img" :aria-label="`${park.name}示意地图`">
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#10233d" />
          <stop offset="1" stop-color="#07111f" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#67e8f9" stop-opacity="0.55" />
          <stop offset="1" stop-color="#0284c7" stop-opacity="0.15" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="800" height="480" rx="22" fill="url(#land)" />
      <g class="grid-lines" opacity="0.35">
        <path v-for="index in 7" :key="`h-${index}`" :d="`M40 ${index * 60} H760`" />
        <path v-for="index in 11" :key="`v-${index}`" :d="`M${index * 70} 24 V456`" />
      </g>

      <g v-if="park.map.motif === 'river'" filter="url(#glow)">
        <path d="M36 20 C 80 80, 40 160, 78 230 C 120 310, 48 380, 70 460" fill="none" stroke="url(#water)" stroke-width="28" />
        <path d="M150 430 H430" fill="none" stroke="rgba(245,193,108,0.45)" stroke-width="8" />
      </g>
      <g v-else-if="park.map.motif === 'plant'" filter="url(#glow)">
        <path d="M40 250 H760" stroke="rgba(148,197,255,0.35)" stroke-width="10" />
        <path d="M330 40 V450" stroke="rgba(245,193,108,0.35)" stroke-width="8" />
        <rect x="620" y="300" width="140" height="70" rx="8" fill="rgba(103,232,249,0.12)" stroke="#67e8f9" />
      </g>
      <g v-else filter="url(#glow)">
        <circle cx="400" cy="240" r="150" fill="none" stroke="rgba(52,211,153,0.35)" stroke-width="10" />
        <circle cx="400" cy="240" r="78" fill="rgba(52,211,153,0.08)" stroke="rgba(103,232,249,0.45)" />
      </g>

      <g v-for="building in park.map.buildings" :key="building.name">
        <polygon
          :points="building.points"
          :class="['bld', building.tone, { on: active === building.name }]"
          @click="toggle(building.name)"
        />
        <text :x="building.x" :y="building.y" text-anchor="middle">{{ building.name }}</text>
      </g>

      <g v-for="pin in park.map.pins" :key="pin.label">
        <circle class="pin" :cx="pin.x" :cy="pin.y" r="6" />
        <text class="pin-label" :x="pin.x + 10" :y="pin.y + 4">{{ pin.label }}</text>
      </g>
    </svg>
    <div class="map-foot">
      <span class="legend ok">运行平稳</span>
      <span class="legend busy">人流或负荷高</span>
      <span class="legend warn">需要关注</span>
      <strong>{{ park.hotline }}</strong>
    </div>
    <p v-if="current" class="map-note">{{ current.name }} · {{ current.note }}</p>
    <p v-else class="map-note">{{ park.slogan }} · 值班 {{ park.dutyName }} {{ park.dutyPhone }}</p>
  </div>
</template>

<style scoped>
.map-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
svg {
  width: 100%;
  height: auto;
  flex: 1;
  min-height: 220px;
}
.grid-lines path {
  fill: none;
  stroke: rgba(103, 232, 249, 0.16);
  stroke-width: 1;
}
text {
  fill: #f8fbff;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
}
.pin-label {
  font-size: 12px;
  font-weight: 500;
  fill: #f5c16c;
}
.pin {
  fill: #f5c16c;
  filter: drop-shadow(0 0 6px #f5c16c);
}
.bld {
  cursor: pointer;
  stroke-width: 1.5;
  transition: fill 0.2s ease, stroke 0.2s ease;
}
.bld.ok {
  fill: rgba(52, 211, 153, 0.22);
  stroke: #34d399;
}
.bld.busy {
  fill: rgba(103, 232, 249, 0.22);
  stroke: #67e8f9;
}
.bld.warn {
  fill: rgba(251, 113, 133, 0.2);
  stroke: #fb7185;
}
.bld.on {
  fill: rgba(245, 193, 108, 0.28);
  stroke: #f5c16c;
}
.map-foot,
.map-note {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
  margin: 8px 0 0;
  color: rgba(226, 232, 240, 0.78);
  font-size: 12px;
}
.map-foot strong {
  margin-left: auto;
  color: #f5c16c;
  letter-spacing: 0.04em;
}
.legend::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}
.legend.ok { color: #34d399; }
.legend.busy { color: #67e8f9; }
.legend.warn { color: #fb7185; }
</style>
