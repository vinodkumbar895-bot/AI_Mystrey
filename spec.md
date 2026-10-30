# AI MYSTERY ROOM

## Master Project Specification — Single Source of Truth

**Project Name:** AI Mystery Room
**Project Type:** AI-Powered Interactive Mystery Investigation Web Application
**Development Methodology:** Spec-Driven Development (SDD)
**Difficulty:** Medium–Advanced
**Target Users:** Mystery enthusiasts, students, puzzle solvers, and casual gamers
**Primary Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
**AI Provider:** Google Gemini API
**Document Version:** 1.0.0
**Specification Status:** Initial Development Specification

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive investigation platform that transforms a user's short story, scenario, or mystery idea into a complete fictional detective investigation.

The user provides a scenario, such as a theft at a museum, a missing artifact, a suspicious office incident, or a fictional murder mystery. The backend uses Google Gemini to generate a structured investigation containing suspects, motives, timelines, evidence, witness statements, and a hidden culprit.

The website then presents the investigation as an interactive mystery room.

Users investigate the case by examining AI-generated evidence, including fictional chat messages, images, surveillance footage descriptions, witness interviews, forensic reports, and other clues.

After reviewing the available evidence, the user selects a suspect and submits a final accusation.

The system evaluates the accusation against the original hidden solution and reveals whether the user solved the mystery. It then provides an explanation connecting the evidence to the culprit.

**Core principle:** The AI creates the mystery, but the backend maintains a consistent, authoritative solution against which the user's answer is evaluated.

## 1.2 Problem Statement

Traditional mystery games often provide fixed stories with limited replayability. Creating unique investigations manually requires significant time and effort.

AI Mystery Room addresses this problem by generating personalized, interactive investigations from user-provided scenarios.

Each generated investigation should provide:

* A unique fictional case.
* Multiple plausible suspects.
* A consistent event timeline.
* Evidence that can be examined interactively.
* Meaningful clues and red herrings.
* A hidden culprit with a logical motive.
* A fair accusation and scoring system.
* An explanation of the solution after the investigation.

## 1.3 Project Goals

1. Allow users to create mysteries from their own ideas.
2. Generate logically consistent investigations using Gemini.
3. Present evidence through an immersive detective-style interface.
4. Allow users to inspect clues and compare suspect statements.
5. Support evidence types such as messages, images, CCTV descriptions, and reports.
6. Provide an interactive suspect selection and accusation workflow.
7. Evaluate answers against a fixed solution.
8. Track investigation progress and results.
9. Support multiple difficulty levels.
10. Generate different mysteries for different scenarios.
11. Protect API keys and prevent users from accessing hidden solutions before submitting an accusation.
12. Provide a responsive experience on desktop, tablet, and mobile.

## 1.4 Non-Goals

The initial version will not include:

* Real-world criminal investigations.
* Real police, government, or law-enforcement integrations.
* Real WhatsApp account integrations.
* Access to actual CCTV systems.
* Real-time surveillance.
* Multiplayer investigations.
* User-created public mystery marketplaces.
* Voice-based interrogation.
* Paid subscriptions or payment processing.
* User-uploaded video analysis as a mandatory feature.

These features may be considered in later versions.

---

# 2. PRODUCT VISION

## 2.1 User Experience

The application should feel like a digital detective workspace.

The user should be able to:

* Create a mystery.
* Enter an investigation room.
* Review a case briefing.
* Browse suspects.
* Open evidence files.
* Read fictional chat conversations.
* Examine generated images.
* Review CCTV clips or simulated surveillance records.
* Build a theory.
* Accuse a suspect.
* Discover the truth.
* Review the final explanation and score.

The interface should prioritize investigation and reasoning rather than excessive animations.

## 2.2 Example User Scenario

A user enters the following scenario:

"An expensive diamond disappeared from a private museum during a charity event. Three employees and one visitor had access to the exhibition room."

The backend generates a fictional investigation containing:

**Case:** The Missing Diamond

**Suspects:**

1. Alex — Museum security guard.
2. Maya — Exhibition curator.
3. Ryan — Maintenance technician.
4. Sophia — Private collector.

**Evidence:**

* A security log showing an unusual access event.
* A fictional chat conversation about the exhibition schedule.
* A CCTV incident report.
* A witness statement.
* An inventory discrepancy report.
* A photograph of the display case.

**Hidden solution:**
One suspect stole the diamond using a specific opportunity and method.

The solution is stored securely on the backend. The user initially sees only the case briefing, suspects, and evidence.

After examining the evidence, the user selects a suspect and submits an accusation.

The server evaluates the selection and reveals the solution with a logical explanation.

**Important:** These names and events are illustrative. Gemini must generate the actual case content dynamically.

---

# 3. TARGET USERS AND ROLES

## 3.1 Guest User

A guest can:

* Open the website.
* Read the introduction.
* Create a mystery.
* Investigate a generated case.
* Submit an accusation.
* View the result.

Guest sessions should be associated with a server-issued session identifier.

The first version does not require user registration.

## 3.2 Registered User — Future Feature

A later version may support:

* Email registration.
* Login and logout.
* Personal investigation history.
* Saved cases.
* User profiles.
* Statistics and achievements.

Authentication is not required for the initial MVP.

## 3.3 Administrator — Future Feature

An administrative dashboard may eventually support:

* Usage monitoring.
* AI generation error tracking.
* Abuse prevention.
* Mystery quality review.
* System configuration.

It is not required for the initial MVP.

---

# 4. FUNCTIONAL REQUIREMENTS

Requirements are assigned identifiers so that implementation and testing can reference them.

## FR-001: Landing Page

The application must provide a polished landing page containing:

* Application name and logo.
* A short description.
* A primary "Create Mystery" button.
* An explanation of how the game works.
* Mystery category examples.
* Difficulty level descriptions.
* A preview of the investigation interface.
* A footer containing basic application information.

The primary action must navigate to the mystery creation page.

## FR-002: Mystery Creation

Users must be able to create a mystery by entering:

