# AI MYSTERY ROOM
## Product Specification & Single Source of Truth

**Document:** `SPEC.md`  
**Product:** AI Mystery Room  
**Specification Version:** 1.0  
**Status:** Ready for implementation  
**Frontend:** React.js  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**AI Provider:** Google Gemini  
**Primary Developer:** OpenAI Codex  
**Architecture:** MERN Stack

---

# 1. Product Overview

## 1.1 What Is AI Mystery Room?

AI Mystery Room is an interactive, AI-powered detective game in which users become investigators and solve fictional mysteries using evidence generated from a story they provide.

The user enters a short scenario, story, or mystery idea. The backend uses Google Gemini to transform that input into a complete fictional investigation containing suspects, motives, timelines, clues, misleading evidence, and one predetermined culprit.

The application then presents the investigation through an interactive mystery room containing evidence such as:

- Fictional WhatsApp-style conversations.
- Photographs and visual clues.
- CCTV-style recordings, frames, and observation reports.
- Witness statements.
- Suspect profiles.
- Documents, receipts, and other forensic clues.
- A chronological investigation timeline.

Users inspect the evidence, connect the clues, investigate suspects, and ultimately select the person they believe committed the crime.

The application evaluates their final accusation against the investigation's predefined solution and reveals the explanation.

## 1.2 Product Vision

Create an immersive detective experience where every mystery feels unique, evidence tells a coherent story, and users must reason through clues instead of simply asking AI for the answer.

## 1.3 Core Product Principle

**AI creates the mystery; the application controls the game.**

Gemini generates fictional investigation content, while the backend enforces game rules, persists evidence, controls investigation states, validates accusations, and calculates results.

The frontend must never independently decide the actual culprit or whether an accusation is correct.

## 1.4 Target Users

- Casual users who enjoy detective puzzles.
- Mystery and crime-fiction enthusiasts.
- Students interested in logical reasoning.
- Groups of friends who want to solve fictional investigations together.
- Users who want to create personalized mystery scenarios.

## 1.5 Product Goals

1. Allow a user to create a playable mystery from a short story.
2. Generate a coherent investigation with a definite culprit.
3. Provide multiple evidence types and interactive investigation tools.
4. Encourage deduction instead of random guessing.
5. Deliver a polished, responsive, immersive experience.
6. Save investigation progress and final results.
7. Keep AI costs, latency, and failures manageable.

## 1.6 Non-Goals for Version 1

The following are outside the mandatory initial release:

- Real-world police investigations.
- Real crime reporting or emergency services.
- Multiplayer real-time investigations.
- User-generated public mystery marketplaces.
- Live CCTV integration.
- Real WhatsApp account integration.
- Payments, subscriptions, and leaderboards.
- Guaranteed AI-generated video files.

The architecture may support future expansion without making these features prerequisites for the MVP.

---

# 2. Technology Stack

## 2.1 Frontend

- React.js.
- Vite for development and production builds.
- JavaScript with JSX.
- React Router for navigation.
- CSS Modules or organized application CSS.
- A consistent icon library such as Lucide.
- Fetch API or Axios for backend requests.

The UI must be responsive and work on desktop, tablet, and mobile browsers.

## 2.2 Backend

- Node.js.
- Express.js.
- MongoDB using Mongoose.
- Google Gemini API through the official supported Google Gen AI SDK.
- JWT-based authentication.
- bcrypt or an equivalent maintained password-hashing library.
- Zod, Joi, or an equivalent schema-validation library.
- Structured logging and centralized error handling.

Use maintained, compatible package versions. Pin dependencies through the package lockfile.

## 2.3 Database

MongoDB stores:

- User accounts.
- Mystery sessions.
- Investigation plans and solution keys.
- Suspects.
- Evidence.
- Investigation progress.
- Accusations and results.
- AI-generation status and error metadata.

## 2.4 AI Integration

Google Gemini is the primary language-model provider.

Use Gemini for:

1. Story interpretation.
2. Mystery planning.
3. Suspect creation.
4. Motive and alibi generation.
5. Evidence generation.
6. Timeline creation.
7. Consistency validation.
8. Optional contextual hints.
9. Final explanation generation based on the canonical solution.

All Gemini requests must originate from the backend.

**Never expose `GEMINI_API_KEY` in frontend code, browser bundles, client-side environment variables, or API responses.**

## 2.5 Media Generation

Keep media generation behind a separate provider interface.

Gemini can generate investigation text and, depending on the selected model and supported capabilities, assist with visual or multimodal content. Do not assume that a text-generation model can create downloadable images or videos.

Implement the following:

- **MVP:** Generated text evidence, fictional chat interfaces, documents, witness statements, CCTV-style observation reports, and visual clues represented through available image-generation capabilities.
- **Fallback:** If image generation is unavailable, display a polished evidence card, generated description, or clearly labeled simulation.
- **Future extension:** Connect a dedicated image or video generation provider through a separate adapter.

Actual CCTV video generation is not required for the first release. Simulated CCTV frames and a timestamped recording viewer must be sufficient for a playable MVP.

