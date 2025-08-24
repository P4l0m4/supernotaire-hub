type MergeOpts = {
  uniqueBy?: (x: any) => string; // clé de déduplication des tableaux
  restrictToKeysOfA?: boolean; // empêche l’ajout de nouvelles clés
};

const isPlainObject = (o: any) =>
  typeof o === "object" && o !== null && !Array.isArray(o);

export function mergeGeneric<T>(a: T, b: T, opts: MergeOpts = {}): T {
  if (a == null) return b as T;
  if (b == null) return a as T;

  const uniq = opts.uniqueBy ?? ((x) => JSON.stringify(x));

  // Arrays → concat + dédup
  if (Array.isArray(a) && Array.isArray(b)) {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const item of [...a, ...b]) {
      const key = uniq(item);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(item);
      }
    }
    return out as unknown as T;
  }

  // Objects → merge champ par champ
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = opts.restrictToKeysOfA
      ? Object.keys(a as any)
      : Array.from(
          new Set([...Object.keys(a as any), ...Object.keys(b as any)])
        );

    const res: any = {};
    for (const k of keys) {
      const va = (a as any)[k];
      const vb = (b as any)[k];

      if (va == null) {
        res[k] = vb ?? null;
        continue;
      }
      if (vb == null) {
        res[k] = va;
        continue;
      }

      // récursif si types compatibles, sinon priorité à a
      if (
        (Array.isArray(va) && Array.isArray(vb)) ||
        (isPlainObject(va) && isPlainObject(vb))
      ) {
        res[k] = mergeGeneric(va, vb, opts);
      } else {
        res[k] = va ?? vb;
      }
    }
    return res;
  }

  // Primitifs ou types différents → priorité à a (si défini)
  return (a ?? b) as T;
}