| Field              | Type     | Requirement                          |
| ------------------ | -------- | ------------------------------------ |
| Scenario           | Textarea | Required                             |
| Mystery title      | Text     | Optional; may be generated           |
| Category           | Select   | Required                             |
| Difficulty         | Select   | Required                             |
| Number of suspects | Select   | Configurable within supported limits |
| Evidence count     | Select   | Configurable within supported limits |
| Investigation tone | Select   | Optional                             |

Supported initial categories:

* Theft.
* Missing object.
* Disappearance.
* Workplace mystery.
* Museum mystery.
* Locked-room mystery.
* Cyber mystery.
* General fictional mystery.

Supported difficulty levels:

* Easy.
* Medium.
* Hard.

Default values:

* Category: General mystery.
* Difficulty: Medium.
* Suspects: 4.
* Evidence items: 8.
* Investigation tone: Realistic fictional detective story.

Validation:

* Scenario is required.
* Scenario must contain at least 30 characters.
* Scenario must not exceed 2,000 characters.
* Numeric selections must fall within configured limits.
* The frontend and backend must enforce the same constraints.
* Invalid requests must return actionable validation errors.

The backend must treat all scenario text as untrusted user input.

## FR-003: AI Mystery Generation

When the user submits a valid scenario, the backend must generate a complete investigation using Gemini.

The generated investigation must include:

1. Case metadata.
2. Case briefing.
3. Incident description.
4. A list of suspects.
5. Suspect profiles.
6. Motives and opportunities.
7. A chronological event timeline.
8. Evidence items.
9. Witness statements.
10. A hidden culprit.
11. A detailed solution explanation.
12. A logical relationship between the evidence and the culprit.
13. Optional hints.
14. A scoring rubric.

The AI output must be structured JSON that conforms to a defined schema.

The backend must validate the generated JSON before storing or publishing the case.

If Gemini returns invalid JSON, the backend should attempt a bounded repair or regeneration.

If generation fails after the configured retries, the application must show a friendly error and allow the user to try again.

A failed generation must not produce a playable case containing an unknown or missing solution.

## FR-004: Investigation Room

Each successful mystery generation must create a dedicated investigation room.

The room should contain:

* Case title.
* Case ID.
* Case briefing.
* Incident summary.
* Suspect list.
* Evidence library.
* Investigation progress.
* Optional hints.
* An accusation panel.
* A final submission button.

The user must be able to navigate between suspects and evidence without losing investigation progress.

The interface must display a clear distinction between:

* Confirmed facts.
* Suspect statements.
* Unverified claims.
* AI-generated fictional evidence.

## FR-005: Suspect Management

Each suspect must contain:

* Unique suspect ID.
* Name.
* Age, when appropriate.
* Occupation or role.
* Brief background.
* Relationship to the incident.
* Publicly visible motive or possible motive.
* Alibi or account of events.
* Personality description.
* A generated portrait or placeholder image.
* A list of evidence references associated with the suspect.

At least three suspects must be generated.

The selected suspect must not be identifiable as the culprit merely from visual styling, ordering, labels, or frontend metadata.

All suspects should appear plausible until the evidence is evaluated.

The interface must not visually mark the actual culprit before the user submits an accusation.

## FR-006: Evidence Library

The investigation room must provide a collection of fictional evidence items.

Supported evidence types:

| Evidence Type     | Description                                            |
| ----------------- | ------------------------------------------------------ |
| Chat Messages     | Fictional conversations presented as chat bubbles      |
| Image             | AI-generated image related to the incident             |
| CCTV Record       | Simulated surveillance footage or incident description |
| Witness Statement | Written account from a witness                         |
| Security Log      | Fictional access or activity record                    |
| Document          | Report, receipt, letter, or file                       |
| Forensic Report   | Fictional analytical report                            |
| Audio Transcript  | Written transcript of a fictional recording            |
| Timeline Event    | A specific event at a particular time                  |

Each evidence item must contain:

* Unique ID.
* Title.
* Type.
* Description.
* Timestamp, where applicable.
* Source or origin.
* Associated suspects.
* Evidence content.
* Relevance explanation stored privately.
* Optional asset URL.
* Optional thumbnail URL.
* Display order.

The evidence list should support:

* Filtering by evidence type.
* Searching by title or content.
* Opening individual evidence details.
* Returning to the evidence list.
* Marking an item as reviewed.
* Viewing related suspects.

The frontend must receive only the evidence fields required for the current stage of the investigation.

Private solution explanations and culprit-revealing metadata must never be sent in ordinary investigation responses.

## FR-007: AI-Generated Evidence Assets

Gemini will generate text-based evidence and asset-generation instructions.

The application must support the following initial implementation strategy:

**Chat messages**

* Generate fictional message participants.
* Generate timestamps.
* Generate message text.
* Render conversations in a messaging-style interface.
* Label the conversation as fictional.

**Images**

* Generate a detailed image prompt through Gemini.
* Pass the prompt to a configured image-generation provider.
* Store the generated image in an approved storage service.
* Save its asset URL and metadata in MongoDB.

**CCTV**

* Generate a fictional surveillance report.
* Include a timestamp, camera location, observed events, and uncertainty where appropriate.
* Display it as a surveillance record.
* Optionally support a generated video clip through a separate provider.

**Documents**

* Generate structured fictional reports.
* Render them as readable document previews.

**Important provider distinction:**
Gemini text generation does not automatically mean that the application can generate every image or video asset. The implementation must use an explicitly configured provider for each supported media type.

The MVP must work even when image or video generation is unavailable.

In that situation, the system should display:

* A text-based evidence representation.
* A generated scene description.
* A placeholder illustration.
* A clear indication that the media is simulated.

No image or video provider API key may be exposed to the browser.

## FR-008: Evidence Investigation

Users must be able to investigate evidence in any order.

The system must:

* Record which evidence items have been reviewed.
* Preserve progress while navigating the room.
* Display relevant associated suspects.
* Support optional hint requests.
* Prevent duplicate evidence review records from inflating scores.
* Track evidence-related actions for the final result.

The application must not require users to inspect every evidence item before accusing a suspect unless a future difficulty configuration explicitly enables that restriction.

## FR-009: Hint System

The application may provide progressive hints.

Hint levels:

* Hint 1: Broad investigative direction.
* Hint 2: A clue connecting evidence to an event.
* Hint 3: A stronger clue that narrows the possible suspects.

