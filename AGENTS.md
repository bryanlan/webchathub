# AGENTS.md

This repo is an artifact-driven browser-extension fork of Simple Chat Hub. The checkout exposes fork inspection artifacts under `crx-extracted/`, not a source-first TypeScript app or rebuild workflow.

## Quick Rules
- Treat `crx-extracted/manifest.json` and the checked-in compiled assets as the source of truth for fork intent.
- Do not run the old `crx-original/manifest.json` comparison path in this checkout; `crx-original/` is absent.
- The checked-in `crx-extracted/` tree is incomplete as a loadable unpacked extension. It is missing manifest-referenced files and dynamically registered/imported scripts, so runtime validation requires a complete unpacked bundle.
- Assume most logic lives inside compiled assets; prefer artifact inspection and manual browser loading of a complete bundle over speculative source-level edits.
- Keep packaged artifacts and unpacked artifacts aligned. The current nested CRX is drifted from `crx-extracted/`, so packaged CRX inspection is not a substitute for validating the fork runtime unless the package is rebuilt or proven aligned.

## Build / Test / Verify
- Install: no root build toolchain is exposed in this repo.
- Dev: load a complete unpacked extension bundle in Chrome or Edge; this checkout's `crx-extracted/` directory alone is incomplete.
- Test: `python3 -m json.tool crx-extracted/manifest.json >/dev/null`
- Verify: inspect `crx-extracted/manifest.json`, checked-in asset references, and the nested payload inside `Simple-Chat-Hub-2.0.0.crx.zip`; do not rely only on the outer zip listing.

## Repo Map
- `crx-extracted/` — fork manifest and checked-in compiled assets; currently incomplete as an unpacked extension.
- `Simple-Chat-Hub-2.0.0.crx.zip` — packaged CRX archive. Its nested manifest currently has `<all_urls>` host access, lacks `tabCapture`/`desktopCapture`, and omits `assets/claude-main.js`.
- `docs/`, `README.md`, `CHANGELOG.md`, `CUSTOM_CONFIG_EXAMPLE.md` — support docs and release notes.

## Repo-Specific Guardrails
- The Claude preview flow depends on `tabCapture` / `desktopCapture`; permission prompts and chosen shared-tab state matter during validation.
- Host permissions are intentionally allowlisted. Do not broaden them casually.
- Because the root repo does not expose a rebuild workflow, be explicit when a change only updates unpacked artifacts versus packaged release files.

## Additional References
- `docs/architecture.md` — artifact/runtime model and fork behavior.
- `docs/fileindex.md` — key files and packaging surfaces.
- `docs/agent_docs/running_tests.md` — current artifact-inspection validation path.
- `README.md` — fork-specific behavior changes and manual installation flow.
