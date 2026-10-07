import { shanghaiNow } from "@park/shared";
import { defineStore } from "pinia";
import {
  createWorkorderSeed,
  isWorkorder,
  type Workorder,
  type WorkorderDraft,
  type WorkorderStatus,
} from "@/data/workorders";
import { loadList, nextCode, saveList, uid } from "@/utils/storage";

const STORAGE_KEY = "park-campus-workorders-v1";

function noteFor(action: string, extra?: string) {
  return extra?.trim() ? extra.trim() : action;
}

export const useWorkorderStore = defineStore("workorders", {
  state: () => ({
    items: loadList(STORAGE_KEY, createWorkorderSeed(), isWorkorder),
  }),
  getters: {
    byId: (state) => (id: string) => state.items.find((item) => item.id === id),
  },
  actions: {
    persist() {
      saveList(STORAGE_KEY, this.items);
    },
    reset() {
      this.items = createWorkorderSeed();
      this.persist();
    },
    create(draft: WorkorderDraft, actor: string) {
      const now = shanghaiNow();
      const assignee = (draft.assignee ?? "").trim();
      const status: WorkorderStatus = assignee ? "处理中" : "待受理";
      const item: Workorder = {
        id: uid("wo"),
        code: nextCode("BX-202610", this.items.map((row) => row.code)),
        ...draft,
        assignee,
        status,
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            id: uid("ev"),
            time: now,
            actor,
            action: "提交报修",
            note: draft.description.trim() || "新建工单",
          },
        ],
      };
      if (assignee) {
        item.timeline.push({
          id: uid("ev"),
          time: now,
          actor,
          action: "受理并派单",
          note: `创建时指定处理人 ${assignee}`,
        });
      }
      this.items = [item, ...this.items];
      this.persist();
      return item;
    },
    update(id: string, draft: WorkorderDraft, actor: string) {
      const current = this.byId(id);
      if (!current) return null;
      const now = shanghaiNow();
      const next: Workorder = {
        ...current,
        ...draft,
        assignee: (draft.assignee ?? "").trim(),
        updatedAt: now,
        timeline: [
          ...current.timeline,
          {
            id: uid("ev"),
            time: now,
            actor,
            action: "更新内容",
            note: "修改了工单资料",
          },
        ],
      };
      this.items = this.items.map((item) => (item.id === id ? next : item));
      this.persist();
      return next;
    },
    transition(id: string, status: WorkorderStatus, actor: string, action: string, note: string, assignee?: string) {
      const current = this.byId(id);
      if (!current) return null;
      const now = shanghaiNow();
      const next: Workorder = {
        ...current,
        status,
        assignee: assignee ?? current.assignee,
        updatedAt: now,
        timeline: [
          ...current.timeline,
          { id: uid("ev"), time: now, actor, action, note: noteFor(action, note) },
        ],
      };
      this.items = this.items.map((item) => (item.id === id ? next : item));
      this.persist();
      return next;
    },
  },
});

