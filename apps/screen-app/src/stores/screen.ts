import { defineStore } from "pinia";
import { site } from "@park/shared";

export const useScreenStore = defineStore("screen", {
  state: () => ({
    now: new Date(),
    campusName: site.campusName,
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
  },
});
