(() => {
  window.__SCH_CLAUDE_MAIN_LOADED = true;

  const isClaudeFrame = () => {
    try {
      if (window.top === window.self) return false;
      const host = window.location.hostname || "";
      return host === "claude.ai" || host.endsWith(".claude.ai");
    } catch {
      return false;
    }
  };

  if (!isClaudeFrame()) return;
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

  // Try to reduce embed detection based on parent checks.
  safeDefine(window, "parent", () => window);
  safeDefine(window, "frameElement", () => null);

  // Force desktop-style media query outcomes.
  const origMatchMedia = window.matchMedia;
  if (typeof origMatchMedia === "function") {
    window.matchMedia = (query) => {
      const real = origMatchMedia.call(window, query);
      let forced = null;
      try {
        if (/max-(width|height)\s*:\s*\d+px/i.test(query)) forced = false;
        if (/min-(width|height)\s*:\s*\d+px/i.test(query)) forced = true;
      } catch {
        forced = null;
      }
      if (forced === null) return real;
      return new Proxy(real, {
        get(target, prop) {
          if (prop === "matches") return forced;
          const value = target[prop];
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    };
  }

  try {
    window.dispatchEvent(new Event("resize"));
  } catch {}
})();
