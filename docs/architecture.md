# Architecture

The React/Vite client calls a versioned Express API. The client only receives public case and evidence DTOs. Express validates requests, checks guest session ownership, and delegates generation and investigation rules to services. Mongoose stores public case data separately from the canonical hidden solution. The scoring service evaluates accusations against that solution and persists one final result.

Gemini requests stay inside `server/src/services/gemini.service.ts`. The provider returns structured JSON, then Zod and cross-reference checks validate it before persistence. Image/video generation is optional; fictional evidence remains usable with simulated text and placeholder art.

## Trust boundaries

- Scenario text is untrusted data and is bracketed as such in the system prompt.
- Gemini output is untrusted until schema and relationship validation succeed.
- Browser state is never authoritative for ownership, culprit, hint count, reviewed count, completion, or score.
- Public routes use explicit projection functions and cannot return private solution/relevance fields.
- The guest cookie is HTTP-only and signed with a server secret; production requires HTTPS and `Secure` cookies.

