---
doc_type: running_tests
managed_by: sync-repo-docs
current_through_commit: 94aee73c753817b3a7bde2bfb3129b19e2ed3e31
current_through_date: 2026-05-25T02:07:17-07:00
---

# Running Tests
## Primary Commands
- No dedicated automated test command was identified from the current manifests; use focused source inspection plus any documented project-specific checks.

## Targeted Test Patterns
- Run the narrowest available package, pytest, or Playwright command for the files being changed.

## Environment and Fixtures
- Install dependencies using the package manager or Python environment described by the current manifests before running tests.
- Check `.env.example`, `env.example`, README setup sections, and local service requirements before running integration checks.
- Prefer focused unit or build checks when broad tests require external services.

## Edge Cases
- Treat deploy, restore, migration, promotion, scheduler, and production data commands as operational workflows, not tests.
- If a broad test command needs live credentials, databases, browsers, or sibling services, document that dependency and run the smallest safe check available.

## Known Gaps
- Commands in this file are derived from current manifests and tracked tests; if a repo-specific guide documents a stricter check, prefer the guide.