Hints must not immediately reveal the culprit unless the user requests the solution.

Hints should be based on the canonical investigation data.

Hint generation must not alter the hidden culprit or original evidence.

The system must track how many hints were used.

## FR-010: Accusation System

The user must be able to select a suspect and submit an accusation.

The accusation form must contain:

* A list of suspects.
* A required suspect selection.
* An optional explanation of the user's reasoning.
* A confirmation action.

Before submission, the UI should remind the user that a final accusation may reveal the solution and end the current attempt.

For the MVP, each case allows one final accusation.

After submission:

* The backend validates the suspect ID.
* The backend retrieves the authoritative solution.
* The backend evaluates the accusation.
* The backend records the result.
* The backend returns the result and solution explanation.
* The investigation enters a completed state.

The user must not be able to change the final answer through a direct frontend state modification.

## FR-011: Result and Explanation

The result page must display:

* Correct or incorrect result.
* Selected suspect.
* Actual culprit.
* Final explanation.
* Key evidence supporting the solution.
* Contradictions or inconsistencies in other suspects' accounts.
* A summary of the investigation.
* Score and performance feedback.
* Option to return to the homepage.
* Option to create another mystery.

The result must be evaluated against the stored canonical culprit ID.

Gemini may help generate a human-readable explanation, but it must not independently determine whether the accusation is correct.

If explanation generation fails, the backend must use the stored solution explanation.

## FR-012: Investigation Progress

The backend must track:

* Case creation.
* Investigation start.
* Evidence reviewed.
* Hints requested.
* Accusation submission.
* Investigation completion.

The frontend should display progress such as:

* Evidence reviewed: 5/8.
* Hints used: 1.
* Investigation status: In Progress.

Progress information must be consistent with backend records.

## FR-013: Scoring System

The MVP must implement a deterministic scoring system.

Suggested maximum score: 100 points.

| Component          | Maximum Points |
| ------------------ | -------------: |
| Correct accusation |             60 |
| Evidence coverage  |             25 |
| Hint efficiency    |             15 |
| Total              |            100 |

Rules:

* Correct accusation: 60 points.
* Incorrect accusation: 0 points for the accusation component.
* Evidence coverage: 25 points multiplied by the fraction of unique evidence items reviewed.
* Hint efficiency: 15 points if no hints are used, 10 points for one hint, 5 points for two hints, and 0 points for three or more hints.

The final score is the sum of the three components, rounded down to the nearest whole number.

Example:

A user identifies the correct culprit, reviews 6 of 8 evidence items, and uses one hint.

* Accusation: 60.
* Evidence: floor(25 × 6/8) = 18.
* Hints: 10.
* Total: 88/100.

The score must be calculated on the backend.

The scoring configuration should be centralized so it can be modified without changing multiple frontend components.

## FR-014: Error Handling

The application must handle:

* Invalid scenarios.
* Unsupported categories.
* Gemini API failures.
* Gemini rate limits.
* Invalid AI responses.
* Database connection failures.
* Missing case IDs.
* Expired sessions.
* Invalid evidence IDs.
* Invalid suspect IDs.
* Duplicate accusation requests.
* Asset-generation failures.
* Network interruptions.

All API errors must use a consistent response format.

The application must not expose:

* Stack traces.
* API keys.
* Database credentials.
* Internal prompts.
* Hidden solutions.
* Sensitive server configuration.

---

# 5. USER INTERFACE AND DESIGN SYSTEM

## 5.1 Design Direction

The interface should resemble a modern detective investigation dashboard.

Recommended style:

* Dark charcoal background.
* Deep navy panels.
* Muted gray borders.
* Warm amber highlights.
* Off-white text.
* Restrained red accents for warnings.
* Subtle shadows.
* Rounded panels.
* Readable typography.
* Consistent spacing.

The design should be immersive without becoming visually cluttered.

Avoid excessive animations, flashing effects, or distracting transitions.

## 5.2 Recommended Pages

### Page 1: Landing Page

Route: `/`

Components:

* Navigation bar.
* Hero section.
* Create Mystery button.
* Feature cards.
* How It Works section.
* Example investigation preview.
* Footer.

### Page 2: Create Mystery

Route: `/create`

Components:

* Scenario textarea.
* Category selector.
* Difficulty selector.
* Suspect count selector.
* Evidence count selector.
* Optional title input.
* Generate button.
* Validation messages.
* Generation status indicator.

The generate button must be disabled while the submission is being processed.

### Page 3: Generation Loading

Route: `/cases/:caseId/generating`

Components:

* Loading indicator.
* Current generation status.
* Friendly progress messages.
* Retry or return options when generation fails.

The application must not display fake numerical progress that implies actual backend completion if no such progress data exists.

### Page 4: Investigation Room

Route: `/cases/:caseId`

Recommended desktop layout:

**Left panel**

* Case summary.
* Investigation progress.
* Navigation tabs.

**Center panel**

* Selected evidence.
* Chat conversations.
* Documents.
* Images.
* CCTV records.

**Right panel**

* Suspect list.
* Suspect profile cards.
* Accusation button.

On mobile, these panels should become stacked sections or accessible tabs.

### Page 5: Final Accusation

This may be a modal or a dedicated route.

Components:

* Suspect selection.
* Optional reasoning textarea.
* Confirmation message.
* Submit accusation button.

### Page 6: Results

Route: `/cases/:caseId/result`

Components:

* Correct or incorrect indicator.
* Final score.
* Actual culprit.
* Solution explanation.
* Key evidence.
* Timeline reconstruction.
* Play Again / Create Another Mystery buttons.

The result page must remain unavailable until the accusation has been submitted or the case has otherwise reached a valid completed state.

## 5.3 UI States

Every page that fetches data must implement:

* Loading state.
* Success state.
* Empty state.
* Error state.
* Retry state where appropriate.

The interface must be keyboard-accessible and support visible focus indicators.

Text and interactive controls must have sufficient contrast.

---

# 6. TECHNICAL ARCHITECTURE

## 6.1 Technology Stack

### Frontend

* React.
* Vite.
* JavaScript or TypeScript; TypeScript is recommended.
* React Router.
* Tailwind CSS.
* Axios or native Fetch.
* Lucide React for icons.
* Zustand for shared state if needed.

