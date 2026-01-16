import { describe, expect, it } from "vitest";
import { formatChecklistValue } from "@/utils/docDefinitions/formatters";

describe("formatChecklistValue", () => {
  it("formats booleans and empty values", () => {
    expect(formatChecklistValue(true)).toBe("Oui");
    expect(formatChecklistValue(false)).toBe("Non");
    expect(formatChecklistValue(null)).toBe("-");
    expect(formatChecklistValue(" ".trim())).toBe("-");
  });

  it("returns stringified primitives", () => {
    expect(formatChecklistValue("Texte")).toBe("Texte");
    expect(formatChecklistValue(123)).toBe("123");
  });

  it("handles arrays recursively", () => {
    expect(
      formatChecklistValue([true, "ok", { label: "Label" }, { value: "Value" }])
    ).toBe("Oui, ok, Label, Value");
  });

  it("handles objects with label or value", () => {
    expect(formatChecklistValue({ label: "Label" })).toBe("Label");
    expect(formatChecklistValue({ value: "Value" })).toBe("Value");
    expect(formatChecklistValue({ other: "x" })).toBe("-");
  });
});
