import {
  helpers,
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  numeric,
  email,
} from "@vuelidate/validators";

export const fr = {
  required: helpers.withMessage("Champ obligatoire", required),
  minLength: (n: number) =>
    helpers.withMessage(
      `Au moins ${n} caractère${n > 1 ? "s" : ""}`,
      minLength(n)
    ),
  maxLength: (n: number) =>
    helpers.withMessage(
      `Au plus ${n} caractère${n > 1 ? "s" : ""}`,
      maxLength(n)
    ),
  numeric: helpers.withMessage("Doit être un nombre", numeric),
  minValue: (n: number) => helpers.withMessage(`Doit être ≥ ${n}`, minValue(n)),
  maxValue: (n: number) => helpers.withMessage(`Doit être ≤ ${n}`, maxValue(n)),
  email: helpers.withMessage("Email invalide", email),

  isDate: helpers.withMessage(
    "Format de date invalide (JJ-MM-AAAA)",
    (v: unknown) => {
      if (v == null || v === "") return true;
      if (typeof v !== "string") return false;
      const m = v.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (!m) return false;
      const d = Number(m[1]),
        mo = Number(m[2]),
        y = Number(m[3]);
      const dt = new Date(y, mo - 1, d);
      return (
        dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d
      );
    }
  ),
  isYear: helpers.withMessage(
    "Format d'année invalide (AAAA)",
    (v: unknown) => {
      if (v == null || v === "") return true;
      if (typeof v !== "string") return false;
      const m = v.match(/^(\d{4})$/);
      if (!m) return false;
      const y = Number(m[1]);
      const dt = new Date(y, 0, 1);
      return dt.getFullYear() === y;
    }
  ),
  isMonth: helpers.withMessage("Format de mois invalide (MM)", (v: unknown) => {
    if (v == null || v === "") return true;
    if (typeof v !== "string") return false;
    const m = v.match(/^(\d{2})$/);
    if (!m) return false;
    const month = Number(m[1]);
    return month >= 1 && month <= 12;
  }),

  oneOf: (opts: readonly string[]) =>
    helpers.withMessage(
      "Valeur non autorisée",
      (v: unknown) =>
        v == null ||
        (typeof v === "string" && v.trim() === "") ||
        opts.includes(String(v))
    ),
};
