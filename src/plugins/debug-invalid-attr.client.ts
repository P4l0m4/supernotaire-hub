// Temporary guard to surface invalid attribute names (InvalidCharacterError) in the console.
if (process.client && !(window as any).__snPatchedSetAttribute) {
  (window as any).__snPatchedSetAttribute = true;

  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function patchedSetAttribute(
    name: string,
    value: string,
  ) {
    try {
      return originalSetAttribute.call(this, name, value);
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "InvalidCharacterError"
      ) {
        // Log enough context to pinpoint the bad attribute.
        console.error("[debug-invalid-attr] Invalid attribute name", {
          name,
          value,
          tag: (this as Element).tagName,
          href: (this as HTMLElement).getAttribute?.("href"),
          src: (this as HTMLElement).getAttribute?.("src"),
          stack: new Error().stack,
        });
      }
      throw err;
    }
  };
}
