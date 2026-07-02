---
doc_type: fileindex
managed_by: sync-repo-docs
current_through_commit: b944beb07501a45ccbab4e1459891752a7d64b5c
current_through_date: 2026-07-01T01:06:01-04:00
---

# File Index
## Top-Level Layout
- `crx-extracted/` - live unpacked MV3 extension bundle.
- `crx-original/` - upstream/original unpacked bundle for fork comparison.
- `Simple-Chat-Hub-2.0.0.crx` and `Simple-Chat-Hub-2.0.0.crx.zip` - packaged release artifacts.
- `docs/` - managed repo-doc sync metadata and agent navigation.
- `qrcodes/` and `screenshots/` - support/release assets.

## Key Directories
- `crx-extracted/assets/` - compiled JS/CSS/assets, including fork-specific Claude preview code.
- `crx-extracted/_locales/` - extension locale message files.
- `crx-extracted/img/` - extension icon assets.
- `crx-original/` - comparison bundle; use this to identify fork-specific manifest and asset changes.
- `docs/agent_docs/` - managed doc-sync status and commit dossier files.

## Key Files
- `README.md` - key tracked file or entrypoint for this repo.
- `AGENTS.md` - key tracked file or entrypoint for this repo.
- `CLAUDE.md` - key tracked file or entrypoint for this repo.
- `CHANGELOG.md`, `CUSTOM_CONFIG_EXAMPLE.md`, and `README_CN.md` - upstream/fork support docs.
- `crx-extracted/manifest.json` - live extension manifest; primary review point for permissions, host allowlist, resources, and service worker.
- `crx-original/manifest.json` - upstream comparison manifest.
- `crx-extracted/assets/claude-main.js` - fork-specific Claude preview/capture asset.
- `crx-extracted/assets/chunk-*.js` and `chatHub-ab3d4279.css` - compiled extension runtime and styling.
- `crx-extracted/service-worker-loader.js` and `chatHub.html` - extension service worker and panel entry files.
- `Simple-Chat-Hub-2.0.0.crx.zip` - zipped CRX package; inspect with `unzip -l`.

Test and verification anchors:
- No source-level test suite is present.
- Manifest syntax: `python3 -m json.tool crx-extracted/manifest.json >/dev/null`.
- Fork manifest diff: `diff -u crx-original/manifest.json crx-extracted/manifest.json`.
- Packaged artifact listing: `unzip -l Simple-Chat-Hub-2.0.0.crx.zip`.

## Change Hotspots
- Runtime entrypoint changes should be reviewed with adjacent service, route, CLI, or frontend modules and the tests that exercise them.
- Manifest or dependency changes should be reviewed with setup docs and `docs/agent_docs/running_tests.md`.
- Documentation-only changes should stay scoped to managed docs unless source-of-truth operator docs are stale.
- Manifest changes should review `crx-original/manifest.json`, `crx-extracted/manifest.json`, README fork notes, and manual browser loading.
- Claude preview changes should inspect `crx-extracted/assets/claude-main.js`, manifest capture permissions, and manual capture/preview behavior.
- Packaging changes should keep `crx-extracted/`, `.crx`, and `.crx.zip` artifacts aligned or explicitly document the drift.
- When recent commits rename, split, or demote modules, verify whether the old file still owns behavior or only delegates to newer modules.

## Deferred or Unclear Areas
- There is no root build/repack command in the repository. Manual extension loading and artifact comparison are the current validation path.
