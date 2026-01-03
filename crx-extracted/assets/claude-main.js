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
  safeDefine(window, "self", () => window.top || window);
  safeDefine(window, "window", () => window.top || window);
  safeDefine(Object.getPrototypeOf(window), "self", () => window.top || window);

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

  const MIN_WIDTH = 1200;
  const clampWidth = (width) => Math.max(width || 0, MIN_WIDTH);
  const getDesc = (obj, prop) => {
    let cur = obj;
    while (cur) {
      const desc = Object.getOwnPropertyDescriptor(cur, prop);
      if (desc) return desc;
      cur = Object.getPrototypeOf(cur);
    }
    return null;
  };
  const innerWidthDesc = getDesc(window, "innerWidth");
  const innerWidthGetter =
    innerWidthDesc && typeof innerWidthDesc.get === "function"
      ? innerWidthDesc.get.bind(window)
      : null;
  const readInnerWidth = () => {
    try {
      return innerWidthGetter ? innerWidthGetter() : window.innerWidth;
    } catch {
      return window.innerWidth;
    }
  };
  safeDefine(window, "innerWidth", () => clampWidth(readInnerWidth()));
  const outerWidthDesc = getDesc(window, "outerWidth");
  const outerWidthGetter =
    outerWidthDesc && typeof outerWidthDesc.get === "function"
      ? outerWidthDesc.get.bind(window)
      : null;
  const readOuterWidth = () => {
    try {
      return outerWidthGetter ? outerWidthGetter() : window.outerWidth;
    } catch {
      return window.outerWidth;
    }
  };
  safeDefine(window, "outerWidth", () => clampWidth(readOuterWidth()));

  const makeRect = (rect, width, height) => {
    const Rect = window.DOMRectReadOnly || window.DOMRect;
    if (Rect) return new Rect(rect.x, rect.y, width, height);
    return {
      x: rect.x,
      y: rect.y,
      width,
      height,
      top: rect.top,
      left: rect.left,
      right: rect.left + width,
      bottom: rect.top + height,
    };
  };
  const origGetRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    const rect = origGetRect.call(this);
    if (this === document.documentElement || this === document.body) {
      const width = clampWidth(rect.width);
      if (width !== rect.width) return makeRect(rect, width, rect.height);
    }
    return rect;
  };

  const OrigResizeObserver = window.ResizeObserver;
  if (OrigResizeObserver) {
    window.ResizeObserver = class extends OrigResizeObserver {
      constructor(callback) {
        const wrapped = (entries, observer) => {
          const patched = entries.map((entry) => {
            try {
              const target = entry.target;
              if (
                target === document.documentElement ||
                target === document.body
              ) {
                const rect = entry.contentRect;
                const width = clampWidth(rect.width);
                if (width !== rect.width) {
                  return Object.assign({}, entry, {
                    contentRect: makeRect(rect, width, rect.height),
                  });
                }
              }
            } catch {}
            return entry;
          });
          return callback(patched, observer);
        };
        super(wrapped);
      }
    };
  }

  try {
    window.dispatchEvent(new Event("resize"));
  } catch {}
})();