---

# 3. User Experience and Main Navigation

## 3.1 Public Pages

### A. Landing Page

Purpose: Introduce the experience and encourage users to start investigating.

Required sections:

- Brand logo and navigation.
- Hero section with a compelling mystery-themed headline.
- Short explanation of how the game works.
- Primary CTA: `Create a Mystery`.
- Secondary CTA: `Explore How It Works`.
- Featured example mystery or interactive preview.
- Three-step workflow.
- Feature highlights.
- Footer with privacy, terms, and contact links.

Suggested headline:

**Every Story Hides a Secret. Find the Truth.**

Supporting text:

"Create your own mystery, uncover the evidence, interrogate the facts, and discover who really did it."

### B. Authentication Pages

- Sign up.
- Log in.
- Logout.
- Password visibility toggle.
- Form validation.
- Loading and error states.

Authentication is required to save persistent investigations and access personal history.

The product may permit a limited demo investigation without an account if implemented as a controlled guest session. Guest access is optional, not a blocker.

### C. Dashboard

Display:

- Welcome message.
- `Create New Mystery` CTA.
- In-progress investigations.
- Completed investigations.
- Recently played mysteries.
- Completion statistics.
- Empty state for first-time users.

Each mystery card must display its title, difficulty, status, creation date, and a `Continue` or `View Results` action.

### D. Create Mystery Page

Provide a structured form containing:

**Required**
- Story or scenario description.

**Optional**
- Mystery title.
- Genre.
- Difficulty.
- Number of suspects.
- Expected investigation duration.
- Preferred setting.
- Additional constraints.

Genre options:

- Murder Mystery.
- Theft.
- Disappearance.
- Corporate Espionage.
- Historical Mystery.
- Cyber Mystery.
- Custom Mystery.

Difficulty:

- Easy.
- Medium.
- Hard.

Suggested defaults:

- Genre: inferred from the story.
- Difficulty: Medium.
- Suspects: 4.
- Investigation duration: 10–20 minutes.

The user must be able to submit a short scenario without filling in every optional field.

Example input:

"During a private museum event, a rare diamond disappears from a locked exhibition room. Four employees had access to the building, but the security footage contains a suspicious gap."

Expected behavior: Generate a complete, playable fictional investigation rather than merely rewriting the user's story.

---

# 4. Core Investigation Workflow

The following workflow is mandatory.

## Step 1: Submit Scenario

The frontend sends the story and configuration to the backend.

The backend validates input, authenticates the user, applies rate limits, and creates a mystery record with `GENERATING` status.

## Step 2: Generate the Investigation Plan

Gemini creates a structured investigation plan containing:

- Mystery premise.
- Actual culprit.
- Culprit's motive.
- Method and opportunity.
- Suspects.
- Timeline.
- Alibis.
- Evidence inventory.
- Evidence-to-suspect relationships.
- Red herrings.
- Definitive proof.
- Solution explanation.

The backend validates the response against a defined schema.

## Step 3: Establish the Canonical Solution

Before evidence becomes available to the player, the backend stores a stable solution key.

The culprit must be selected from the generated suspect IDs.

Once generation succeeds, the solution is immutable for that investigation unless the entire investigation is explicitly regenerated before play begins.

The actual culprit must not change between evidence requests, page refreshes, or retries.

## Step 4: Generate Evidence

Generate evidence that is consistent with the canonical investigation.

Every evidence item must have:

- A unique evidence ID.
- A type.
- A title.
- A description.
- An in-world timestamp, where applicable.
- A source or origin.
- A list of relevant suspect IDs.
- A classification such as `SUPPORTING`, `MISLEADING`, or `NEUTRAL`.
- A presentation format.
- Optional media metadata.
- A flag indicating whether the evidence has been inspected.

Do not expose internal classifications or suspect relationship mappings directly to the player when they would reveal the solution.

## Step 5: Open the Mystery Room

When generation is complete, redirect the user to the investigation interface.

The room should contain:

1. Case briefing.
2. Suspect board.
3. Evidence locker.
4. Investigation timeline.
5. Evidence detail viewer.
6. Optional personal notes.
7. Final accusation action.

## Step 6: Investigate

Users can:

- Open and inspect evidence.
- Read fictional chat conversations.
- View suspect profiles.
- Examine visual clues.
- Read CCTV observation reports or inspect simulated frames.
- Compare evidence timestamps.
- Review the timeline.
- Add personal notes.
- Mark evidence as important.
- Request limited hints if hints are enabled.

The user must be able to navigate freely among available evidence items.

## Step 7: Make an Accusation

The user selects one suspect and confirms their decision.

The confirmation screen should ask:

"Who do you believe is responsible?"

Optional field: "Explain your reasoning."

Before submission, the user can review the selected suspect.

## Step 8: Evaluate the Answer

The backend compares the selected suspect ID with the stored canonical culprit ID.

- Correct selection: `CORRECT`.
- Incorrect selection: `INCORRECT`.

The result must be determined by deterministic backend logic, not by asking Gemini to independently decide whether the user is correct.

