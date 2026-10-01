import { shanghaiNow } from "./time";

export const SESSION_KEY = "park-campus-session";

export interface DemoAccount {
  username: string;
  password: string;
  displayName: string;
  roleName: string;
  org: string;
  hint: string;
}

export interface SessionUser {
  username: string;
  displayName: string;
  roleName: string;
  org: string;
  avatarText: string;
  loginAt: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    username: "admin",
    password: "park2026",
    displayName: "林知夏",
    roleName: "园区管理员",
    org: "临港智慧园区运营中心",
    hint: "总览菜单、工单与账单",
  },
  {
    username: "wuye",
    password: "park2026",
    displayName: "周启明",
    roleName: "物业主管",
    org: "物业服务中心",
    hint: "适合走报修受理与派单",
  },
  {
    username: "caiwu",
    password: "park2026",
    displayName: "陈予安",
    roleName: "收费专员",
    org: "财务结算组",
    hint: "适合开账单与登记收款",
  },
];

function storage(): Storage | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SessionUser>;
  return typeof item.username === "string" && typeof item.displayName === "string" && item.username.length > 0;
}

export function readSession(): SessionUser | null {
  const box = storage();
  if (!box) return null;
  try {
    const raw = box.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isSessionUser(parsed)) return null;
    return {
      username: parsed.username,
      displayName: parsed.displayName,
      roleName: parsed.roleName || "演示用户",
      org: parsed.org || "临港智慧园区",
      avatarText: parsed.avatarText || parsed.displayName.slice(0, 1),
      loginAt: parsed.loginAt || "",
    };
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser) {
  storage()?.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  storage()?.removeItem(SESSION_KEY);
}

export type LoginResult = { ok: true; user: SessionUser } | { ok: false; message: string };

export function loginWithDemo(username: string, _password: string): LoginResult {
  const name = username.trim();
  if (!name) return { ok: false, message: "请输入账号" };
  const account = demoAccounts.find((item) => item.username === name);
  const user: SessionUser = account
    ? {
        username: account.username,
        displayName: account.displayName,
        roleName: account.roleName,
        org: account.org,
        avatarText: account.displayName.slice(0, 1),
        loginAt: shanghaiNow(),
      }
    : {
        username: name,
        displayName: name,
        roleName: "临时访客",
        org: "演示会话",
        avatarText: name.slice(0, 1),
        loginAt: shanghaiNow(),
      };
  writeSession(user);
  return { ok: true, user };
}
