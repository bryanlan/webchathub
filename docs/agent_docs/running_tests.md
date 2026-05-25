---
doc_type: running_tests
managed_by: sync-repo-docs
current_through_commit: 59e7e76cfd146d60bbfb13e9e81d8f76f60f4d02
current_through_date: 2026-05-24T19:02:51-07:00
---

# Running Tests
## Primary Commands
- No safe generic test command was identified from manifests or tracked test directories. Inspect repo-specific docs before running broad checks.

## Targeted Test Patterns

## Environment and Fixtures
No committed environment example was detected. Avoid assuming live credentials or production services are available during tests.

## Edge Cases
- Treat deploy, restore, migration, promotion, and production data commands as operational workflows, not tests.
- If a broad test command needs external services, prefer a smaller unit or build check while documenting the missing dependency.

## Known Gaps
- Commands listed here were inferred from current manifests and tracked tests during the rollout; run them before relying on a change.