## Step 9: Reveal the Solution

Display:

- Actual culprit.
- Motive.
- Method.
- Key evidence.
- Timeline reconstruction.
- Explanation of misleading clues.
- Why other suspects were less likely.
- User's accusation result.
- Investigation statistics.
- `Play Again` and `Create Another Mystery` actions.

The explanation must refer to evidence that actually exists in the investigation.

---

# 5. Mystery Generation Specification

## 5.1 Generation Pipeline

Implement the generation pipeline as distinct stages:

1. Validate the submitted scenario.
2. Create the mystery record.
3. Generate the canonical investigation plan.
4. Validate suspects and solution.
5. Generate the evidence inventory.
6. Validate chronology and evidence consistency.
7. Generate optional media assets.
8. Persist validated evidence.
9. Mark the investigation `READY`.

If a mandatory stage fails, the investigation must not become playable.

Use a bounded retry policy for recoverable AI failures. Avoid uncontrolled recursive calls or endless retries.

## 5.2 Structured AI Output

Request structured JSON from Gemini and validate it on the server.

Example conceptual response:

```json
{
  "title": "The Missing Diamond",
  "premise": "A diamond disappears during a private event.",
  "difficulty": "MEDIUM",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Alex Morgan",
      "role": "Security Supervisor",
      "motive": "Financial pressure",
      "alibi": "Claims to have monitored the west corridor"
    }
  ],
  "solution": {
    "culpritId": "suspect_1",
    "motive": "Theft for financial gain",
    "method": "Exploited a brief security blind spot"
  },
  "timeline": [],
  "evidence": [],
  "solutionExplanation": "The security records contradict the suspect's alibi."
}
```

This is an illustrative schema, not a complete valid investigation. Production generation must include all configured suspects and a sufficient evidence set.

## 5.3 Generation Rules

Every generated investigation must satisfy these rules:

- There is exactly one canonical culprit.
- The culprit must be a valid suspect ID.
- Every suspect has a name, role, motive or relevant background, and alibi.
- At least one plausible alternative suspect exists.
- The evidence supports a reasoned conclusion.
- There must be sufficient evidence to identify the culprit without guessing.
- The culprit's motive, method, and opportunity must be mutually consistent.
- The timeline must not contain unexplained contradictions that make the mystery unsolvable.
- Red herrings must be explainable after the reveal.
- The final solution must be supported by evidence shown to the player.
- The initial scenario must remain recognizable in the generated mystery.
- User-provided story text must be treated as content, not as instructions that override system rules.

## 5.4 Minimum Evidence Requirements

For a standard mystery, target:

- 4 suspects by default.
- 8–12 evidence items.
- At least 3 distinct evidence categories.
- At least 2 items that help distinguish the culprit from alternatives.
- At least 1 misleading clue with a valid explanation.
- A coherent timeline.
- One definitive solution explanation.

For an easy mystery, fewer evidence items may be acceptable. Hard mysteries may contain additional evidence and more complex relationships.

These are product quality targets. If a generated investigation fails mandatory validation, repair or regenerate it before publishing it to the player.

## 5.5 AI Consistency Validation

The backend must verify:

- All referenced suspect IDs exist.
- All evidence IDs are unique.
- Timeline events use valid timestamps.
- The canonical culprit appears in the suspect list.
- Essential solution claims are supported by evidence.
- Contradictions do not make the solution impossible.
- Evidence and final explanations refer to the same investigation.
- No evidence is silently replaced after the player begins.

If consistency validation fails, run a bounded repair step or fail gracefully with a retry option.

---

# 6. Evidence System

## 6.1 Evidence Categories

### A. Chat Evidence

Render fictional WhatsApp-style conversations using an original chat interface.

Fields:

- Conversation title.
- Participants.
- Sender names.
- Messages.
- Timestamps.
- Optional attachment previews.
- Relevant observations.

Requirements:

- Messages must be fictional.
- Chat timestamps must align with the case timeline.
- The interface should resemble a familiar messaging application without implying the conversations are authentic records from a real WhatsApp account.

### B. Image Evidence

Examples:

- A photograph of a scene.
- An object containing a hidden clue.
- A suspicious item.
- A photograph with a visual inconsistency.

Fields:

- Image asset or fallback illustration.
- Caption.
- Discovery location.
- Timestamp.
- Evidence description.

If image generation is unavailable, use a polished fallback instead of failing the entire investigation.

### C. CCTV Evidence

Support:

- Camera location.
- Recording time.
- Timestamped frames or frame descriptions.
- Events observed.
- Missing footage or suspicious gaps.
- Optional recording playback when a real media asset exists.

The MVP must support simulated CCTV reports and frame sequences. Do not display a fake video player that implies an actual recording exists when no video asset was generated.

### D. Documents

Examples:

- Receipts.
- Access logs.
- Letters.
- Financial records.
- Incident reports.
- Inventory sheets.

Render these as readable document-style evidence.

### E. Witness Statements

Fields:

- Witness identity.
- Statement.
- Interview time.
- Observed facts.
- Potential inconsistencies.

