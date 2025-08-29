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

export const toNum = (x: unknown): number | undefined => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x)))
    return Number(x);
  return undefined;
};

export const squashTofu = (s: unknown) =>
  typeof s === "string" ? s.replace(/\u202F|\u00A0/g, " ") : s;
