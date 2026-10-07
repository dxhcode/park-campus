export type FieldKind = "text" | "textarea" | "select" | "date" | "number" | "money";

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  span?: 8 | 12 | 16 | 24;
  list?: boolean;
  width?: number;
  search?: boolean;
  filter?: boolean;
  tag?: boolean;
  suffix?: string;
}

export interface StatDef {
  label: string;
  tone?: "orange" | "blue" | "purple" | "red" | "green";
  field?: string;
  equals?: string;
}

export interface SeedRow {
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
}

export interface CatalogRecord {
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  fields: Record<string, string>;
}

export interface ResourceDef {
  key: string;
  title: string;
  noun: string;
  group: string;
  path: string;
  description: string;
  codePrefix: string;
  storageKey: string;
  nameField: string;
  createLabel: string;
  stats: StatDef[];
  fields: FieldDef[];
  seed: SeedRow[];
}
