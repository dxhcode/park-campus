export function loadList<T>(key: string, seed: T[], guard: (value: unknown) => value is T, allowEmpty = false): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(seed);
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(guard)) return structuredClone(seed);
    if (parsed.length === 0 && !allowEmpty) return structuredClone(seed);
    return parsed;
  } catch {
    return structuredClone(seed);
  }
}

export function saveList<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function nextCode(prefix: string, codes: string[]) {
  const nums = codes
    .filter((code) => code.startsWith(`${prefix}-`))
    .map((code) => Number(code.slice(prefix.length + 1)))
    .filter((num) => Number.isFinite(num));
  const next = (nums.length ? Math.max(...nums) : 1000) + 1;
  return `${prefix}-${String(next).padStart(4, "0")}`;
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function formatYuan(value: number) {
  return value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function round2(value: number) {
  return Math.round(value * 100) / 100;
}
