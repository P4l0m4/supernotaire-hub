export const fmtEur = (x: unknown) => {
  const n = toNum(x);
  return n == null
    ? "-"
    : squashTofu(
        n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
      );
};

export const fmtPct = (x: unknown) => {
  const n = toNum(x);
  return n == null ? "-" : squashTofu((n * 100).toFixed(2) + " %");
};

export const formatChecklistValue = (v: unknown): string => {
  if (v === true) return "Oui";
  if (v === false) return "Non";
  if (Array.isArray(v)) return v.map((x) => formatChecklistValue(x)).join(", ");
  if (v && typeof v === "object") {
    const anyVal = v as Record<string, unknown>;
    if (typeof anyVal.label === "string") return anyVal.label;
    if (typeof anyVal.value === "string") return anyVal.value;
    return "-";
  }
  return v == null || v === "" ? "-" : String(v);
};

export const toNum = (x: unknown): number | undefined => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x)))
    return Number(x);
  return undefined;
};

export const squashTofu = (s: unknown) =>
  typeof s === "string" ? s.replace(/\u202F|\u00A0/g, " ") : s;
