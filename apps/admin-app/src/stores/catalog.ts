import { shanghaiNow } from "@park/shared";
import { defineStore } from "pinia";
import { isCatalogRecord, materialize, normalize } from "@/catalog/present";
import { resourceByKey, resources } from "@/catalog/resources";
import type { CatalogRecord } from "@/catalog/types";
import { loadList, nextCode, saveList, uid } from "@/utils/storage";

function loadAll() {
  const bags: Record<string, CatalogRecord[]> = {};
  for (const def of resources) {
    bags[def.key] = loadList(def.storageKey, materialize(def), isCatalogRecord(def), true);
  }
  return bags;
}

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    bags: loadAll(),
  }),
  actions: {
    persist(key: string) {
      const def = resourceByKey(key);
      if (!def) return;
      saveList(def.storageKey, this.bags[key] ?? []);
    },
    reset(key: string) {
      const def = resourceByKey(key);
      if (!def) return;
      this.bags[key] = materialize(def);
      this.persist(key);
    },
    byId(key: string, id: string) {
      return this.bags[key]?.find((item) => item.id === id);
    },
    create(key: string, fields: Record<string, string>, actor: string) {
      const def = resourceByKey(key);
      if (!def) return null;
      const now = shanghaiNow();
      const items = this.bags[key] ?? [];
      const item: CatalogRecord = {
        id: uid(def.key),
        code: nextCode(def.codePrefix, items.map((row) => row.code)),
        createdAt: now,
        updatedAt: now,
        updatedBy: actor,
        fields: normalize(def, fields),
      };
      this.bags[key] = [item, ...items];
      this.persist(key);
      return item;
    },
    update(key: string, id: string, fields: Record<string, string>, actor: string) {
      const def = resourceByKey(key);
      const current = this.byId(key, id);
      if (!def || !current) return null;
      const next: CatalogRecord = {
        ...current,
        updatedAt: shanghaiNow(),
        updatedBy: actor,
        fields: normalize(def, fields),
      };
      this.bags[key] = (this.bags[key] ?? []).map((item) => (item.id === id ? next : item));
      this.persist(key);
      return next;
    },
    remove(key: string, id: string) {
      this.bags[key] = (this.bags[key] ?? []).filter((item) => item.id !== id);
      this.persist(key);
    },
  },
});