### Backend

* Node.js.
* Express.js.
* TypeScript.
* MongoDB.
* Mongoose.
* Google Gemini API through the official Google Gen AI SDK.
* Zod for runtime validation.
* Helmet.
* CORS with explicit origin configuration.
* Express rate limiting.
* Centralized logging.

### Testing

* Vitest.
* React Testing Library.
* Supertest.
* Playwright for end-to-end tests.

### Storage

* MongoDB for cases and investigation progress.
* Object storage for generated image and video assets when enabled.
* Local temporary storage only for development where appropriate.

### Deployment

Recommended options:

* Frontend: Vercel or another static/frontend hosting provider.
* Backend: a Node.js-compatible hosting provider.
* Database: MongoDB Atlas.
* Media: a compatible object-storage service.

Provider selection may change without changing the core application architecture.

## 6.2 Architecture Overview

```text
┌─────────────────────────────┐
│         React Client        │
│                             │
│ Landing / Create / Room     │
│ Evidence / Accusation       │
│ Results / Progress          │
└──────────────┬──────────────┘
               │ HTTPS / JSON
               ▼
┌─────────────────────────────┐
│       Express Backend       │
│                             │
│ Routes and Controllers      │
│ Validation and Middleware   │
│ Investigation Services      │
│ Scoring and Access Control  │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌──────────────┐  ┌────────────────┐
│ MongoDB      │  │ Gemini Service │
│              │  │                │
│ Cases        │  │ Case Generation│
│ Evidence     │  │ Hint Generation│
│ Sessions     │  │ Explanations   │
│ Results      │  │ Structured JSON│
└──────────────┘  └────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Optional Media Provider     │
│                             │
│ Image Generation            │
│ Video Generation            │
│ Object Storage              │
└─────────────────────────────┘
```

## 6.3 Backend Responsibilities

The backend is the authority for:

* Mystery generation.
* Case validation.
* Suspect and evidence persistence.
* Investigation sessions.
* Evidence review tracking.
* Hint requests.
* Accusation evaluation.
* Score calculation.
* Solution access control.
* Asset references.
* Error handling.
* Rate limiting.

The frontend must never determine the authoritative culprit or score.

## 6.4 AI Service Separation

Implement a dedicated Gemini service module.

Suggested responsibilities:

```text
generateMystery()
validateMystery()
repairMysteryOutput()
generateHint()
generateResultExplanation()
generateEvidenceAssetPrompt()
```

These functions should be called through application services rather than directly from Express route handlers.

All Gemini requests must be made on the backend.

The model identifier must be configurable through environment variables rather than hard-coded throughout the application.

---

# 7. MYSTERY GENERATION ENGINE

## 7.1 Generation Pipeline

The backend must implement the following process:

1. Validate the incoming scenario.
2. Normalize the category and difficulty.
3. Create a generation job or record.
4. Construct the Gemini generation prompt.
5. Request structured mystery data.
6. Parse the response.
7. Validate it against the mystery schema.
8. Verify internal references and consistency.
9. Check the culprit and solution fields.
10. Validate evidence relationships.
11. Perform a bounded repair or regeneration if necessary.
12. Store the canonical mystery.
13. Publish only the player-visible fields.
14. Mark the case as ready for investigation.

If any critical validation step fails, the case must not become playable.

## 7.2 Required Mystery Data Structure

The following is a conceptual TypeScript model. Codex must implement the final runtime schema and TypeScript types consistently.

```ts
type Difficulty = "easy" | "medium" | "hard";

type EvidenceType =
  | "chat"
  | "image"
  | "cctv"
  | "witness_statement"
  | "security_log"
  | "document"
  | "forensic_report"
  | "audio_transcript"
  | "timeline_event";

interface Suspect {
  id: string;
  name: string;
  occupation: string;
  background: string;
  motive: string;
  alibi: string;
  personality: string;
  portraitAssetId?: string;
}

interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  description: string;
  content: Record<string, unknown>;
  source: string;
  timestamp?: string;
  associatedSuspectIds: string[];
  assetId?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  description: string;
  involvedSuspectIds: string[];
  evidenceIds: string[];
}

interface HiddenSolution {
  culpritSuspectId: string;
  motive: string;
  method: string;
  opportunity: string;
  explanation: string;
  decisiveEvidenceIds: string[];
  suspectContradictions: Array<{
    suspectId: string;
    contradiction: string;
    supportingEvidenceIds: string[];
  }>;
}

interface MysteryCase {
  id: string;
  title: string;
  scenario: string;
  category: string;
  difficulty: Difficulty;
  briefing: string;
  suspects: Suspect[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  hints: string[];
  hiddenSolution: HiddenSolution;
  status: "generating" | "ready" | "failed";
  createdAt: string;
}
```

The hidden solution must be stored separately from player-visible case data, either in a separate MongoDB collection or in an appropriately protected private document.

The API response must use explicit DTOs that exclude hidden fields.

## 7.3 Mystery Quality Rules

Every generated mystery must satisfy these rules:

1. There must be exactly one canonical culprit.
2. The culprit must reference an existing suspect.
3. Every evidence ID must be unique within the case.
4. Every suspect reference must point to an existing suspect.
5. Timeline timestamps must be valid and chronologically sortable.
6. The solution must explain how the culprit committed the fictional act.
7. The evidence must support the solution.
8. At least two evidence items should materially help identify the culprit.
9. At least one plausible alternative suspect should exist.
10. Red herrings must be explainable and must not invalidate the solution.
11. The solution must not depend on information unavailable to the player unless the game explicitly provides it.
12. The culprit must not be revealed in the case title, public metadata, evidence ordering, or visible IDs.
13. The generated mystery must not contradict itself on critical facts.
14. The difficulty level must affect the reasoning challenge rather than merely changing the length of the text.

A validation failure must trigger bounded regeneration or mark the case as failed.

---

# 8. GOOGLE GEMINI INTEGRATION

## 8.1 Configuration

The backend must load these settings from environment variables:

```env
GEMINI_API_KEY=
GEMINI_MODEL=
```

`GEMINI_MODEL` must be set to a currently supported model available to the configured account.