### F. Forensic or Physical Clues

Examples:

- Footprints.
- Damaged locks.
- Missing objects.
- Fingerprint reports.
- Unusual marks.

Keep all findings fictional. Do not present invented forensic results as real scientific evidence.

## 6.2 Evidence Detail View

Each evidence detail view must include:

- Title and category.
- Main evidence content.
- Source and timestamp, when applicable.
- Related case context.
- Previous and next evidence navigation.
- `Mark Important` action.
- `Add Note` action.
- `Close` action.

The user should be able to open evidence without losing their investigation progress.

## 6.3 Evidence Relationship Model

Store relationships between evidence and suspects in the database.

For example:

- Evidence A contradicts Suspect 1's alibi.
- Evidence B places Suspect 2 at the scene.
- Evidence C confirms the time of the incident.
- Evidence D initially suggests Suspect 3 but is later explained.

The application must preserve these relationships so the final solution can explain why each clue matters.

Do not expose hidden relationship metadata through public APIs.

---

# 7. Mystery Room UI/UX Specification

## 7.1 Visual Direction

Create a premium, immersive detective-investigation interface.

Preferred style:

- Dark charcoal or near-black backgrounds.
- Warm off-white text.
- Muted amber or brass accents.
- Restrained red for warnings.
- Subtle borders and shadows.
- Clear typography.
- Evidence-card layouts.
- Cinematic but restrained transitions.

Avoid excessive neon effects, distracting animations, cluttered dashboards, and generic template-like layouts.

The interface should feel like a professional digital investigation workspace rather than a conventional admin dashboard.

## 7.2 Main Investigation Layout

### Desktop

Use a three-area layout:

**Left sidebar**
- Case title.
- Case briefing.
- Navigation sections.
- Suspect list.
- Investigation status.

**Center workspace**
- Evidence locker.
- Evidence cards.
- Selected evidence viewer.
- Timeline or investigation board.

**Right sidebar**
- Selected suspect details.
- Related clues.
- Personal notes.
- Investigation progress.

The layout may adapt to a focused evidence viewer when users open large images or documents.

### Mobile

- Replace the three-column layout with a responsive single-column interface.
- Use tabs or drawers for Suspects, Evidence, Timeline, and Notes.
- Keep the selected evidence readable without horizontal scrolling.
- Make the accusation button easy to locate.
- Preserve progress when navigating between tabs.

## 7.3 Main Components

Implement reusable React components:

- `AppLayout`
- `Navbar`
- `Sidebar`
- `MysteryCard`
- `CreateMysteryForm`
- `GenerationProgress`
- `CaseBriefing`
- `SuspectCard`
- `SuspectProfile`
- `EvidenceCard`
- `EvidenceViewer`
- `ChatEvidenceViewer`
- `DocumentEvidenceViewer`
- `ImageEvidenceViewer`
- `CCTVEvidenceViewer`
- `InvestigationTimeline`
- `EvidenceNotes`
- `AccusationModal`
- `SolutionReveal`
- `LoadingState`
- `ErrorState`
- `EmptyState`
- `ToastNotification`

Avoid duplicating entire page implementations when shared components can be reused.

## 7.4 UI States

Every asynchronous screen must support:

- Initial state.
- Loading state.
- Success state.
- Empty state.
- Error state.
- Retry state where appropriate.

Generation should show meaningful progress such as:

1. Analyzing the scenario.
2. Creating suspects.
3. Building the timeline.
4. Generating evidence.
5. Checking consistency.
6. Preparing the mystery room.

These are progress stages, not claims that a specific AI operation has completed before the backend confirms it.

---

# 8. Application Architecture

## 8.1 Architecture Overview

```text
React Frontend
      |
      | HTTPS / REST API
      v
Express Backend
      |
      +---- Authentication and Authorization
      |
      +---- Mystery Service
      |
      +---- AI Orchestration Service
      |          |
      |          v
      |      Google Gemini
      |
      +---- Evidence Service
      |
      +---- Game and Scoring Service
      |
      +---- Media Provider Adapter
      |
      v
MongoDB
```

All business rules must be enforced by the backend.

The frontend must not connect directly to MongoDB or Gemini.

## 8.2 Suggested Project Structure

```text
ai-mystery-room/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── evidence/
│   │   │   ├── mystery/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   ├── mystery/
│   │   │   ├── evidence/
│   │   │   └── game/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
├── SPEC.md
├── README.md
├── .gitignore
└── package.json
```

Codex may adjust the folder structure when necessary, but it must preserve the architectural responsibilities and separation of concerns defined here.

---

# 9. Database Specification

Use Mongoose schemas with validation, timestamps, indexes, and appropriate references.

## 9.1 User

Collection: `users`

Fields:

- `_id`
- `name`
- `email` — unique, normalized.
- `passwordHash`
- `avatarUrl` — optional.
- `createdAt`
- `updatedAt`

Rules:

- Passwords must never be stored in plaintext.
- Password hashes must never be returned through APIs.
- Email must be unique after normalization.

## 9.2 Mystery

Collection: `mysteries`

