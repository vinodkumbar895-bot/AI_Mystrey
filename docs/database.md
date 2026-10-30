# Database model

`Case` contains player-visible public data and the separately nested server-only canonical solution. Its schema uses strict subdocuments and a generation status. API projection functions are the only way to produce player data.

`Investigation` records a case, guest session ID, status, reviewed evidence IDs, hint count, accusation, and result. A compound case/session index supports safe guest resumption. Evidence reviews use set semantics, and accusation updates require `status: in_progress` with no existing accusation.

`Asset` generation is not enabled in the MVP. The evidence schema supports validated optional asset URLs, while placeholder illustrations and simulated evidence copy keep the workflow playable.

