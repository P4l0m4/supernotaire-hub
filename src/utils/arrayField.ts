export function getByPath(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

export function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

export function labelFor(idx: number, propsFieldItemLabel?: string) {
  return (propsFieldItemLabel || "Élément {{index}}").replace(
    "{{index}}",
    String(idx + 1)
  );
}

export function genId() {
  try {
    return (globalThis as any).crypto?.randomUUID?.() ?? "";
  } catch {}
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

export const setDeep = (o: any, p: string[], v: any) => {
  let c = o;
  for (let i = 0; i < p.length - 1; i++) c = c[p[i]] ??= {};
  c[p.at(-1)!] = { ...(c[p.at(-1)!] ?? {}), ...v };
};
