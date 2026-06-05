---
doc_type: running_tests
managed_by: sync-repo-docs
current_through_commit: f6c6ca9c3a2b8afabceeabd9a57f9c701a000eae
current_through_date: 2026-05-27T19:14:56-07:00
---

# Running Tests
## Primary Commands
- `python3 -m json.tool crx-extracted/manifest.json >/dev/null` - passed on 2026-05-27.
- `diff -u crx-original/manifest.json crx-extracted/manifest.json` - expected nonzero diff showing fork changes; reviewed on 2026-05-27.
- `unzip -l Simple-Chat-Hub-2.0.0.crx.zip` - passed on 2026-05-27 and listed the packaged CRX plus macOS metadata entry.

## Targeted Test Patterns
- Manifest-only checks: `python3 -m json.tool crx-extracted/manifest.json >/dev/null && diff -u crx-original/manifest.json crx-extracted/manifest.json`.
- Packaged artifact check: `unzip -l Simple-Chat-Hub-2.0.0.crx.zip`.
- Manual runtime check: load `crx-extracted/` as an unpacked extension in Chrome/Edge and exercise the edited platform panel.

## Environment and Fixtures
- No root install/build toolchain is exposed in this repo.
- `crx-extracted/` is the live unpacked bundle; `crx-original/` is the upstream comparison bundle.
- Browser validation requires Chrome or Edge extension developer mode.
- Claude preview validation requires selecting the Claude tab in the capture prompt and checking zoom/pan/fit preview behavior.

## Edge Cases
- Treat deploy, restore, migration, promotion, scheduler, and production data commands as operational workflows, not tests.
- There is no automated browser suite in this repo. Manifest/package checks do not prove the extension UI or capture flow works.
- Host permissions are intentionally allowlisted; do not treat broadening them as a test shortcut.

## Known Gaps
- Manual unpacked-extension validation is still required for behavior changes in compiled assets.
