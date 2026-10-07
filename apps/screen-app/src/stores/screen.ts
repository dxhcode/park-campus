import { defineStore } from "pinia";
import { readPark, writePark, type ParkKey } from "@park/shared";

export const useScreenStore = defineStore("screen", {
  state: () => ({
    now: new Date(),
    parkKey: readPark(),
  }),
  getters: {
    clock(state): string {
      return new Intl.DateTimeFormat("zh-CN", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(state.now);
    },
  },
  actions: {
    tick() {
      this.now = new Date();
    },
    setPark(key: ParkKey) {
      this.parkKey = key;
      writePark(key);
    },
  },
});
