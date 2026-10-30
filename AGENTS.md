# Repository instructions

- `spec.md` is the product source of truth. Read it before changing behavior.
- Keep culprit data and private evidence annotations on the server. Public API responses must use explicit DTOs.
- Validate all requests and AI output at runtime. Treat user scenarios and model output as untrusted data.
- Keep Gemini and persistence logic in services/models, not route handlers.
- Do not commit real secrets. Use `.env.example` for configuration documentation.
- Make changes in small steps and document any deviation from `spec.md`.

