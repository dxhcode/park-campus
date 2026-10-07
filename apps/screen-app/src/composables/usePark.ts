import { computed } from "vue";
import { cockpitOf, type Cockpit } from "@/data/parks";
import { useScreenStore } from "@/stores/screen";

export function usePark() {
  const screen = useScreenStore();
  const park = computed(() => cockpitOf(screen.parkKey));
  return { screen, park };
}

export function levelTone(level: string): "bad" | "warn" | "ok" {
  if (level.includes("紧急") || level.includes("异常") || level.includes("离线") || level.includes("偏高") || level === "超时") return "bad";
  if (level.includes("重要") || level.includes("处理") || level.includes("待") || level.includes("观察") || level.includes("跟踪")) return "warn";
  return "ok";
}

export function sumOnline(park: Cockpit): { online: number; total: number } {
  return park.facilities.reduce(
    (acc, item) => ({ online: acc.online + item.online, total: acc.total + item.total }),
    { online: 0, total: 0 },
  );
}