Fields:

- `_id`
- `ownerId`
- `title`
- `originalScenario`
- `genre`
- `difficulty`
- `status`
- `generationStage`
- `suspects`
- `timeline`
- `evidence`
- `solutionKey`
- `solutionExplanation`
- `generationMetadata`
- `startedAt`
- `completedAt`
- `createdAt`
- `updatedAt`

Allowed statuses:

- `GENERATING`
- `READY`
- `IN_PROGRESS`
- `COMPLETED`
- `FAILED`

`solutionKey` must contain the canonical culprit ID and any private solution data required for the reveal.

Do not return `solutionKey` in normal mystery, suspect, or evidence API responses.

## 9.3 Suspect

A suspect may be embedded in the mystery document for straightforward atomic updates and retrieval.

Fields:

- `id`
- `name`
- `role`
- `age` — optional, fictional.
- `description`
- `motive`
- `alibi`
- `background`
- `portraitUrl` — optional.
- `publicDetails`
- `internalNotes`

`internalNotes` and other hidden solution-related fields must be filtered from player responses.

All suspect IDs must be unique within a mystery.

## 9.4 Evidence

Evidence may be embedded in the mystery document for the MVP, provided the document stays within MongoDB's document-size limits.

Fields:

- `id`
- `type`
- `title`
- `description`
- `content`
- `source`
- `timestamp`
- `assetUrl` — optional.
- `assetType` — optional.
- `relatedSuspectIds`
- `classification`
- `playerVisible`
- `createdAt`

Use the classification internally. Return only the fields appropriate for player access.

If media or evidence volume grows significantly, move evidence assets and metadata to dedicated collections or object storage.

## 9.5 Investigation Progress

Collection: `investigationProgress`

Fields:

- `_id`
- `userId`
- `mysteryId`
- `inspectedEvidenceIds`
- `bookmarkedEvidenceIds`
- `notes`
- `hintsUsed`
- `attemptCount`
- `lastAccusation`
- `result`
- `startedAt`
- `completedAt`
- `updatedAt`

Create a unique compound index on `{ userId, mysteryId }` for one progress record per user per mystery, unless a later version explicitly supports multiple attempts.

Notes and progress must be private to the owning user.

## 9.6 Accusation

Collection: `accusations`

Fields:

- `_id`
- `userId`
- `mysteryId`
- `selectedSuspectId`
- `reasoning` — optional.
- `result`
- `submittedAt`

The API must not accept a client-supplied correct answer or score.

Store the selected suspect ID and determine the result server-side.

Enforce the configured attempt policy. The default MVP policy is one final accusation per investigation. If the product later supports retries, implement explicit attempt limits and scoring rules.

## 9.7 Data Ownership

A user can access only their own mysteries and progress unless an explicitly authorized public-sharing feature is implemented later.

All resource lookups must enforce ownership or access permissions.

Never trust a `userId` supplied in the request body as proof of ownership.

---

# 10. REST API Specification

Use a consistent API prefix:

`/api/v1`

Return JSON responses with predictable error formats.

## 10.1 Authentication

### `POST /api/v1/auth/register`

