# API overview

All routes are under `/api/v1` and use `{ success, data, error }` JSON envelopes.

- `GET /health` — service status
- `POST /cases` — validate scenario, generate and persist a case
- `GET /cases/:caseId` — public case and current guest progress
- `GET /cases/:caseId/evidence/:evidenceId` — one public evidence detail
- `POST /cases/:caseId/investigations` — create or resume the guest attempt
- `POST /investigations/:id/evidence/:evidenceId/review` — idempotent review mark
- `POST /investigations/:id/hints` — retrieve the next canonical hint
- `POST /investigations/:id/accusation` — one final server-evaluated answer
- `GET /investigations/:id/result` — completed result only

Errors include a stable code, user-safe message, and optional validation details. Private solution fields are only included in the completed result response.

