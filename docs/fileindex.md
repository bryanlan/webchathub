# File Index

## Top-Level Layout
- `crx-extracted/` - checked-in extension artifact directory. In this checkout it contains the manifest and compiled assets only, not a complete unpacked extension bundle.
- `Simple-Chat-Hub-2.0.0.crx.zip` - packaged release archive containing `Simple-Chat-Hub-2.0.0.crx` and a macOS metadata entry.
- `docs/` - durable navigation docs for architecture, file ownership, and safe validation commands.
- `docs/agent_docs/` - agent-facing documentation. `running_tests.md` is the maintained validation guide.
- `qrcodes/` and `screenshots/` - upstream/fork support assets used by package documentation.
- `README.md`, `README_CN.md`, `CHANGELOG.md`, and `CUSTOM_CONFIG_EXAMPLE.md` - operator and upstream support docs.

## Runtime Artifact Files
- `crx-extracted/manifest.json` - primary manifest authority for version, permissions, host allowlist, options page path, background service worker path, content script resources, and web-accessible resources.
- `crx-extracted/assets/chunk-cdf2dc81.js` - shared compiled dependency/runtime chunk. It owns the built-in platform config, allowlist filtering, custom config persistence, and request/network guard symbols such as `__ALLOW_HOSTS`, `__filterApps`, `__isAllowedUrl`, and `__installGuard`.
- `crx-extracted/assets/chunk-809f580f.js` - main bundled UI/runtime logic. It imports `chunk-cdf2dc81.js` plus missing checked-in chunks such as `chunk-936fa2ae.js` and `chunk-a783bd53.js`.
- `crx-extracted/assets/chunk-93671912.js` - background/service-worker bundle for dynamic rules, content-script registration, Claude main-world registration, config reload, and extension action click behavior.
- `crx-extracted/assets/chunk-b76f4e26.js` - content-script bundle for page automation, text sending, readiness, capture/scroll, and Claude helper injection request handling.
- `crx-extracted/assets/claude-main.js` - Claude-specific helper loaded into Claude pages.

## Missing or Drift-Sensitive Paths
- `crx-original/` is not present in this checkout. Do not list comparison commands against it as runnable validation unless the directory is restored.
- `Simple-Chat-Hub-2.0.0.crx` is not present as a root-level file; it is inside `Simple-Chat-Hub-2.0.0.crx.zip`.
- `crx-extracted/chatHub.html`, `crx-extracted/service-worker-loader.js`, and `crx-extracted/img/*` are referenced by the manifest but are not present in the checked-in `crx-extracted/` tree.
- The manifest and compiled imports reference chunk names that are absent from `crx-extracted/assets/`, including `chunk-936fa2ae.js` and `chunk-a783bd53.js`. `chunk-93671912.js` also dynamically registers `/assets/index.ts-loader-7fda2deb.js`, which is absent from the checked-in tree. Check manifest resources, static JS imports, and dynamic script/resource path strings before assuming the unpacked bundle can load.
- The nested CRX inside `Simple-Chat-Hub-2.0.0.crx.zip` is currently drifted from `crx-extracted/`: its manifest has `host_permissions: ["<all_urls>"]`, does not request `tabCapture` or `desktopCapture`, and lacks `assets/claude-main.js`.

## Documentation Files
- `AGENTS.md` - repository instructions and guardrails for artifact-driven extension work.
- `docs/architecture.md` - current runtime ownership, behavior flow, external integrations, and artifact completeness caveats.
- `docs/fileindex.md` - this file; use it for navigation and file ownership.
- `docs/agent_docs/running_tests.md` - safe, repeatable checks for this artifact repository.

## Change Hotspots
- Manifest changes: inspect `crx-extracted/manifest.json`, verify referenced files exist, run manifest JSON validation, and review permissions/host permissions closely.
- Runtime allowlist changes: inspect both the manifest allowlists and the compiled allowlist guard in `crx-extracted/assets/chunk-cdf2dc81.js`.
- Background/content-script changes: inspect `chunk-93671912.js`, `chunk-b76f4e26.js`, and manifest script/resource references together.
- Claude preview changes: inspect `assets/claude-main.js`, `chunk-b76f4e26.js`, `chunk-93671912.js`, and the `tabCapture`/`desktopCapture` permissions.
- Packaging changes: inspect `Simple-Chat-Hub-2.0.0.crx.zip` with `unzip -l`, inspect the nested CRX payload manifest/assets, and confirm whether packaged contents match the intended unpacked runtime.

## Validation Anchors
- Manifest syntax: `python3 -m json.tool crx-extracted/manifest.json >/dev/null`.
- Repository file inventory: `find crx-extracted -maxdepth 2 -type f -printf '%P\n' | sort`.
- Package listing: `unzip -l Simple-Chat-Hub-2.0.0.crx.zip`, followed by nested CRX payload inspection when package alignment matters.
- Reference coverage: compare manifest resources, static JS imports, and dynamic script/resource path strings such as `/assets/index.ts-loader-7fda2deb.js` against the checked-in `crx-extracted/` tree.
- Manual runtime validation requires a complete unpacked extension directory or the packaged CRX; the current `crx-extracted/` tree alone is incomplete.
