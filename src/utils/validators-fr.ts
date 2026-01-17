import {
  helpers,
  required,
  requiredIf,
  minLength,
  maxLength,
  minValue,
  maxValue,
  numeric,
  email,
} from "@vuelidate/validators";

// simple helpers
const isFiniteNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

const hasLngLat = (v: any) => {
  const coords = v?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return false;
  const [lng, lat] = coords;
  return (
    isFiniteNumber(lng) &&
    isFiniteNumber(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
};

const hasLabel = (v: any) =>
  !!v &&
  typeof v === "object" &&
  v.properties &&
  typeof v.properties.label === "string" &&
  v.properties.label.trim().length > 0;

export const fr = {
  required: helpers.withMessage("Champ obligatoire", required),
  requiredIf: (condition: () => boolean) =>
    helpers.withMessage("Champ obligatoire", requiredIf(condition)),
  minLength: (n: number) =>
    helpers.withMessage(
      `Au moins ${n} caractere${n > 1 ? "s" : ""}`,
      minLength(n)
    ),
  maxLength: (n: number) =>
    helpers.withMessage(
      `Au plus ${n} caractere${n > 1 ? "s" : ""}`,
      maxLength(n)
    ),
  numeric: helpers.withMessage("Doit etre un nombre", numeric),
  minValue: (n: number) => helpers.withMessage(`Doit etre >= ${n}`, minValue(n)),
  maxValue: (n: number) => helpers.withMessage(`Doit etre <= ${n}`, maxValue(n)),
  email: helpers.withMessage("Email invalide", email),

  fileType: (accept: readonly string[]) =>
    helpers.withMessage("Type de fichier non autorise", (v: unknown) => {
      if (v == null || v === "") return true;
      const files = Array.isArray(v) ? v : [v];
      return files.every((f) => {
        if (!(f instanceof File)) return false;
        if (!accept?.length) return true;
        return accept.includes(f.type) || accept.some((a) => f.name.endsWith(a));
      });
    }),
  fileMaxSize: (maxBytes: number) =>
    helpers.withMessage("Fichier trop volumineux", (v: unknown) => {
      if (v == null || v === "") return true;
      const files = Array.isArray(v) ? v : [v];
      return files.every((f) => f instanceof File && f.size <= maxBytes);
    }),

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
    "Format d'annee invalide (AAAA)",
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
  isAddress: (withCoords = false) =>
    helpers.withMessage(
      withCoords ? "Adresse invalide ou coordonnees manquantes" : "Adresse invalide",
      (v: unknown) => {
        if (v == null || v === "") return true;
        if (!hasLabel(v)) return false;
        return withCoords ? hasLngLat(v) : true;
      }
    ),

  oneOf: (opts: readonly string[]) =>
    helpers.withMessage(
      "Valeur non autorisee",
      (v: unknown) =>
        v == null ||
        (typeof v === "string" && v.trim() === "") ||
        opts.includes(String(v))
    ),
};