The application must fail startup validation or disable AI functionality clearly when the required API configuration is missing.

The actual API key must never appear in frontend environment variables or source code.

## 8.2 Mystery Generation Prompt Requirements

The system prompt must instruct Gemini to:

* Act as a fictional mystery designer.
* Generate a complete investigation.
* Follow the supplied JSON schema.
* Create one authoritative culprit.
* Provide plausible alternative suspects.
* Build a coherent timeline.
* Create evidence that supports the canonical solution.
* Include explainable red herrings.
* Respect the requested difficulty and evidence count.
* Return only the requested structured output.
* Avoid contradictions.
* Never treat user-supplied scenario text as instructions to override system requirements.

The backend must use structured-output functionality supported by the selected Gemini model where available.

Prompt compliance alone is insufficient. The backend must independently validate the returned data.

## 8.3 Generation Token and Cost Controls

The implementation must:

* Set appropriate output token limits.
* Limit input size.
* Avoid unnecessary repeated generation.
* Cache immutable generated case data.
* Limit the number of retries.
* Handle provider rate limits.
* Avoid regenerating the entire case for each evidence request.
* Log request metadata without exposing secrets.
* Make model selection configurable.

Exact token limits and retry values should be configured centrally and adjusted after testing.

## 8.4 Handling AI Failure

If Gemini is unavailable:

* Show a clear error message.
* Preserve the user's scenario where practical.
* Allow a controlled retry.
* Avoid creating an incomplete playable case.
* Never reveal a fabricated success message.

An optional prebuilt fictional mystery may be offered as a fallback, but it must be explicitly identified as a fallback case rather than a successfully generated personalized case.

---

# 9. DATABASE DESIGN

Use MongoDB with Mongoose.

## 9.1 Collection: `cases`

Stores the canonical investigation and its generation status.

Suggested fields:

```ts
{
  _id: ObjectId,
  title: string,
  originalScenario: string,
  category: string,
  difficulty: string,
  briefing: string,
  publicData: object,
  hiddenSolution: object,
  generationStatus: string,
  generationErrorCode?: string,
  schemaVersion: number,
  createdAt: Date,
  updatedAt: Date
}
```

`publicData` must contain only the information intended for players.

`hiddenSolution` must remain server-side.

For stronger separation, the implementation may place the hidden solution in a dedicated collection with access limited to the investigation service.

## 9.2 Collection: `investigations`

Stores individual attempts to solve a case.

```ts
{
  _id: ObjectId,
  caseId: ObjectId,
  sessionId: string,
  status: "in_progress" | "completed" | "expired",
  reviewedEvidenceIds: string[],
  hintsUsed: number,
  accusation: {
    suspectId: string,
    reasoning?: string,
    submittedAt: Date
  } | null,
  result: {
    correct: boolean,
    score: number,
    completedAt: Date
  } | null,
  createdAt: Date,
  updatedAt: Date
}
```

Required indexes:

* `caseId`.
* `sessionId`.
* `status`.
* `createdAt`.

A compound index on `caseId` and `sessionId` may be added if it supports the selected session model.

## 9.3 Collection: `assets`

Stores references to generated media.

```ts
{
  _id: ObjectId,
  caseId: ObjectId,
  evidenceId?: string,
  type: "image" | "video" | "document",
  provider: string,
  storageKey: string,
  publicUrl?: string,
  mimeType?: string,
  generationStatus: "pending" | "ready" | "failed",
  createdAt: Date
}
```

Avoid storing large binary media directly inside ordinary case documents.

## 9.4 Data Integrity

The application must:

* Validate all IDs.
* Validate references between cases, suspects, and evidence.
* Avoid persisting invalid AI output.
* Use atomic updates where needed.
* Prevent duplicate final accusations.
* Handle deleted or expired records gracefully.
* Avoid accepting user-provided fields for authoritative result data.

---

# 10. API SPECIFICATION

Base path:

`/api/v1`

All API responses must use JSON.

