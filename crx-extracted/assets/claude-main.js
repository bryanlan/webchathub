(() => {
  const isEmbedded = () => {
    try {
      if (window.top === window.self) return false;
      const ao = window.location.ancestorOrigins;
      if (!ao || !ao.length) return false;
      return String(ao[0]).startsWith("chrome-extension://");
    } catch {
      return false;
    }
  };

  if (!isEmbedded()) return;
  if (window.__SCH_CLAUDE_MAIN_PATCHED) return;
  window.__SCH_CLAUDE_MAIN_PATCHED = true;

  const safeDefine = (obj, prop, getter) => {
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, prop);
      if (desc && desc.configurable === false) return false;
      Object.defineProperty(obj, prop, { configurable: true, get: getter });
      return true;
    } catch {
      return false;
    }
  };

  safeDefine(window, "top", () => window);
  safeDefine(window, "parent", () => window);
  safeDefine(window, "frameElement", () => null);

  const origMatchMedia = window.matchMedia;
  if (typeof origMatchMedia === "function") {
    window.matchMedia = (query) => {
      const real = origMatchMedia.call(window, query);
      try {
        if (/max-width\s*:\s*\d+px/i.test(query)) {
          return new Proxy(real, {
            get(target, prop) {
              if (prop === "matches") return false;
              const value = target[prop];
              return typeof value === "function" ? value.bind(target) : value;
            },
          });
        }
      } catch {
        return real;
      }
      return real;
    };
  }
})();