Request:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "StrongPassword123!"
}
```

Behavior:

- Validate all fields.
- Hash the password.
- Create the user.
- Return a safe user profile and authentication credentials according to the chosen auth strategy.

### `POST /api/v1/auth/login`

Authenticate the user and return a session or access token.

### `GET /api/v1/auth/me`

Return the authenticated user's safe profile.

### `POST /api/v1/auth/logout`

Invalidate the session or refresh token when supported. If stateless access tokens are used, document the actual logout behavior and expire client-side credentials.

Prefer secure, HTTP-only cookies for browser sessions. If bearer tokens are used, keep their storage and lifecycle carefully designed and never expose refresh tokens to JavaScript unnecessarily.

## 10.2 Mystery Creation

### `POST /api/v1/mysteries`

Request:

```json
{
  "scenario": "A rare diamond disappears during a private museum event.",
  "genre": "MURDER_MYSTERY",
  "difficulty": "MEDIUM",
  "suspectCount": 4
}
```

Behavior:

1. Validate input.
2. Create a mystery with `GENERATING` status.
3. Start the generation pipeline.
4. Return the mystery ID and current status.

Response:

```json
{
  "success": true,
  "data": {
    "mysteryId": "example-id",
    "status": "GENERATING"
  }
}
```

For generation that takes longer than a normal HTTP request, use a background job or controlled asynchronous workflow.

### `GET /api/v1/mysteries`

Return the authenticated user's mystery list with pagination and status filters.

### `GET /api/v1/mysteries/:mysteryId`

Return the mystery briefing, public suspects, public timeline, status, and permitted evidence metadata.

Never return the canonical solution key.

### `GET /api/v1/mysteries/:mysteryId/status`

Return generation status and user-safe error information.

### `DELETE /api/v1/mysteries/:mysteryId`

Allow deletion only for an authorized owner. Define deletion behavior for associated progress, accusations, and stored media.

## 10.3 Evidence

### `GET /api/v1/mysteries/:mysteryId/evidence`

Return the player's available evidence.

Support optional filters:

- `type`
- `page`
- `limit`

Do not expose hidden classifications or internal relationship mappings.

### `GET /api/v1/mysteries/:mysteryId/evidence/:evidenceId`

Return the selected evidence in its permitted presentation format.

### `POST /api/v1/mysteries/:mysteryId/evidence/:evidenceId/inspect`

Record that the evidence has been inspected and return the updated progress.

Repeated inspection must be safe and idempotent.

## 10.4 Investigation Progress

### `GET /api/v1/mysteries/:mysteryId/progress`

Return the authenticated user's progress.

### `PATCH /api/v1/mysteries/:mysteryId/progress`

Update permitted progress fields, including bookmarks and notes.

Validate note size and ensure all referenced evidence IDs belong to that mystery.

Do not allow arbitrary modification of the correct answer, result, or hidden solution data.

## 10.5 Accusation

### `POST /api/v1/mysteries/:mysteryId/accusations`

Request:

```json
{
  "selectedSuspectId": "suspect_2",
  "reasoning": "The access log contradicts the suspect's alibi."
}
```

Backend behavior:

1. Authenticate the user.
2. Verify mystery ownership and playable status.
3. Verify the selected suspect exists.
4. Check that the user has not already submitted a final accusation.
5. Compare the selected suspect ID with the canonical culprit ID.
6. Store the accusation and result.
7. Mark the investigation completed.
8. Return the permitted result and solution reveal.

### `GET /api/v1/mysteries/:mysteryId/results`

Return the final result only when the investigation is completed.

The solution reveal must not be available before the final accusation, except for an explicitly configured preview/demo mode.

## 10.6 Hints

### `POST /api/v1/mysteries/:mysteryId/hints`

Optional feature.

Generate a hint using the existing mystery context without exposing the culprit directly.

Hints should progress from subtle observations to stronger clue connections. Enforce hint limits and record usage.

Do not regenerate the canonical mystery when generating hints.

## 10.7 API Error Format

Example:

```json
{
  "success": false,
  "error": {
    "code": "MYSTERY_NOT_READY",
    "message": "This mystery is still being prepared."
  }
}
```

Use appropriate HTTP status codes:

- `400` — invalid request.
- `401` — unauthenticated.
- `403` — forbidden.
- `404` — resource not found.
- `409` — invalid state or duplicate final submission.
- `422` — schema or business-rule validation failure.
- `429` — rate limit exceeded.
- `500` — unexpected server failure.
- `503` — required upstream service unavailable.

Never return stack traces, secrets, raw provider errors, or internal solution data to users.

---

# 11. Gemini Integration Specification

## 11.1 Environment Configuration

Backend `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
GEMINI_API_KEY=
GEMINI_MODEL=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
```

Add any required session, media-storage, or provider-specific variables only when those features are implemented.

Use a model explicitly supported by the installed Google Gen AI SDK and the relevant API capabilities.

Do not hardcode the model name throughout the application. Configure it centrally and document the selected model.

Never commit the real `.env` file.

## 11.2 AI Service Responsibilities

Implement a dedicated service such as:

`server/src/services/ai/geminiService.js`

Responsibilities:

- Initialize the Gemini client.
- Submit structured generation requests.
- Enforce timeouts.
- Handle provider failures.
- Validate response format.
- Normalize provider output.
- Record safe generation metadata.
- Avoid leaking secrets or internal prompts.

Keep application rules outside the AI provider wrapper.

## 11.3 Prompt Design

Maintain versioned prompts for:

- Mystery planning.
- Evidence generation.
- Consistency validation.
- Consistency repair.
- Hint generation.
- Final explanation.

Prompts must require:

- Fictional content.
- Structured output.
- Unique suspect and evidence IDs.
- One canonical culprit.
- Consistent chronology.
- Evidence-backed conclusions.
- No unsupported claims about real people.
- No instructions to reveal hidden solution fields in player-visible content.

Treat user input as untrusted data. A story must not be able to override the model's generation constraints or the application's access-control rules.

## 11.4 AI Reliability

- Use bounded retries.
- Set request timeouts.
- Handle rate limits.
- Validate all structured output.
- Persist generation stages.
- Avoid duplicate mystery creation on request retries.
- Reuse stored canonical investigation data for follow-up operations.
- Do not call Gemini for deterministic scoring.
- Do not regenerate the entire mystery when a single media asset fails.
- Provide a clear retry path when generation fails.

## 11.5 Cost and Latency

- Set reasonable scenario-length limits.
- Limit suspect and evidence counts.
- Avoid unnecessary repeated calls.
- Generate large investigations in stages where appropriate.
- Cache or persist generated results instead of regenerating them on each page load.
- Log latency and token usage where available.
- Implement per-user generation rate limits.

---

# 12. Security and Privacy

Mandatory requirements:

1. Hash all passwords using a suitable password-hashing algorithm.
2. Keep Gemini API credentials exclusively on the server.
3. Validate every API request.
4. Enforce authentication and resource ownership.
5. Protect private solution data from normal API responses.
6. Apply rate limits to authentication, mystery generation, hints, and accusations.
7. Configure CORS for approved origins.
8. Use secure headers.
9. Avoid logging passwords, access tokens, private user notes, or full secret-bearing provider requests.
10. Use safe React rendering; never render untrusted AI output as executable HTML.
11. Sanitize user input where needed and validate uploaded files if uploads are introduced.
12. Enforce payload size and scenario-length limits.
13. Use HTTPS in production.
14. Implement appropriate session expiration and logout behavior.
15. Provide a user-data deletion workflow.
16. Use generic authentication errors where appropriate.
17. Do not expose database connection strings or stack traces.

All mystery scenarios, evidence, and generated investigations are fictional game content.

The product must not present AI-generated accusations against real, identifiable people as verified facts. If a user submits a real person's name or an identifiable real-world allegation, steer generation toward fictionalized characters and settings.

---

# 13. Performance and Reliability

- Paginate mystery lists.
- Avoid repeatedly downloading large evidence assets.
- Use lazy loading for images.
- Keep API responses limited to required fields.
- Add database indexes for frequently queried owner and status fields.
- Avoid unbounded embedded arrays or oversized MongoDB documents.
- Use a background job mechanism if investigation generation is too long for synchronous requests.
- Persist generation state so a page refresh does not lose the investigation.
- Handle provider failures without corrupting a mystery.
- Prevent duplicate final accusations through server-side state checks.
- Use idempotency keys for generation requests where practical.

For production deployments, media assets should use controlled object storage rather than storing large binary files directly in MongoDB.

---

# 14. Testing Requirements

## 14.1 Backend Unit Tests

Test:

- Request validation.
- Authentication and authorization.
- AI response parsing.
- Canonical culprit validation.
- Evidence relationship validation.
- Timeline consistency.
- Deterministic accusation evaluation.
- Solution reveal authorization.
- Progress updates.
- Duplicate accusation prevention.

## 14.2 API Integration Tests

Test:

- Successful registration and login.
- Invalid credentials.
- Mystery creation.
- Generation status polling.
- Evidence retrieval.
- Progress persistence.
- Correct accusation.
- Incorrect accusation.
- Unauthorized resource access.
- Solution access before completion.
- Retry behavior after AI failure.
- Rate-limit behavior.

## 14.3 Frontend Tests

Test:

- Landing-page navigation.
- Create Mystery form validation.
- Generation progress.
- Mystery room rendering.
- Evidence viewer behavior.
- Suspect selection.
- Accusation confirmation.
- Solution reveal.
- Mobile layout.
- Loading, empty, and error states.

## 14.4 AI Evaluation Tests

Use fixed fictional scenarios and mocked Gemini responses for deterministic automated tests.

Validate that:

- The returned JSON matches the schema.
- The culprit ID exists.
- Evidence references valid suspects.
- The solution remains stable.
- Contradictory outputs are rejected.
- Provider failure produces a safe user-facing state.

AI quality tests may use a separate evaluation suite. Core application tests must not depend on live Gemini calls.

---

# 15. Definition of Done

The MVP is complete only when all mandatory conditions below pass.

## Product

- [ ] A user can register and log in.
- [ ] A user can submit a short scenario.
- [ ] A complete fictional mystery is generated.
- [ ] The mystery contains a stable canonical culprit.
- [ ] Suspects and evidence are persisted.
- [ ] The evidence is accessible through an interactive mystery room.
- [ ] The user can inspect and bookmark evidence.
- [ ] The user can save notes and resume progress.
- [ ] The user can submit a final accusation.
- [ ] The backend correctly evaluates the accusation.
- [ ] The solution reveal explains the case.
- [ ] Completed investigations appear in the dashboard.

## Technical

- [ ] React frontend runs successfully.
- [ ] Express backend runs successfully.
- [ ] MongoDB connection is verified.
- [ ] Gemini integration works with a configured API key.
- [ ] API validation and error handling are implemented.
- [ ] Resource ownership is enforced.
- [ ] Solution data is not exposed before completion.
- [ ] Automated tests cover critical game rules.
- [ ] The app works on desktop and mobile.
- [ ] Setup instructions are documented.
- [ ] Environment variables are documented without real secrets.
- [ ] The application can be started from a clean checkout.

## AI and Evidence Quality

- [ ] Evidence supports the canonical solution.
- [ ] All required evidence references are valid.
- [ ] The timeline is coherent.
- [ ] Red herrings have explanations.
- [ ] AI failures do not create playable broken mysteries.
- [ ] Missing image/video capabilities do not block the MVP.

---

# 16. Development Milestones for Codex

Implement the project incrementally. Keep the application runnable after each milestone.

## Milestone 1 — Project Foundation

Deliver:

- Monorepo setup.
- React and Vite frontend.
- Express backend.
- MongoDB connection.
- Environment configuration.
- Centralized error handling.
- Health-check endpoint.
- Responsive design system.
- README and startup scripts.

Acceptance: Both applications start successfully and the backend health check works.

## Milestone 2 — Authentication and Dashboard

Deliver:

- Registration and login.
- Secure password storage.
- Session management.
- Protected routes.
- Dashboard.
- Mystery history.
- Empty and loading states.

Acceptance: A user can register, log in, and access a protected dashboard.

## Milestone 3 — Mystery Generation

Deliver:

- Create Mystery form.
- Gemini service.
- Structured generation prompts.
- Investigation schema validation.
- Canonical solution storage.
- Generation-status API.
- Failure and retry handling.

Acceptance: A valid scenario creates a persisted mystery with a stable culprit and validated suspects.

## Milestone 4 — Evidence System

Deliver:

- Evidence generation.
- Evidence validation.
- Chat viewer.
- Document viewer.
- Image evidence viewer and fallback.
- CCTV simulation viewer.
- Evidence relationships.
- Timeline rendering.

Acceptance: The generated investigation can be explored without exposing hidden solution metadata.

## Milestone 5 — Interactive Mystery Room

Deliver:

- Main investigation layout.
- Suspect profiles.
- Evidence inspection.
- Bookmarks.
- Personal notes.
- Progress persistence.
- Responsive mobile interface.

Acceptance: A user can investigate, refresh the page, and continue from saved progress.

## Milestone 6 — Accusation and Solution

Deliver:

- Suspect selection.
- Confirmation dialog.
- Server-side accusation evaluation.
- Completion state.
- Solution reveal.
- Result history.
- Replay and new-mystery actions.

Acceptance: Correct and incorrect accusations produce the right results, and the solution cannot be retrieved prematurely.

## Milestone 7 — Hardening and Polish

Deliver:

- Security review.
- Automated tests.
- AI consistency evaluation.
- Error-state review.
- Accessibility improvements.
- Performance optimization.
- Production configuration.
- Complete setup and deployment documentation.

Acceptance: All critical Definition of Done checks pass.

---

# 17. Rules Codex Must Follow

This document is the authoritative specification for the project.

Codex must follow these rules throughout implementation:

1. Read `SPEC.md` before making architectural decisions.
2. Build a working application, not merely a UI prototype.
3. Use the specified MERN stack and Gemini integration.
4. Do not replace MongoDB with another database.
5. Do not replace Gemini with another AI provider without explicit authorization.
6. Do not hardcode fake investigation results as the main implementation.
7. Do not expose the canonical culprit before the accusation.
8. Do not allow the frontend to determine accusation correctness.
9. Do not generate evidence that contradicts the stored investigation without detecting the inconsistency.
10. Do not claim image or video generation works unless the relevant provider integration has been implemented and tested.
11. Do not leave primary buttons, routes, or forms nonfunctional.
12. Do not silently omit required features.
13. Do not add unnecessary frameworks or services that complicate the MVP.
14. Keep components modular and backend business logic testable.
15. Maintain a clear separation between public case data and private solution data.
16. Use real API integration for required features, with mocks reserved for tests and explicitly labeled demos.
17. Keep `.env` and secrets out of version control.
18. Update the documentation when an implementation decision changes an API, schema, or startup procedure.
19. Run relevant tests after each milestone.
20. Fix regressions before proceeding to the next milestone.

If an implementation detail is not specified, choose the simplest maintainable solution that preserves the product goals, security requirements, and existing architecture. Document significant assumptions.

Do not ask the user to make decisions about routine implementation details that can be safely determined from this specification.

If a requirement conflicts with an established security rule, preserve the security rule and document the resolution.

---

# 18. Final Product Acceptance Scenario

The following end-to-end scenario is the primary acceptance test.

1. A new user opens the website.
2. The user creates an account and signs in.
3. The user clicks `Create New Mystery`.
4. The user enters a short story about a stolen diamond at a museum.
5. The backend creates a mystery and begins Gemini-powered generation.
6. The user sees generation progress.
7. The completed investigation contains four suspects, a coherent timeline, and at least eight evidence items.
8. The user opens the mystery room.
9. The user examines chat messages, a security report, photographs or fallback visuals, and witness statements.
10. The user compares timestamps and suspect alibis.
11. The user bookmarks a clue and adds a note.
12. The user refreshes the page and finds the investigation progress preserved.
13. The user selects a suspect and submits an accusation.
14. The backend compares the selection against the canonical culprit.
15. The application reveals whether the accusation was correct.
16. The solution explanation references the investigation's actual evidence and explains the relevant clues.
17. The completed mystery appears in the dashboard.

The acceptance scenario must work without requiring a developer to manually edit database records or hardcode the culprit in the frontend.

---

# 19. Final Implementation Principle

AI Mystery Room is not simply a chatbot that invents a detective story.

It is a stateful, interactive investigation game with:

- AI-generated fictional mysteries.
- Structured and consistent evidence.
- A private canonical solution.
- Persistent user progress.
- Deterministic game rules.
- A polished evidence-driven interface.
- Secure backend APIs.

**The expected outcome is a complete, runnable, maintainable MERN application that uses Gemini to generate mysteries and allows users to solve them through evidence-based deduction.**

End of specification.
