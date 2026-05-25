---
doc_type: architecture
managed_by: sync-repo-docs
current_through_commit: 94aee73c753817b3a7bde2bfb3129b19e2ed3e31
current_through_date: 2026-05-25T02:07:17-07:00
---

# Architecture
## System Overview
webchathub is documented from the current repository tree. The primary human overview is `README.md`; this managed doc is a current-state navigation and architecture companion for agents.

First-class runtime surfaces:
- Tracked source and documentation files in the current git tree.

## Main Components
- `crx-extracted/` - JavaScript/TypeScript source.
- `docs/` - repository documentation and managed doc-sync metadata.
- `qrcodes/` - tracked repository area; inspect contained files before changing behavior.
- `screenshots/` - tracked repository area; inspect contained files before changing behavior.

Representative source anchors include `README.md`, `AGENTS.md`, `CLAUDE.md`.

## Data Flow
Start at the runtime surfaces above, then follow imports, routes, command handlers, or scripts into the source directories listed in `docs/fileindex.md`. Treat generated outputs, caches, local data, and reports as derived artifacts unless the repo README or an operator guide explicitly says they are source inputs.

The latest doc sync reviewed 6 changed path(s) since the previous docs baseline.

## External Integrations
- Anthropic/Claude references appear in manifests, README, or environment examples; verify concrete clients in source before changing behavior.
- GitHub references appear in manifests, README, or environment examples; verify concrete clients in source before changing behavior.
- FastAPI/HTTP references appear in manifests, README, or environment examples; verify concrete clients in source before changing behavior.

## Key Decisions
- Managed docs are synchronized against the live tree and finalized to the current git `HEAD`; commit dossier files are navigation context, not source of truth.
- Prefer current ownership modules over stale facade or compatibility paths when changing behavior.
- Do not add compatibility layers, fallback mappings, or legacy response fields unless the caller contract explicitly requires them.

## Operational Notes
Use `docs/agent_docs/running_tests.md` for safe verification commands. Do not infer deploy, restore, migration, promotion, scheduler, or production-mutating workflows from test documentation.