## 10.1 Standard Success Response

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## 10.2 Standard Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid mystery scenario.",
    "details": []
  }
}
```

Do not expose internal exception messages in production.

## 10.3 Create Mystery

**POST** `/api/v1/cases`

Request:

```json
{
  "scenario": "A diamond disappeared from a private museum.",
  "title": "The Missing Diamond",
  "category": "theft",
  "difficulty": "medium",
  "suspectCount": 4,
  "evidenceCount": 8,
  "tone": "detective"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "caseId": "CASE_ID",
    "status": "ready",
    "title": "The Missing Diamond",
    "investigationUrl": "/cases/CASE_ID"
  },
  "error": null
}
```

The response must never include the culprit ID or hidden solution.

For short MVP generation tasks, the endpoint may wait until generation completes.

If generation takes too long, use an asynchronous generation workflow.

## 10.4 Retrieve Case

**GET** `/api/v1/cases/:caseId`

Returns:

* Case title.
* Briefing.
* Category.
* Difficulty.
* Public suspects.
* Public evidence summaries.
* Timeline information appropriate for the current game design.
* Investigation status.

It must not return the hidden solution.

## 10.5 Retrieve Evidence

**GET** `/api/v1/cases/:caseId/evidence/:evidenceId`

Returns the requested evidence item, subject to access validation.

It must not return private relevance explanations or hidden-solution references.

## 10.6 Start Investigation

**POST** `/api/v1/cases/:caseId/investigations`

Creates a new investigation attempt.

Response:

```json
{
  "success": true,
  "data": {
    "investigationId": "INVESTIGATION_ID",
    "status": "in_progress"
  },
  "error": null
}
```

Repeated requests must be handled according to the selected session and idempotency rules.

## 10.7 Mark Evidence Reviewed

**POST** `/api/v1/investigations/:investigationId/evidence/:evidenceId/review`

Records that the evidence has been reviewed.

Repeated requests for the same evidence must not increase the reviewed count.

## 10.8 Request Hint

**POST** `/api/v1/investigations/:investigationId/hints`

Request:

```json
{
  "level": 1
}
```

The backend must:

* Validate the investigation.
* Validate the requested hint level.
* Enforce the maximum number of hints.
* Return a clue based on the canonical case.
* Update the hint counter exactly once per successful hint request.

The response must not include the hidden solution object.

## 10.9 Submit Accusation

**POST** `/api/v1/investigations/:investigationId/accusation`

Request:

```json
{
  "suspectId": "SUSPECT_ID",
  "reasoning": "The security log conflicts with the suspect's statement."
}
```

The backend must:

1. Validate the request.
2. Verify that the suspect belongs to the case.
3. Verify that the investigation is in progress.
4. Reject duplicate final submissions.
5. Compare the suspect ID with the canonical culprit ID.
6. Calculate the final score.
7. Save the completed result.
8. Return the result and solution explanation.

The endpoint must be idempotent for duplicate submissions where possible. Repeated requests must not create multiple scores or alter the original accusation.

## 10.10 Retrieve Result

**GET** `/api/v1/investigations/:investigationId/result`

Returns the result only if the investigation has been completed.

A result must not be available before a valid final accusation has been submitted.

## 10.11 Health Check

**GET** `/api/v1/health`

Returns a basic service health status without exposing secrets or infrastructure details.

---

# 11. SECURITY AND ANTI-CHEATING

Security is a core requirement because the mystery's solution must remain hidden until the game is completed.

## 11.1 Hidden Solution Protection

The backend must never send:

* `hiddenSolution`.
* `culpritSuspectId`.
* Private solution explanations.
* Secret evidence relevance annotations.
* Internal scoring metadata that reveals the culprit.
* Unnecessary Gemini generation prompts.

The frontend must not contain a copy of the answer.

The answer must not be embedded in:

* HTML.
* JavaScript bundles.
* Browser storage.
* Public API responses.
* Public asset metadata.
* URL query parameters.
* Client-side state.

The result must be computed by the backend.

## 11.2 Session Security

For guest sessions:

* Generate cryptographically secure session identifiers.
* Prefer server-managed sessions or signed tokens.
* Use secure, HTTP-only cookies when cookies are selected.
* Set `SameSite` appropriately.
* Use `Secure` cookies in production.
* Validate case and investigation ownership.
* Prevent arbitrary access to another user's private investigation.

If a cookie-based authentication/session model is used, implement suitable CSRF protection.

A case ID is an identifier, not proof of authorization.

## 11.3 API Security

Implement:

* Request validation.
* Rate limiting.
* CORS allowlisting.
* Security headers.
* Payload size limits.
* Safe database queries.
* Error sanitization.
* Session expiration.
* Abuse prevention for AI generation.

Never trust a submitted score, culprit ID, or investigation status from the client.

## 11.4 AI Prompt Injection

User scenarios and generated evidence are untrusted content.

The backend must:

* Separate system instructions from user scenario text.
* Treat scenario text as data.
* Validate structured AI output.
* Ignore instructions embedded in scenario text that attempt to override application rules.
* Prevent generated evidence from modifying the canonical solution.
* Never execute generated code or commands.
* Never treat AI-generated HTML as trusted executable content.

## 11.5 Fictional Content and Privacy

All cases must be explicitly fictional.

The application must not present generated evidence as authentic records from real people or real investigations.

The AI should avoid reproducing real personal contact details, credentials, or private conversations.

Generated chat messages and surveillance reports should be visibly labeled as simulated evidence.

---

# 12. FRONTEND ARCHITECTURE

Recommended directory structure:

```text
client/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── ErrorState.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── mystery/
│   │   │   ├── SuspectCard.tsx
│   │   │   ├── EvidenceCard.tsx
│   │   │   ├── EvidenceViewer.tsx
│   │   │   ├── ChatEvidence.tsx
│   │   │   ├── CCTVEvidence.tsx
│   │   │   ├── DocumentEvidence.tsx
│   │   │   ├── InvestigationProgress.tsx
│   │   │   └── AccusationPanel.tsx
│   │   └── ui/
│   ├── features/
│   │   ├── create-case/
│   │   ├── investigation/
│   │   └── results/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   └── validation.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CreateMysteryPage.tsx
│   │   ├── InvestigationPage.tsx
│   │   ├── AccusationPage.tsx
│   │   └── ResultPage.tsx
│   ├── types/
│   │   ├── case.ts
│   │   └── api.ts
│   ├── styles/
│   │   └── index.css
│   └── main.tsx
├── package.json
└── tsconfig.json
```

Codex may adjust the structure if necessary, but it must preserve clear separation of pages, reusable components, API logic, and domain types.

---

# 13. BACKEND ARCHITECTURE

Recommended directory structure:

```text
server/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── gemini.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── validateRequest.ts
│   │   └── session.ts
│   ├── modules/
│   │   ├── cases/
│   │   │   ├── case.model.ts
│   │   │   ├── case.routes.ts
│   │   │   ├── case.controller.ts
│   │   │   ├── case.service.ts
│   │   │   └── case.schema.ts
│   │   ├── investigations/
│   │   │   ├── investigation.model.ts
│   │   │   ├── investigation.routes.ts
│   │   │   ├── investigation.controller.ts
│   │   │   ├── investigation.service.ts
│   │   │   └── investigation.schema.ts
│   │   └── assets/
│   ├── services/
│   │   ├── gemini.service.ts
│   │   ├── mysteryGenerator.service.ts
│   │   ├── mysteryValidator.service.ts
│   │   ├── hint.service.ts
│   │   ├── scoring.service.ts
│   │   └── assetGeneration.service.ts
│   ├── schemas/
│   │   ├── mystery.schema.ts
│   │   └── api.schema.ts
│   ├── utils/
│   │   ├── errors.ts
│   │   ├── logger.ts
│   │   └── ids.ts
│   └── types/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── package.json
├── tsconfig.json
└── .env.example
```

The backend must use a consistent error-handling pattern and validate configuration before accepting requests.

---

# 14. ROOT PROJECT STRUCTURE

The repository should use a monorepo structure:

```text
ai-mystery-room/
├── SPEC.md
├── README.md
├── AGENTS.md
├── .gitignore
├── package.json
├── client/
├── server/
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── decisions/
└── .github/
    └── workflows/
