---
doc_type: architecture
managed_by: sync-repo-docs
current_through_commit: d2982dfbd6c69eec6fca07e3e7e5f1f61f7948d5
current_through_date: 2026-06-06T23:40:52-07:00
---

# Architecture
## System Overview
`webchathub` is an artifact-driven browser-extension fork of Simple Chat Hub. The live runtime is the unpacked Manifest V3 bundle under `crx-extracted/`; there is no source-first root build toolchain in this repo.

First-class runtime surfaces:
- `crx-extracted/manifest.json` and the unpacked extension assets.
- `crx-original/` as the upstream comparison bundle.
- Packaged artifacts `Simple-Chat-Hub-2.0.0.crx` and `Simple-Chat-Hub-2.0.0.crx.zip`.
- Fork/operator docs in `README.md`, `CHANGELOG.md`, `CUSTOM_CONFIG_EXAMPLE.md`, and `docs/`.

## Main Components
- `crx-extracted/` contains the live unpacked MV3 extension bundle, including compiled JS/CSS assets, locale files, icons, service worker loader, and manifest.
- `crx-original/` contains the original unpacked comparison bundle.
- `Simple-Chat-Hub-2.0.0.crx` and `Simple-Chat-Hub-2.0.0.crx.zip` are release artifacts that can drift from `crx-extracted/`.
- `screenshots/` and `qrcodes/` are support artifacts from the upstream/fork package.
- `docs/` contains managed repo-doc sync metadata and agent navigation.

Representative source anchors include `README.md`, `AGENTS.md`, `CLAUDE.md`.

## Data Flow
Chrome/Edge loads `crx-extracted/` as an unpacked extension. The manifest registers static resources, compiled assets, host permissions, and browser permissions. The fork intentionally narrows host access to allowlisted chatbot domains and adds Claude preview support through `tabCapture`/`desktopCapture`.

Most extension logic is compiled into `crx-extracted/assets/*.js`; behavior review is artifact inspection plus manual browser loading. When changing behavior, compare `crx-original/manifest.json` with `crx-extracted/manifest.json`, inspect the relevant built asset, and keep unpacked and packaged artifacts aligned.

The latest doc sync reviewed 6 changed path(s) since the previous docs baseline.

## External Integrations
- Chrome/Edge extension APIs: MV3, service worker loader, `declarativeNetRequest`, `scripting`, `storage`, `activeTab`, `tabCapture`, and `desktopCapture`.
- Allowlisted chatbot hosts currently include ChatGPT, Gemini, Claude, Grok, Kimi, and DeepSeek domains.
- Claude preview uses a separate Claude tab plus user-selected capture/preview inside the hub panel.

## Key Decisions
- Managed docs are synchronized against the live tree and finalized to the current git `HEAD`; commit dossier files are navigation context, not source of truth.
- Prefer current ownership modules over stale facade or compatibility paths when changing behavior.
- Do not add compatibility layers, fallback mappings, or legacy response fields unless the caller contract explicitly requires them.
- Do not broaden host permissions casually. `<all_urls>` was intentionally replaced with explicit chatbot host allowlists.
- Because no root rebuild workflow is exposed, be explicit whether a change modifies only `crx-extracted/` or also updates packaged CRX/zip artifacts.

## Operational Notes
Use `docs/agent_docs/running_tests.md` for safe verification commands. Do not infer deploy, restore, migration, promotion, scheduler, or production-mutating workflows from test documentation.
