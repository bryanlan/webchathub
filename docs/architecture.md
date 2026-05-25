---
doc_type: architecture
managed_by: sync-repo-docs
current_through_commit: 59e7e76cfd146d60bbfb13e9e81d8f76f60f4d02
current_through_date: 2026-05-24T19:02:51-07:00
---

# Architecture
## System Overview
webchathub is documented from the current repository tree. simple-chat-hub; Fork notice: This repository is a fork of https://github.com/jackyr/simple-chat-hub-extension and is not affiliated with the upstream author.; Fork changes this repo; - Removes non-chatbot API calls from the extension and blocks requests to non-allowlisted hosts.
The primary human overview is `README.md`; this managed doc is a navigation and architecture companion for agents.

## First-Class Runtime Surfaces
- No package manifest exposes a clear runtime surface; inspect the top-level files and scripts before making behavior changes.

## Main Components
- `crx-extracted/` is a top-level area present in the live tree; see `docs/fileindex.md` for navigation details.
- `docs/` is a top-level area present in the live tree; see `docs/fileindex.md` for navigation details.
- `qrcodes/` is a top-level area present in the live tree; see `docs/fileindex.md` for navigation details.
- `screenshots/` is a top-level area present in the live tree; see `docs/fileindex.md` for navigation details.
- JavaScript/TypeScript anchors include `crx-extracted/assets/chunk-809f580f.js`, `crx-extracted/assets/chunk-93671912.js`, `crx-extracted/assets/chunk-b76f4e26.js`, `crx-extracted/assets/chunk-cdf2dc81.js`, `crx-extracted/assets/claude-main.js`.

## Data Flow
Start from the runtime surfaces above, then follow imports into the component directories. Treat generated outputs, caches, and reports as derived artifacts unless a repo-specific README says otherwise.

## External Integrations
No external integration can be asserted from filenames alone; verify provider clients in source before changing integration behavior.

## Key Decisions
- Managed docs are synchronized against the live tree and finalized to the current git `HEAD`; commit dossier files are context, not source of truth.
- Future agents should verify ownership in source files before preserving older compatibility paths or workaround behavior.

## Operational Notes
Use `docs/agent_docs/running_tests.md` for safe verification commands. Do not infer deploy, restore, or production-mutating workflows from test documentation.
