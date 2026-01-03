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

  const SIDEBAR_KEY_RE = /(sidebar|nav|drawer|panel)/i;
  const CLOSED_VALUE_RE = /(false|0|collapsed|closed|hidden)/i;
  const OPEN_KEY_RE = /(open|expanded|pinned)/i;
  const COLLAPSE_KEY_RE = /(collapsed|closed|hidden)/i;

  const normalizeSidebarValue = (key, value) => {
    if (!SIDEBAR_KEY_RE.test(String(key))) return value;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    if (!CLOSED_VALUE_RE.test(trimmed) && !/^\s*[\[{]/.test(trimmed)) return value;
    if (/^\s*[\[{]/.test(trimmed)) {
      try {
        const data = JSON.parse(trimmed);
        const fix = (node) => {
          if (!node || typeof node !== "object") return;
          for (const k of Object.keys(node)) {
            const v = node[k];
            if (typeof v === "boolean") {
              if (COLLAPSE_KEY_RE.test(k)) node[k] = false;
              if (OPEN_KEY_RE.test(k)) node[k] = true;
              if (SIDEBAR_KEY_RE.test(k)) node[k] = true;
            } else if (typeof v === "string") {
              if (COLLAPSE_KEY_RE.test(k) && CLOSED_VALUE_RE.test(v)) node[k] = "false";
              if (OPEN_KEY_RE.test(k) && CLOSED_VALUE_RE.test(v)) node[k] = "true";
            } else {
              fix(v);
            }
          }
        };
        fix(data);
        return JSON.stringify(data);
      } catch {
        return "true";
      }
    }
    return "true";
  };

  const wrapStorage = (storage) => {
    if (!storage || storage.__SCH_SIDEBAR_WRAPPED) return;
    storage.__SCH_SIDEBAR_WRAPPED = true;
    const origGet = storage.getItem ? storage.getItem.bind(storage) : null;
    const origSet = storage.setItem ? storage.setItem.bind(storage) : null;
    if (origGet) {
      storage.getItem = (key) => {
        const value = origGet(key);
        return normalizeSidebarValue(key, value);
      };
    }
    if (origSet) {
      storage.setItem = (key, value) => {
        const normalized = normalizeSidebarValue(key, String(value));
        return origSet(key, normalized);
      };
    }
  };

  try {
    wrapStorage(window.localStorage);
    wrapStorage(window.sessionStorage);
  } catch {}

  try {
    window.dispatchEvent(new Event("resize"));
  } catch {}
})();
