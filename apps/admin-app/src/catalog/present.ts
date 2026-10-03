import { formatYuan } from "@/utils/storage";
import type { CatalogRecord, FieldDef, ResourceDef, SeedRow } from "./types";

const tagColors: Record<string, string> = {
  在营: "green",
  启用: "green",
  在园: "green",
  已通过: "green",
  已发布: "green",
  正常: "green",
  在线: "green",
  履行中: "green",
  显示: "green",
  空置: "blue",
  已到访: "cyan",
  自用: "cyan",
  已出租: "purple",
  草稿: "default",
  已终止: "default",
  已下线: "default",
  已离开: "default",
  隐藏: "default",
  否: "default",
  待审核: "orange",
  即将到期: "orange",
  即将入驻: "orange",
  装修中: "orange",
  装修: "orange",
  退租办理: "orange",
  筹开: "gold",
  是: "gold",
  重点: "gold",
  普通: "blue",
  异常: "red",
  告警: "red",
  离线: "red",
  已拒绝: "red",
  停用: "red",
};

export function tagColor(value: string) {
  return tagColors[value] ?? "blue";
}

export function normalize(def: ResourceDef, fields: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of def.fields) {
    out[field.key] = String(fields[field.key] ?? "").trim();
  }
  return out;
}

export function emptyFields(def: ResourceDef): Record<string, string> {
  const seeded: Record<string, string> = {};
  for (const field of def.fields) {
    if (field.kind === "select" && field.options?.length) seeded[field.key] = field.options[0];
  }
  return normalize(def, seeded);
}

export function materialize(def: ResourceDef): CatalogRecord[] {
  return def.seed.map((row, index) => ({
    id: `${def.key}-${String(index + 1).padStart(2, "0")}`,
    code: `${def.codePrefix}-${String(index + 1).padStart(4, "0")}`,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    updatedBy: "示例数据",
    fields: normalize(def, row.fields),
  }));
}

export function isCatalogRecord(def: ResourceDef) {
  const keys = def.fields.map((field) => field.key);
  return (value: unknown): value is CatalogRecord => {
    if (!value || typeof value !== "object") return false;
    const row = value as Partial<CatalogRecord>;
    if (typeof row.id !== "string" || typeof row.code !== "string") return false;
    if (typeof row.createdAt !== "string" || typeof row.updatedAt !== "string") return false;
    if (typeof row.updatedBy !== "string") return false;
    if (!row.fields || typeof row.fields !== "object") return false;
    const fields = row.fields as Record<string, unknown>;
    return keys.every((key) => typeof fields[key] === "string");
  };
}

export function showValue(field: FieldDef, raw: string) {
  const value = raw.trim();
  if (!value) return "—";
  if (field.kind === "money") {
    const num = Number(value);
    return Number.isFinite(num) ? `¥ ${formatYuan(num)}` : value;
  }
  if (field.kind === "number") {
    const num = Number(value);
    const shown = Number.isFinite(num) ? num.toLocaleString("zh-CN") : value;
    return field.suffix ? `${shown} ${field.suffix}` : shown;
  }
  return value;
}

export function rows(keys: string[], lines: string[][]): SeedRow[] {
  return lines.map((line, index) => {
    if (line.length !== keys.length) {
      throw new Error(`示例数据列数不一致：第 ${index + 1} 行期望 ${keys.length} 列，实际 ${line.length} 列`);
    }
    const day = String((index % 27) + 1).padStart(2, "0");
    const hour = String(8 + (index % 10)).padStart(2, "0");
    const minute = String((index * 7) % 60).padStart(2, "0");
    return {
      createdAt: `2026-09-${day} ${hour}:${minute}`,
      updatedAt: `2026-10-0${1 + (index % 2)} ${String(9 + (index % 8)).padStart(2, "0")}:20`,
      fields: Object.fromEntries(keys.map((key, i) => [key, line[i]])),
    };
  });
}
