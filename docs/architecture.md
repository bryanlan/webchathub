# Architecture

## System Overview
`webchathub` is an artifact-driven browser-extension fork of Simple Chat Hub. The live repository does not expose a source-first TypeScript application or a rebuild command; current behavior is reviewed through checked-in extension artifacts, the manifest, compiled assets, and manual browser loading.

The editable runtime surface in this checkout is `crx-extracted/`. At present it contains `manifest.json` plus compiled files under `crx-extracted/assets/`. The packaged release surface is `Simple-Chat-Hub-2.0.0.crx.zip`, which contains the CRX file and a macOS metadata entry.

## Runtime Components
- `crx-extracted/manifest.json` is the Manifest V3 authority for extension metadata, permissions, host permissions, web-accessible resources, the options page, and the service worker path.
- `crx-extracted/assets/chunk-cdf2dc81.js` contains shared runtime dependencies plus the built-in chat app configuration, allowlist filtering, request/network guard symbols such as `__ALLOW_HOSTS`, `__filterApps`, `__isAllowedUrl`, and `__installGuard`, custom config handling, and network-disabling stubs for upstream API calls.
- `crx-extracted/assets/chunk-809f580f.js` is the main UI/runtime bundle. It imports `chunk-cdf2dc81.js` and missing checked-in chunks such as `chunk-936fa2ae.js` and `chunk-a783bd53.js`; do not treat it as the owner of the built-in config or allowlist guard symbols.
- `crx-extracted/assets/chunk-93671912.js` contains background/service-worker logic, including dynamic rules, content-script registration, Claude main-world script registration, config reload handling, and extension click behavior.
- `crx-extracted/assets/chunk-b76f4e26.js` contains content-script actions for sending text, readiness checks, sidebar handling, screenshot/capture support, and Claude frame injection requests.
- `crx-extracted/assets/claude-main.js` is the Claude-specific main-world helper for `claude.ai` pages.
- `qrcodes/`, `screenshots/`, `README.md`, `README_CN.md`, `CHANGELOG.md`, and `CUSTOM_CONFIG_EXAMPLE.md` are support and operator-facing package files.

## Important Source Reality
This checkout does not currently include a `crx-original/` comparison directory, a root-level unpacked `.crx`, or the manifest-referenced unpacked files such as `chatHub.html`, `service-worker-loader.js`, `img/*`, `assets/chunk-936fa2ae.js`, and `assets/chunk-a783bd53.js`. Static imports also point at missing chunks, `chunk-93671912.js` dynamically registers `/assets/index.ts-loader-7fda2deb.js`, and `chunk-809f580f.js` references hashed UI/support assets such as `assets/logoDefault-fabbf774.svg`, `assets/bmc-176c31ac.png`, `assets/paypal-57a61d48.png`, `assets/wechat-dca54bb1.png`, and prompt-intro images; those files are absent from the checked-in tree. The zip package contains `Simple-Chat-Hub-2.0.0.crx`, but the unpacked `crx-extracted/` directory is not a complete loadable extension as checked in unless those missing unpacked files are restored.

Because of that, use `crx-extracted/manifest.json` and compiled assets for fork inspection, but do not claim a full unpacked-extension runtime validation from this checkout alone. Manual browser validation requires a complete unpacked bundle.

The packaged CRX must be treated as drift-sensitive release inspection, not as a substitute for validating the fork runtime, unless it is rebuilt or otherwise proven aligned with `crx-extracted/`. The current nested CRX payload drifts materially from the fork manifest: its nested manifest still grants broad `<all_urls>` host access, lacks the `tabCapture` and `desktopCapture` permissions used by the Claude preview flow, and does not include `assets/claude-main.js`.

## Behavior Flow
The intended MV3 flow is:
- The browser loads the extension from the unpacked bundle or from the packaged CRX.
- The manifest declares `chatHub.html` as the options page and `service-worker-loader.js` as a module background service worker.
- The bundled background logic registers content scripts for configured chatbot URLs, dynamically registers `/assets/index.ts-loader-7fda2deb.js`, and registers `assets/claude-main.js` in the main world for Claude pages.
- The shared runtime chunk filters built-in chat apps to the explicit allowlist and installs guards around browser networking APIs so non-allowlisted HTTP(S) destinations are blocked.
- The content script sends text into configured chatbot pages, reports readiness/errors, and supports capture/scroll operations.
- Claude is special-cased to open in a separate tab and use a preview/capture helper rather than relying only on an embedded frame.

## External Integrations
- Chrome/Edge Manifest V3 extension APIs: `activeTab`, `storage`, `declarativeNetRequest`, `scripting`, `tabCapture`, and `desktopCapture`.
- Allowlisted chatbot hosts in the manifest: ChatGPT, Gemini, Claude, Grok, Kimi, and DeepSeek domains.
- Built-in config still contains more upstream platforms in the compiled bundle, but the runtime allowlist filter keeps only hosts permitted by the fork allowlist.

## Engineering Notes
- Treat `crx-extracted/` as the runtime inspection surface, but verify missing manifest-referenced files before using it as a loadable unpacked extension.
- Do not broaden `host_permissions` casually. The current fork intentionally narrows network and host access to a chatbot allowlist.
- Keep packaged artifacts and unpacked artifacts aligned when changing extension behavior. If only one side changes, document that as release risk in the change being made; current package inspection shows the nested CRX is not aligned with the fork manifest/assets.
- There is no automated source test suite in this repository. Use the safe checks in `docs/agent_docs/running_tests.md` plus manual extension validation when behavior changes.
