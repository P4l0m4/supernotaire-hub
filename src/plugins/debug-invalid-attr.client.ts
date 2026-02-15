// Temporary guard to surface invalid attribute / element names (InvalidCharacterError) in the console.
if (process.client && !(window as any).__snPatchedInvalidNames) {
  (window as any).__snPatchedInvalidNames = true;

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

  const originalCreateElement = Document.prototype.createElement;
  Document.prototype.createElement = function patchedCreateElement(
    tagName: string,
    options?: ElementCreationOptions,
  ) {
    if (!tagName) {
      console.error("[debug-invalid-attr] createElement empty tag", {
        tagName,
        options,
        stack: new Error().stack,
      });
    }
    return originalCreateElement.call(this, tagName, options);
  };

  const originalDefine = (customElements as CustomElementRegistry).define;
  customElements.define = function patchedDefine(
    name: string,
    constructor: CustomElementConstructor,
    options?: ElementDefinitionOptions,
  ) {
    if (!name) {
      console.error("[debug-invalid-attr] customElements.define empty name", {
        name,
        constructor,
        options,
        stack: new Error().stack,
      });
    }
    return originalDefine.call(this, name, constructor, options);
  };
}
