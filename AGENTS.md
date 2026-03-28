# AGENTS.md

This repo is an artifact-driven browser-extension fork of Simple Chat Hub. The live runtime is the unpacked MV3 bundle under `crx-extracted/`, not a source-first TypeScript app.

## Quick Rules
- Treat `crx-extracted/` as the source of truth for current behavior.
- Review fork behavior by comparing `crx-original/manifest.json` to `crx-extracted/manifest.json` before diving into built bundles.
- Assume most logic lives inside compiled assets; prefer artifact inspection and manual browser loading over speculative source-level edits.
- Keep packaged artifacts and the unpacked bundle aligned. Drift between them is a real release risk in this repo.

## Build / Test / Verify
- Install: no root build toolchain is exposed in this repo.
- Dev: load `crx-extracted/` as an unpacked extension in Chrome or Edge.
- Test: `python3 -m json.tool crx-extracted/manifest.json >/dev/null`
- Verify: `diff -u crx-original/manifest.json crx-extracted/manifest.json && unzip -l Simple-Chat-Hub-2.0.0.crx.zip`

## Repo Map
- `crx-extracted/` — live unpacked extension bundle.
- `crx-original/` — comparison bundle for upstream/fork deltas.
- Packaged `.crx` and `.crx.zip` — release artifacts.
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

