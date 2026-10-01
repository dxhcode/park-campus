export const site = {
  name: "园区运营平台",
  consoleName: "管理控制台",
  screenName: "态势大屏",
  campusName: "临港智慧园区",
  badge: "ULSP",
  tagline: "空间、企业、物业与安防的统一运营入口",
} as const;

export type Site = typeof site;

export { demoAccounts, loginWithDemo, readSession, writeSession, clearSession, SESSION_KEY } from "./auth";
export type { DemoAccount, SessionUser, LoginResult } from "./auth";
export { shanghaiNow, shanghaiToday } from "./time";
