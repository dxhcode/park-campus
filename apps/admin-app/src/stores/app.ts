import { defineStore } from "pinia";
import { readPark, site, writePark, type ParkKey } from "@park/shared";

export const useAppStore = defineStore("app", {
  state: () => ({
    collapsed: false,
    campusName: site.campusName,
    parkKey: readPark(),
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setPark(key: ParkKey) {
      this.parkKey = key;
      writePark(key);
    },
  },
});
