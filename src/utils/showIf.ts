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

  if (Object.prototype.hasOwnProperty.call(rule, "equals")) {
    // eslint-disable-next-line eqeqeq
    return value === (rule as any).equals;
  }
  if (Array.isArray((rule as any).in)) {
    const arr = (rule as any).in as any[];
    return arr.some((v) => v === value);
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
