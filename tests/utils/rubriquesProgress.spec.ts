import { describe, expect, it, vi } from "vitest";
import {
  calculateSectionProgress,
  computeOverallProgress,
  countCompleted,
  createDebouncedRefresh,
  hasValue,
  sortCardsByCompletion,
} from "@/utils/rubriquesProgress";

type Id = "a" | "b" | "c";

const cards: { id: Id; title?: string }[] = [
  { id: "a", title: "A" },
  { id: "b", title: "B" },
  { id: "c", title: "C" },
];

describe("rubriquesProgress", () => {
  describe("hasValue", () => {
    it("renvoie false pour null/undefined/false/empty", () => {
      expect(hasValue(null)).toBe(false);
      expect(hasValue(undefined)).toBe(false);
      expect(hasValue("")).toBe(false);
      expect(hasValue("   ")).toBe(false);
      expect(hasValue(false)).toBe(false);
      expect(hasValue([])).toBe(false);
      expect(hasValue({})).toBe(false);
    });

    it("renvoie true pour nombres, booléens true, string non vide, array rempli, objets avec valeur", () => {
      expect(hasValue(0)).toBe(true);
      expect(hasValue(123)).toBe(true);
      expect(hasValue(true)).toBe(true);
      expect(hasValue("x")).toBe(true);
      expect(hasValue(["x"])).toBe(true);
      expect(hasValue({ a: "" })).toBe(false);
      expect(hasValue({ a: "x" })).toBe(true);
    });
  });

  describe("calculateSectionProgress", () => {
    it("met 100 quand __completed est true", () => {
      const progress = calculateSectionProgress(["a"], (id) => ({
        __completed: id === "a",
      }));
      expect(progress.a).toBe(100);
    });

    it("met 50 quand il y a des données utiles mais pas __completed", () => {
      const progress = calculateSectionProgress(["a"], () => ({ foo: "bar" }));
      expect(progress.a).toBe(50);
    });

    it("met 0 quand pas de valeur", () => {
      const progress = calculateSectionProgress(["a"], () => null);
      expect(progress.a).toBe(0);
    });
  });

  describe("computeOverallProgress", () => {
    it("calcule la moyenne des pourcentages", () => {
      const overall = computeOverallProgress({ a: 100, b: 50, c: 0 });
      expect(overall).toBe(50);
    });

    it("utilise le total fourni", () => {
      const overall = computeOverallProgress({ a: 100 }, 2);
      expect(overall).toBe(50);
    });
  });

  describe("countCompleted", () => {
    it("compte seulement les 100%", () => {
      const count = countCompleted({ a: 100, b: 50, c: 0 });
      expect(count).toBe(1);
    });
  });

  describe("sortCardsByCompletion", () => {
    it("place les cartes complètes à la fin", () => {
      const sorted = sortCardsByCompletion(cards, { a: 100, b: 0, c: 50 });
      expect(sorted.map((c) => c.id)).toEqual(["b", "c", "a"]);
    });

    it("garde l'ordre relatif dans les groupes", () => {
      const sorted = sortCardsByCompletion(cards, { a: 0, b: 0, c: 100 });
      expect(sorted.map((c) => c.id)).toEqual(["a", "b", "c"]);
    });
  });

  describe("createDebouncedRefresh", () => {
    it("débounce les appels", () => {
      vi.useFakeTimers();
      const spy = vi.fn();
      const debounced = createDebouncedRefresh(spy, 500);
      debounced();
      debounced();
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(499);
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(spy).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });
});
