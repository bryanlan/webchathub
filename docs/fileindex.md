---
doc_type: fileindex
managed_by: sync-repo-docs
current_through_commit: be989f17bdda93b0e9f7a1eeaa7178e11beb24a0
current_through_date: 2026-05-21T02:37:46-07:00
---

# File Index

## Top-Level Layout

- `crx-extracted/` contains the live unpacked extension bundle that should be treated as the current runtime surface.
- `crx-original/` contains the comparison bundle used to understand what the fork changed from the upstream-style artifact set.
- `docs/` contains the managed repo docs.
- `screenshots/`, `qrcodes/`, `README.md`, `README_CN.md`, `CUSTOM_CONFIG_EXAMPLE.md`, and `CHANGELOG.md` are the support and release-documentation surface.
- `Simple-Chat-Hub-2.0.0.crx` and `Simple-Chat-Hub-2.0.0.crx.zip` are packaged release artifacts.
- `__MACOSX/` and `temp.zip` are packaging leftovers rather than meaningful source.

## Key Directories

- `crx-extracted/assets/` holds the compiled JS and CSS bundles for both the extension UI and the background/content-script logic.
- `crx-extracted/_locales/` and `crx-original/_locales/` contain extension localization data.
- `crx-original/assets/` is useful for artifact-to-artifact comparison when auditing fork changes.
- `screenshots/` and `qrcodes/` are presentation/distribution assets, not runtime logic.

## Key Files

- `crx-extracted/manifest.json` is the most important runtime file. It defines the MV3 surface, permissions, host allowlist, options page, and service worker.
- `crx-extracted/service-worker-loader.js` is the background entrypoint that imports the real bundled service-worker logic.
- `crx-extracted/chatHub.html` is the extension UI shell loaded by the options page.
- `crx-original/manifest.json` is the fastest comparison point for the fork’s permission and host-policy changes.
- `README.md` explains the fork-level behavior changes, especially the restricted host model and Claude preview flow.
- `Simple-Chat-Hub-2.0.0.crx.zip` is the packaged distribution wrapper; `Simple-Chat-Hub-2.0.0.crx` is the extension payload inside it.

## Change Hotspots

- `crx-extracted/manifest.json` and the service-worker/content-script bundles change together when provider support, host permissions, or capture behavior changes.
- `crx-original/manifest.json` and `crx-extracted/manifest.json` are the key pair to inspect when reviewing fork deltas.
- `README.md`, screenshots, and packaged artifacts move together when the extension behavior or release packaging changes.

## Deferred or Unclear Areas

- The repo does not expose the original unbundled source or build toolchain at the root, so most behavioral review is bundle inspection rather than source-level tracing.
- The relationship between `crx-extracted/` and the packaged `.crx` is manual from the repo’s point of view; there is no visible root script that rebuilds and verifies them together.
- Packaging leftovers (`__MACOSX/`, `temp.zip`) add noise and should not be mistaken for authoritative runtime content.
