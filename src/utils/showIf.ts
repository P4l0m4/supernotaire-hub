import type { ShowIf } from "@/types/forms";

function getByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path
    .split(".")
    .reduce((o: any, k: string) => (o == null ? o : o[k]), obj);
}

export function evaluateShowIf(
  rule: ShowIf | undefined,
  context: any
): boolean {
  if (!rule) return true; // no rule => visible

  if ("not" in rule) return !evaluateShowIf(rule.not, context);
  if ("all" in rule) return rule.all.every((r) => evaluateShowIf(r, context));
  if ("any" in rule) return rule.any.some((r) => evaluateShowIf(r, context));
  if ("or" in rule) return rule.or.some((r) => evaluateShowIf(r, context));

  // leaf rule
  const value = getByPath(context, rule.path);

  const parseDateOrYear = (v: any): number | null => {
    if (v == null) return null;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const trimmed = v.trim();
      // Try ISO or Date.parse
      const parsed = Date.parse(trimmed);
      if (!Number.isNaN(parsed)) {
        const d = new Date(parsed);
        if (Number.isFinite(d.getTime())) return d.getTime();
      }
      // Try dd-mm-yyyy or dd/mm/yyyy
      const m = trimmed.match(/^(\d{1,2})[-\/]?(\d{1,2})[-\/]?(\d{4})$/);
      if (m) {
        const [_, dd, mm, yyyy] = m;
        const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        if (Number.isFinite(d.getTime())) return d.getTime();
      }
      // fallback: year only
      const yearOnly = trimmed.match(/(\d{4})/);
      if (yearOnly?.[1]) return Number(yearOnly[1]);
    }
    return null;
  };


  if (Object.prototype.hasOwnProperty.call(rule, "equals")) {
    // eslint-disable-next-line eqeqeq
    return value === (rule as any).equals;
  }
  if (Array.isArray((rule as any).in)) {
    const arr = (rule as any).in as any[];
    return arr.some((v) => v === value);
  }
  if (Object.prototype.hasOwnProperty.call(rule, "contains")) {
    const target = (rule as any).contains;
    if (Array.isArray(value)) return value.includes(target);
    if (typeof value === "string") return value.includes(String(target));
    return false;
  }
  if (Object.prototype.hasOwnProperty.call(rule, "is")) {
    const cmp = (rule as any).is || {};
    const valTs = parseDateOrYear(value);
    if (cmp.before != null) {
      const beforeTs = parseDateOrYear(cmp.before);
      if (beforeTs != null && valTs != null) return valTs < beforeTs;
    }
    if (cmp.after != null) {
      const afterTs = parseDateOrYear(cmp.after);
      if (afterTs != null && valTs != null) return valTs > afterTs;
    }
    return false;
  }
  if (Object.prototype.hasOwnProperty.call(rule, "truthy")) {
    const t = Boolean((rule as any).truthy);
    return t ? Boolean(value) : !Boolean(value);
  }
  if (Object.prototype.hasOwnProperty.call(rule, "greaterThan")) {
    return Number(value) > (rule as any).greaterThan;
  }
  if (Object.prototype.hasOwnProperty.call(rule, "lessThan")) {
    return Number(value) < (rule as any).lessThan;
  }

  // default: just check truthiness
  return Boolean(value);
}
