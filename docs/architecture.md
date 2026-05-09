---
doc_type: architecture
managed_by: sync-repo-docs
current_through_commit: 3a04b5823a32bccd15031e30dad1c5f09754c39e
current_through_date: 2026-05-08T02:41:44-07:00
---

# Architecture

## System Overview

`webchathub` is not a source-first web app repo. It is a browser-extension distribution repo centered on packaged and unpacked MV3 extension artifacts for a fork of Simple Chat Hub. The live runtime is the unpacked extension under `crx-extracted/`, the comparison baseline is `crx-original/`, and the repo root also ships the packaged `.crx` and `.crx.zip` release artifacts.

## Main Components

- `crx-extracted/` is the live unpacked extension bundle. Its `manifest.json` defines the active permissions, host allowlist, action behavior, background service worker, and options page. `chatHub.html` is the extension UI shell and `assets/` contains the built JS/CSS bundles.
- `crx-extracted/service-worker-loader.js` is the MV3 background entrypoint. It imports the main background chunk, which registers the browser-action click handler, sets dynamic network rules, and injects content scripts based on the configured chat providers.
- `crx-original/` is the comparison copy for the upstream-style bundle. The diff between `crx-original/manifest.json` and `crx-extracted/manifest.json` is the clearest machine-readable summary of the fork’s permission and host-policy changes.
- `README.md`, `CUSTOM_CONFIG_EXAMPLE.md`, `CHANGELOG.md`, `screenshots/`, and `qrcodes/` are the authored support surface around the extension artifacts.
- `Simple-Chat-Hub-2.0.0.crx` and `Simple-Chat-Hub-2.0.0.crx.zip` are packaged release artifacts. `temp.zip` and `__MACOSX/` are packaging leftovers, not runtime source.

## Data Flow

- Installing or loading the extension starts from `crx-extracted/manifest.json`, which points Chrome/Edge at `service-worker-loader.js` as the module service worker and `chatHub.html` as the options page.
- Clicking the extension action opens `chatHub.html`, whose bundled JS mounts the extension UI from the compiled `assets/` chunks.
- The background bundle configures declarative network rules and registers content scripts for the supported chat sites. For Claude, it also registers a dedicated MAIN-world script and relies on `tabCapture` / `desktopCapture` for the live preview flow described in `README.md`.
- Host access is no longer global. The unpacked fork manifest restricts `host_permissions` and `web_accessible_resources.matches` to specific AI chat domains such as ChatGPT, Gemini, Claude, Grok, Kimi, and DeepSeek.
- Distribution happens by shipping the unpacked bundle, the packaged `.crx`, and the zip wrapper together in the repo.

## External Integrations

- The live extension manifest integrates with Chrome/Edge extension APIs including `storage`, `declarativeNetRequest`, `scripting`, `activeTab`, `tabCapture`, and `desktopCapture`.
- The forked runtime is scoped to AI chat hosts listed in `crx-extracted/manifest.json` instead of the upstream-style `<all_urls>` permission.
- Claude preview behavior depends on browser-mediated tab/desktop capture rather than a plain embedded sidebar.
- The repo references the Chrome Web Store and Edge Add-ons distribution paths in `README.md`, but the local tree itself is just the packaged extension artifacts and docs.

## Key Decisions

- The fork is artifact-driven. The unpacked extension bundle and manifest are the source of truth in this repo, not a checked-in TypeScript/Vite-style source tree.
- The fork intentionally narrows host access from the original `<all_urls>` model to an explicit allowlist in `crx-extracted/manifest.json`.
- The fork also adds `activeTab`, `tabCapture`, and `desktopCapture` to support the Claude live-preview workflow described in `README.md`.
- Because the repo ships built assets rather than a visible build system, the safest review path is artifact inspection: compare `crx-original/manifest.json` to `crx-extracted/manifest.json`, inspect the packaged files, and then manually load the unpacked extension in a browser.

## Operational Notes

- Treat `crx-extracted/manifest.json`, `service-worker-loader.js`, and `chatHub.html` as the fastest grounding files for the live extension behavior.
- Expect most logic to live inside minified or compiled files under `crx-extracted/assets/`; this repo does not expose a normal source-first rebuild workflow at the root.
- Packaged artifacts can drift from the unpacked bundle if someone updates one without regenerating the others, so artifact-consistency checks matter more here than a normal unit-test suite.
