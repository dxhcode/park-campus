import { shanghaiNow } from "@park/shared";
import { defineStore } from "pinia";
import { createBillSeed, isBill, remainOf, type Bill, type BillDraft, type PayMethod } from "@/data/bills";
import { loadList, nextCode, round2, saveList, uid } from "@/utils/storage";

const STORAGE_KEY = "park-campus-bills-v1";

export const useBillStore = defineStore("bills", {
  state: () => ({
    items: loadList(STORAGE_KEY, createBillSeed(), isBill),
  }),
  getters: {
    byId: (state) => (id: string) => state.items.find((item) => item.id === id),
  },
  actions: {
    persist() {
      saveList(STORAGE_KEY, this.items);
    },
    reset() {
      this.items = createBillSeed();
      this.persist();
    },
    create(draft: BillDraft) {
      const now = shanghaiNow();
      const item: Bill = {
        id: uid("bill"),
        code: nextCode("JF-202610", this.items.map((row) => row.code)),
        company: draft.company,
        building: draft.building,
        room: draft.room.trim(),
        type: draft.type,
        period: draft.period,
        amount: round2(draft.amount ?? 0),
        dueDate: draft.dueDate,
        contact: draft.contact.trim(),
        phone: draft.phone.trim(),
        remark: draft.remark.trim(),
        createdAt: now,
        payments: [],
      };
      this.items = [item, ...this.items];
      this.persist();
      return item;
    },
    pay(id: string, input: { amount: number; method: PayMethod; payer: string; remark: string }, operator: string) {
      const current = this.byId(id);
      if (!current) return null;
      const amount = round2(input.amount);
      const remain = remainOf(current);
      if (amount <= 0 || amount - remain > 0.001) return null;
      const now = shanghaiNow();
      const next: Bill = {
        ...current,
        payments: [
          ...current.payments,
          {
            id: uid("pay"),
            amount,
            method: input.method,
            payer: input.payer.trim() || current.company,
            paidAt: now,
            operator,
            remark: input.remark.trim(),
          },
        ],
      };
      this.items = this.items.map((item) => (item.id === id ? next : item));
      this.persist();
      return next;
    },
  },
});
