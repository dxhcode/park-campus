import { defineStore } from "pinia";
import { site } from "@park/shared";

export const useAppStore = defineStore("app", {
  state: () => ({
    collapsed: false,
    campusName: site.campusName,
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
});
