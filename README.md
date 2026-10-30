# AI Mystery Room

An AI-powered fictional investigation game. Create a case from a scenario, inspect evidence, and make one final accusation. The server owns the canonical solution and computes the result and score.

## Requirements

- Node.js 20 or newer and npm
- MongoDB (local or Atlas)
- A Google Gemini API key for personalized case generation

## Setup

1. Start a local MongoDB server, or provision MongoDB Atlas and use its connection URI.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `SESSION_SECRET`, and `GEMINI_API_KEY`.
3. Install dependencies from the repository root with `npm install`.
4. Start both applications with `npm run dev`.
5. Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

The API health route remains available without a Gemini key. Case generation returns a friendly configuration error until a key is configured. Images and video use labeled text/illustration fallbacks; Gemini text generation does not imply image or video generation.

## Useful commands

- `npm run dev` — start client and API in development
- `npm run build` — build both applications
- `npm run typecheck` — run TypeScript checks
- `npm run lint` — run ESLint
- `npm run format` — format source and project documentation

## Configuration

See `server/.env.example`. Never put server credentials in `client/.env` or a `VITE_` variable. In production, configure `CLIENT_ORIGIN`, `SESSION_SECRET`, and HTTPS so the session cookie is secure.

## MVP behavior

Guest ownership is maintained by a signed, HTTP-only session cookie. A guest can start an investigation for a generated case, review evidence, request up to three progressive hints, and submit one accusation. The public case DTO omits the hidden solution and private evidence annotations. Results become available only after a valid accusation.

All generated cases and evidence are fictional. Simulated records are labeled in the interface. This first version does not provide actual image/video generation, accounts, multiplayer, or public case sharing.

## Project documents

- `spec.md` — authoritative requirements
- `docs/implementation-plan.md` — phased implementation and file map
- `docs/architecture.md` — application boundaries and security model
- `docs/api.md` — API routes
- `docs/database.md` — persistence model

