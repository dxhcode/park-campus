export const parks = [
  { key: "binjiang", name: "滨江云栖科创园", short: "云栖", city: "杭州滨江" },
  { key: "lingang", name: "临港智造产业园", short: "临港", city: "上海临港" },
  { key: "guanggu", name: "光谷生命科学园", short: "光谷", city: "武汉光谷" },
] as const;

export type ParkKey = (typeof parks)[number]["key"];

export const PARK_STORAGE_KEY = "park-campus-park";

const adminRoots = [
  "/dashboard",
  "/workorders",
  "/billing",
  "/energy",
  "/security",
  "/visitors",
  "/notices",
  "/enterprise/companies",
  "/enterprise/contracts",
];

export const sceneAdminFallback: Record<string, string> = {
  overview: "/dashboard",
  property: "/workorders",
  workorders: "/workorders",
  energy: "/energy",
  access: "/visitors",
  alerts: "/security",
};

function storage(): Storage | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

export function isParkKey(value: string): value is ParkKey {
  return parks.some((item) => item.key === value);
}

export function parkByKey(key: string): (typeof parks)[number] {
  return parks.find((item) => item.key === key) ?? parks[1];
}

export function readPark(): ParkKey {
  const raw = storage()?.getItem(PARK_STORAGE_KEY) ?? "";
  return isParkKey(raw) ? raw : "lingang";
}

export function writePark(key: ParkKey) {
  storage()?.setItem(PARK_STORAGE_KEY, key);
}

function localPeer(kind: "admin" | "screen"): string | null {
  if (typeof window === "undefined") return null;
  const { hostname, protocol, port } = window.location;
  if (hostname !== "localhost" && hostname !== "127.0.0.1") return null;
  const preview = port === "4173" || port === "4174";
  const target = kind === "admin" ? (preview ? "4173" : "5173") : preview ? "4174" : "5174";
  return `${protocol}//${hostname}:${target}`;
}

function join(base: string, path: string, query?: Record<string, string | undefined>): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  const search = params.toString();
  return `${base}${normalized}${search ? `?${search}` : ""}`;
}

export function screenHref(path: string, query?: Record<string, string | undefined>): string {
  const base = localPeer("screen") ?? "/park-campus/screen";
  return join(base, path, { park: readPark(), ...query });
}

export function adminHref(path: string, query?: Record<string, string | undefined>): string {
  const base = localPeer("admin") ?? "/park-campus/admin";
  return join(base, path, query);
}

export function safeAdminPath(from: unknown, fallback: string): string {
  const raw = Array.isArray(from) ? from[0] : from;
  if (typeof raw !== "string") return fallback;
  const path = raw.split("?")[0]?.split("#")[0] ?? "";
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || path.includes("://")) return fallback;
  const allowed = adminRoots.some((root) => path === root || path.startsWith(`${root}/`));
  return allowed ? path : fallback;
}

export function adminFromLabel(from: unknown): string {
  const path = safeAdminPath(from, "");
  if (!path) return "";
  if (path.startsWith("/workorders")) return "报修工单";
  if (path.startsWith("/billing")) return "物业缴费";
  if (path.startsWith("/energy")) return "能源监测";
  if (path.startsWith("/security")) return "安防监控";
  if (path.startsWith("/visitors")) return "访客通行";
  if (path.startsWith("/notices")) return "通知公告";
  if (path.startsWith("/enterprise")) return "企业合同";
  if (path.startsWith("/dashboard")) return "工作台";
  return "管理端";
}