```

`SPEC.md` is the authoritative product specification.

`AGENTS.md` contains repository-specific instructions for Codex.

`README.md` contains setup, installation, development, and deployment instructions.

Supporting documents may explain the specification but must not silently contradict it.

If a requirement changes, update `SPEC.md` first and then update the implementation and related tests.

---

# 15. ENVIRONMENT VARIABLES

The repository must include `.env.example` files.

Example backend configuration:

```env
NODE_ENV=development
PORT=5000

CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=
GEMINI_MODEL=

SESSION_SECRET=

ASSET_PROVIDER=placeholder
ASSET_STORAGE_BUCKET=
ASSET_STORAGE_ACCESS_KEY=
ASSET_STORAGE_SECRET_KEY=
ASSET_PUBLIC_BASE_URL=

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=30

MAX_SCENARIO_LENGTH=2000
MAX_SUSPECTS=6
MAX_EVIDENCE_ITEMS=12
```

These values are examples, not mandatory production values.

The final configuration must:

* Validate required environment variables.
* Fail safely when critical secrets are missing.
* Avoid printing secret values.
* Keep development and production settings separate.
* Never commit `.env` files containing real credentials.

Any variable not needed by the chosen implementation should be removed rather than left as a misleading configuration option.

---

# 16. PERFORMANCE AND RELIABILITY

The application should:

* Keep the frontend responsive while a mystery is generated.
* Avoid repeated generation requests caused by double-clicks.
* Use database indexes for frequently queried fields.
* Paginate any future history endpoints.
* Avoid sending the entire case repeatedly when only one evidence item is needed.
* Use caching for immutable public case data where safe.
* Apply request timeouts.
* Limit expensive AI operations.
* Avoid generating all images or videos synchronously.
* Provide clear recovery options when an operation fails.

For longer generation tasks, the architecture should support asynchronous jobs.

The MVP may begin with synchronous generation if generation times remain acceptable.

If asynchronous generation is implemented, use a queue such as BullMQ with Redis only when required; Redis is not mandatory for the initial synchronous MVP.

---

# 17. ACCESSIBILITY AND RESPONSIVENESS

The application must:

* Work on desktop, tablet, and mobile.
* Use semantic HTML.
* Provide keyboard navigation.
* Show visible focus indicators.
* Label form controls.
* Include meaningful alternative text for informative images.
* Avoid communicating status through color alone.
* Respect reduced-motion preferences.
* Display useful error messages.
* Maintain readable text sizes.
* Prevent horizontal overflow on small screens.

The investigation room must remain usable on narrow mobile screens without hiding essential actions.

---

# 18. TESTING REQUIREMENTS

Testing must cover core logic, API behavior, security, and the full investigation workflow.

## 18.1 Unit Tests

Required unit tests:

* Scenario validation.
* Mystery schema validation.
* Unique suspect ID validation.
* Evidence reference validation.
* Timeline validation.
* Culprit existence validation.
* Scoring calculation.
* Hint counting.
* Duplicate evidence review handling.
* Accusation evaluation.
* Private solution filtering.

## 18.2 Integration Tests

Required integration tests:

* Create a valid mystery.
* Reject an invalid scenario.
* Handle malformed Gemini output.
* Handle Gemini API failure.
* Persist a valid case.
* Retrieve a public case without hidden fields.
* Start an investigation.
* Mark evidence reviewed.
* Request a hint.
* Submit a correct accusation.
* Submit an incorrect accusation.
* Reject an invalid suspect ID.
* Reject a second accusation.
* Prevent results from being retrieved before completion.
* Handle a missing case.
* Handle a missing investigation.

## 18.3 End-to-End Tests

The complete user journey must work:

1. Open the landing page.
2. Click Create Mystery.
3. Enter a scenario.
4. Select difficulty and other settings.
5. Generate the case.
6. Open the investigation room.
7. Review evidence.
8. View suspects.
9. Request an optional hint.
10. Submit an accusation.
11. View the result.
12. Verify the score and explanation.

At least one test must verify that the actual culprit is not present in the public case API response.

## 18.4 Acceptance Criteria

The MVP is acceptable when:

* A user can generate a playable mystery from a valid scenario.
* Every playable mystery has one valid canonical culprit.
* The case contains at least three suspects.
* Evidence references are valid.
* The investigation room renders all supported evidence types.
* Evidence review progress persists.
* Hints do not modify the canonical solution.
* The user can submit one final accusation.
* Correct and incorrect accusations are evaluated properly.
* Scores are calculated by the backend.
* The solution is unavailable before the accusation.
* Gemini failures do not create broken playable cases.
* The interface works on desktop and mobile.
* All required tests pass.
* Setup instructions are documented.

---

# 19. IMPLEMENTATION PHASES

Codex must implement the application incrementally rather than generating the entire application in one unverified step.

## Phase 1: Project Foundation

Tasks:

* Initialize the monorepo.
* Set up React and Vite.
* Set up Express and TypeScript.
* Configure Tailwind CSS.
* Configure MongoDB and Mongoose.
* Add environment validation.
* Add a health endpoint.
* Add linting and formatting.
* Create the base README.

Completion criteria:

* Frontend starts.
* Backend starts.
* Database connection works.
* Health endpoint responds.
* No secrets are committed.

## Phase 2: UI Foundation

Tasks:

* Build the landing page.
* Build the create-mystery form.
* Establish the design system.
* Add responsive navigation.
* Add reusable UI components.
* Add loading, empty, and error states.

Completion criteria:

* Pages are navigable.
* Forms validate correctly.
* Layout works on desktop and mobile.

## Phase 3: Mystery Generation

Tasks:

* Integrate Gemini.
* Define the mystery schema.
* Implement structured generation.
* Implement schema validation.
* Implement bounded retry handling.
* Persist canonical mysteries.
* Create the public case DTO.

Completion criteria:

* Valid scenarios create playable mysteries.
* Invalid AI output is rejected.
* Hidden solution data is never returned through public endpoints.

## Phase 4: Investigation Room

Tasks:

* Build suspect cards.
* Build the evidence library.
* Build evidence detail viewers.
* Add filters and search.
* Add progress tracking.
* Add evidence review persistence.

Completion criteria:

* Users can explore the case and evidence.
* Reviewed evidence remains reviewed after refresh.

## Phase 5: Hints and Accusation

Tasks:

* Implement hint requests.
* Implement accusation form.
* Implement server-side answer validation.
* Implement one-attempt enforcement.
* Implement scoring.
* Implement result generation.

Completion criteria:

* Accusations are evaluated correctly.
* Duplicate submissions are rejected safely.
* Scores match the specification.

## Phase 6: Media Support

Tasks:

* Implement image-generation provider abstraction.
* Add asset storage integration.
* Add generated image prompts.
* Add optional video provider integration.
* Add placeholders and fallbacks.

Completion criteria:

* The investigation remains playable when media generation is unavailable.
* Asset URLs and metadata are validated.
* Secrets remain on the server.

## Phase 7: Testing and Security

Tasks:

* Add unit tests.
* Add API integration tests.
* Add end-to-end tests.
* Verify hidden solution protection.
* Verify session ownership.
* Verify rate limiting.
* Verify error handling.

Completion criteria:

* Core workflows pass.
* Critical security requirements are verified.
* No known critical defect remains in the tested MVP workflows.

## Phase 8: Deployment

Tasks:

* Configure production environment variables.
* Deploy frontend.
* Deploy backend.
* Configure MongoDB Atlas.
* Configure CORS and session settings.
* Configure asset storage if enabled.
* Verify production health checks.
* Document deployment and troubleshooting.

Completion criteria:

* The deployed application can generate and complete an investigation.
* Secrets are configured securely.
* Production error responses do not expose internal information.

---

# 20. SPEC-DRIVEN DEVELOPMENT RULES FOR CODEX

These rules govern all implementation work.

## Rule 1: Read the Specification First

Before writing code, read:

* `SPEC.md`
* `AGENTS.md`, if present.
* `README.md`
* Relevant architecture and API documents.

## Rule 2: Treat SPEC.md as the Source of Truth

Do not silently change:

* Product requirements.
* API contracts.
* Data models.
* Security rules.
* Scoring rules.
* Investigation workflow.
* Acceptance criteria.

If a change is necessary, explain why and update the specification before implementing it.

## Rule 3: Plan Before Implementation

Before starting a development phase:

1. Identify the applicable requirements.
2. List the files to create or modify.
3. Identify dependencies.
4. Identify edge cases.
5. Define the tests needed.
6. Confirm the phase's completion criteria.

For substantial changes, create a short implementation plan in `docs/`.

## Rule 4: Implement Small, Verifiable Changes

Work phase by phase.

Do not build the entire system in one giant code-generation step.

After each phase:

* Run the relevant tests.
* Check TypeScript compilation.
* Check linting.
* Verify the application starts.
* Fix regressions before proceeding.

## Rule 5: Maintain Shared Types and Contracts

Use explicit shared or mirrored DTO definitions.

The frontend and backend must agree on:

* API response shapes.
* Evidence types.
* Investigation status values.
* Suspect identifiers.
* Error codes.
* Scoring results.

Avoid `any` where a proper type can be defined.

Runtime validation is required even when TypeScript types exist.

## Rule 6: Never Trust the Client

The backend is authoritative for:

* The canonical culprit.
* Investigation ownership.
* Case completion.
* Reviewed evidence.
* Hint usage.
* Final scores.
* Accusation results.

Do not implement authoritative scoring or culprit evaluation solely in React.

## Rule 7: Keep AI Integration Isolated

Gemini calls must be isolated in service modules.

Controllers must not contain large AI prompts or duplicate provider logic.

All AI responses must be validated before persistence.

## Rule 8: Do Not Invent Missing Infrastructure

Do not assume:

* Image generation is included with text generation.
* Video generation is automatically available.
* A Redis instance exists.
* A storage bucket has been created.
* Environment variables are populated.
* A paid API plan is available.

Use explicit configuration, documented setup instructions, and working fallbacks.

## Rule 9: Document Deviations

If implementation differs from the specification:

* Identify the relevant requirement ID.
* Explain the technical reason.
* Document the deviation.
* Update `SPEC.md` when the change is approved.

Do not silently omit a required feature.

## Rule 10: Verify Before Declaring Completion

Never claim a phase is complete merely because code was written.

Run the relevant tests and report:

* What was implemented.
* Which requirements were addressed.
* Which tests were run.
* Which tests passed or failed.
* Any remaining limitations.
* Any required environment configuration.

---

# 21. DEFINITION OF DONE

A feature is complete only when:

1. Its requirements are implemented.
2. Its API and data contracts match the specification.
3. Its inputs are validated.
4. Its errors are handled.
5. Its security requirements are satisfied.
6. Relevant tests pass.
7. TypeScript compilation succeeds.
8. The implementation is documented where necessary.
9. No unrelated functionality has been broken.
10. Its acceptance criteria are demonstrably satisfied.

The project is complete when all mandatory MVP requirements pass their acceptance criteria.

Optional media generation, authentication, multiplayer, and administrative features must not block delivery of the core MVP.

---

# 22. FUTURE ENHANCEMENTS

Potential future features:

* User authentication.
* Personal case history.
* Mystery sharing.
* Community-created cases.
* Daily mystery challenges.
* Achievements and badges.
* Investigation notes.
* Interactive evidence boards.
* Evidence relationship graphs.
* AI-generated witness interrogation.
* Voice-based detective interactions.
* Generated surveillance videos.
* Image-based clue inspection.
* Multiplayer investigations.
* Competitive leaderboards.
* Custom scoring modes.
* Advanced difficulty levels.

These features are outside the MVP unless explicitly added to the specification.

---

# 23. FINAL PRODUCT REQUIREMENT

The final application must provide an end-to-end experience in which a user can submit a fictional scenario, receive a coherent AI-generated investigation, examine multiple forms of evidence, evaluate suspects, submit an accusation, and receive a logically explained result.

The implementation must prioritize:

1. Logical consistency of generated mysteries.
2. Protection of the hidden solution.
3. Correct server-side evaluation.
4. Reliable AI generation and validation.
5. Clear, immersive user experience.
6. Maintainable architecture.
7. Testability and reproducibility.
8. Secure configuration and deployment.

**Final authority:** `SPEC.md` is the single source of truth for product behavior. Codex must follow it when implementing, testing, reviewing, and extending AI Mystery Room.