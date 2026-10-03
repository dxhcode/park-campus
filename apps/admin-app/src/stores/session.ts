import { loginWithDemo, readSession, clearSession, type SessionUser } from "@park/shared";
import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
  state: () => ({
    user: readSession() as SessionUser | null,
  }),
  getters: {
    isAuthed: (state) => Boolean(state.user),
  },
  actions: {
    login(username: string, password: string) {
      const result = loginWithDemo(username, password);
      this.user = result.ok ? result.user : this.user;
      return result;
    },
    logout() {
      clearSession();
      this.user = null;
    },
  },
});
