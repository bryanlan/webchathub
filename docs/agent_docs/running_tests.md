---
doc_type: running_tests
managed_by: sync-repo-docs
current_through_commit: 86c2eb6787390353a0ac464f4b44d8aa7a23cb27
current_through_date: 2026-05-11T02:32:29-07:00
---

# Running Tests

## Primary Commands

- `cd /home/bryan/code/webchathub && python3 -m json.tool crx-extracted/manifest.json >/dev/null`
  Passes. This is the quickest sanity check that the live unpacked manifest is valid JSON.
- `cd /home/bryan/code/webchathub && diff -u crx-original/manifest.json crx-extracted/manifest.json`
  Produces the expected fork delta. This is the most useful non-browser verification path because it shows the narrowed host allowlist and the added capture-related permissions.
- `cd /home/bryan/code/webchathub && unzip -l Simple-Chat-Hub-2.0.0.crx.zip`
  Passes. Use this to confirm the packaged zip still contains the `.crx` payload.

## Targeted Test Patterns

- This repo does not expose a root automated unit/integration suite. Treat artifact inspection plus manual browser loading as the real validation path.
- Start with the manifest and packaging checks above, then load `crx-extracted/` as an unpacked extension in Chrome or Edge.
- When reviewing fork behavior, compare `crx-original/manifest.json` to `crx-extracted/manifest.json` before inspecting the minified bundles under `crx-extracted/assets/`.

## Environment and Fixtures

- Validation is browser-extension oriented, not package-manager oriented. There is no root `package.json`, `pyproject.toml`, or other build/test manifest in the live tree.
- Manual runtime checks require Chrome or Edge with developer-mode extension loading enabled.
- The unpacked extension’s active surfaces are `crx-extracted/manifest.json`, `crx-extracted/service-worker-loader.js`, and `crx-extracted/chatHub.html`.

## Edge Cases

- `crx-extracted/` is a built bundle, so most behavior is hidden inside compiled asset chunks rather than readable source modules.
- Packaged artifacts can drift from the unpacked tree if someone updates the manifest or bundles without regenerating the `.crx` and zip together.
- The fork’s Claude-preview flow depends on `tabCapture` / `desktopCapture`, so browser permission prompts and chosen shared-tab state materially affect manual validation.

## Known Gaps

- This sync did not run an interactive browser session or load the unpacked extension manually.
- There is no confirmed source-level rebuild workflow in the current repo root.
- The docs describe the live artifact set, but they do not prove the packaged `.crx` and unpacked bundle are byte-for-byte synchronized.
