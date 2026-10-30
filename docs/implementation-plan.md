# Implementation plan

## Applicable requirements

Implement the MVP in `spec.md` phases 1–6: foundation, responsive UI, generation, investigation, hints/accusation/results, and optional media fallback. The core acceptance criteria require an end-to-end fictional case workflow, private canonical solution, server-side evaluation, and deterministic scoring.

## Files and components

- Root workspace configuration, repository instructions, and setup documentation.
- `server/src`: configuration, Mongo connection, Mongoose models, runtime schemas, Gemini generator, services, middleware, and versioned routes.
- `client/src`: routed landing/create/investigation/result pages, API client, shared types, accessible components, and responsive design system.
- `.env.example` documents backend-only settings. No credentials are stored in source.

## Dependencies

React, Vite, React Router, Tailwind CSS, Lucide, Express, Mongoose, Google Gen AI SDK, Zod, Helmet, CORS, and express-rate-limit. MongoDB and Gemini are external runtime services. Media generation is optional and uses simulated placeholders in this MVP.

## Edge cases and safeguards

- Reject scenarios outside 30–2,000 characters and out-of-range selections in client and server.
- Reject malformed or inconsistent model output; bounded generation attempts must never publish a case without a valid culprit.
- Use explicit public DTOs; never serialize private solution data in ordinary case/evidence responses.
- Bind investigation actions to an HTTP-only signed guest session; validate case, evidence, and suspect references.
- Make evidence reviews idempotent, cap hints at three, and allow one authoritative accusation.
- Sanitize provider/database errors and keep API keys out of logs and browser code.

## Verification plan

The specification calls for unit, integration, and end-to-end tests. Automated tests are not added or run during this implementation because the session's development instructions prohibit adding or running tests unless explicitly requested. Typecheck/build commands are documented for follow-up verification.

