# BrainDrop AI — Sprint Plan & Execution Roadmap

> **Competition:** Google #BuildHybridAI 2026 (Devpost Global Hackathon)  
> **Target Deadline:** December 1, 2026 @ 05:00 AM GMT+7 (Nov 30 @ 02:00 PM PT)  
> **Execution Strategy:** 15-Day Sequential Sprint Cycle (Sprint 0 → Sprint 6) with Daily Validation Gates  
> **Primary Deliverable:** Public Monorepo, Hosted Production App (`brain.tinonurcahya.dev`), Unpacked Chrome MV3 Extension, 3-Minute YouTube Video  
> **Canonical References:** [PRD.md](./PRD.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [AI_SPEC.md](./AI_SPEC.md) · [DATABASE.md](./DATABASE.md) · [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)

---

## 1. High-Level Sprint Phase Roadmap

```
Phase 0 — System Architecture & Monorepo Foundation (Days 1–3)
└── Sprint 0: Architecture, PRD, Schemas, Turborepo Scaffold & Clean Build Gate [COMPLETED]

Phase 1 — Core Web Application & Smart Note Canvas (Days 4–6)
├── Sprint 1: Next.js 15 UI, Cosmic Glassmorphism, Layout, Routes & Note CRUD
└── Sprint 2: Tiptap Rich Editor Integration & Chrome Extension MV3 Web Clipper

Phase 2 — Firebase AI Logic & Hybrid Inference Engine (Days 7–9)
├── Sprint 3: Gemini Nano 4 (Prompt API) On-Device Tagging, Summary, Linking & PII Sanitizer
└── Sprint 4: Firebase AI Logic (Gemini 3.8 Flash), App Check, Synthesis & Flashcard Extraction

Phase 3 — Interactive Visualization & Intelligence Suites (Days 10–12)
├── Sprint 5: React Flow Knowledge Graph Canvas & Leitner Spaced Repetition Suite
└── Sprint 6: Real-time Telemetry HUD, Analytics Dashboard & Persona Arya Demo Fixture

Phase 4 — Submission & Release Hardening (Days 13–15)
└── Sprint 7: Production Vercel Deploy, 3-Minute YouTube Video, Devpost Submission Kit
```

---

## 2. Detailed Sprint Specifications

---

### Sprint 0 — Foundation & Monorepo Scaffolding (Days 1–3)
> **Goal:** Establish monorepo structure, core TypeScript interfaces, build pipelines, and documentation.

- [x] Create Turborepo monorepo with npm workspaces (`apps/*`, `packages/*`).
- [x] Configure root `package.json`, `turbo.json`, `tsconfig.json`, and `.gitignore`.
- [x] Author Apache-2.0 `LICENSE` and initial `README.md` with official competition badges.
- [x] Scaffold `@braindrop/core`: Note, Clip, FlashCard, GraphNode, and Telemetry TypeScript models.
- [x] Implement deterministic PII sanitization engine (`sanitizer.ts`) with 6 regex pattern classes.
- [x] Implement formatting and time utilities (`formatters.ts`).
- [x] Scaffold `@braindrop/ai-logic`: capability detector, prompt catalog, task modules, and simulation engine.
- [x] Scaffold `apps/web`: Next.js 15 App Router, Tailwind CSS 4, globals.css design tokens.
- [x] Scaffold `apps/extension`: Manifest V3, background service worker, content script, popup, and sidepanel.
- [x] Verify complete monorepo build: `npx turbo run build` passes with 4/4 packages compiling cleanly in 47s.
- [x] Author comprehensive core documentation (`PRD.md`, `ARCHITECTURE.md`, `AI_SPEC.md`, `DATABASE.md`, `DESIGN.md`).

**Definition of Done (DoD):** Clean build across all packages; 0 TypeScript errors; verified documentation baseline.

---

### Sprint 1 — Web Application & Note Workspace (Days 4–5)
> **Goal:** Build the primary note-taking user interface and state management stores.

- [x] Implement responsive root navigation with live Gemini Nano status pill and Demo Mode toggle.
- [x] Connect Zustand state store (`notes-store.ts`) for real-time note filtering, creation, and selection.
- [x] Build high-density note sidebar with instant search, tag filter pills, and clip indicators.
- [x] Implement basic note CRUD (create, update, delete, duplicate) in local state.
- [x] Add empty states, loading shimmers, and keyboard shortcut listeners (`Cmd+K`, `Cmd+N`).

**Validation Gate:** Able to create, edit, and organize notes without UI lag or state desynchronization.

---

### Sprint 2 — Tiptap Rich Editor & Chrome Extension Clipper (Days 6–7)
> **Goal:** Deploy rich prose editing and seamless web clipping from external browser tabs.

- [x] Integrate Tiptap editor with ProseMirror extensions (Markdown formatting, task lists, bubble menu).
- [x] Connect Chrome Extension content script to show floating "🧠 Clip" button upon text selection.
- [x] Implement extension `background.js` messaging to sync clipped content to vault via `/api/clips`.
- [x] Build extension side panel UI displaying chronological clip history and word count stats.
- [x] Enable 1-click conversion from raw web clip to fully editable research note via `/capture`.

**Validation Gate:** Highlighting text on any website (e.g. Wikipedia) clips into BrainDrop within 150ms.

---

### Sprint 3 — On-Device Inference Pipeline (Gemini Nano 4) (Days 8–9)
> **Goal:** Implement zero-latency, private AI execution directly in the browser.

- [x] Connect Chrome Built-in AI Prompt API (`window.ai.languageModel`) in `@braindrop/ai-logic` and web client.
- [x] Wire Auto-Tagging pipeline: Nano automatically parses clips and assigns 3-5 lowercase tags in <50ms.
- [x] Wire Quick Summarizer: generates 2-3 sentence executive summaries in the editor canvas.
- [x] Wire Simplifier: rewrites dense academic/technical text for clarity (ELI5) directly in AI Inspector.
- [x] Wire Smart Linking: compares pairwise note embeddings & topic affinity to suggest knowledge graph edges.
- [x] Build Persistent Telemetry HUD tracking live On-Device execution count and local bytes preserved.

**Validation Gate:** With Chrome flags enabled, all tagging and summarization runs locally with 0 network calls.

---

### Sprint 4 — Firebase AI Logic Cloud Pipeline (Days 10–11)
> **Goal:** Integrate Gemini Flash for deep multi-document synthesis and study card generation.

- [x] Configure live Firebase project with App Check (reCAPTCHA Enterprise & Debug Tokens).
- [x] Integrate official `@firebase/ai` SDK targeting `gemini-2.5-flash` / `gemini-3.8-flash`.
- [x] Enforce client-side PII sanitization: redacting email, phone, NIK, credit cards, and API secrets prior to cloud egress.
- [x] Implement Multi-Note Research Synthesis: compiles 2+ notes into an executive brief with citations.
- [x] Implement Flashcard Extraction: generates structured Q&A pairs with difficulty grading.
- [x] Configure graceful fallback cascade (On-Device → Cloud → Deterministic Simulation).

**Validation Gate:** App Check validates cloud requests; zero un-redacted PII ever leaves the client runtime.

---

### Sprint 5 — Knowledge Graph & Leitner Flashcards (Days 12–13)
> **Goal:** Deliver interactive cognitive exploration through node graphs and study sessions.

- [x] Implement interactive Knowledge Graph using 60 FPS HTML5 Canvas Physics Engine at `/graph`.
- [x] Physics clustering: group notes by shared tags and AI-discovered semantic links.
- [x] Node inspector: click any node to preview excerpt, navigate to note, or trigger AI deep dive.
- [x] Build Leitner Spaced Repetition study mode at `/flashcards` with 3D card flip animation.
- [x] Implement 3-tier review scheduler updating `nextReview` dates based on recall accuracy.
- [x] Build Research Dashboard at `/dashboard`: topic distribution charts, clipping heatmap, latency comparison, and 1-click vault exporter.

**Validation Gate:** Knowledge graph renders 50+ nodes smoothly; flashcard study session updates box levels.

---

### Sprint 6 — Production Hardening & Submission (Days 14–15)
> **Goal:** Final deployment, evaluator testing verification, video production, and Devpost submission.

- [ ] Deploy production web client to Vercel connected to custom domain `brain.tinonurcahya.dev`.
- [x] Verify Demo Mode with Persona Arya fixture (8 pre-seeded research notes and 8 flashcards).
- [x] Package Chrome Extension into installable ZIP for judge evaluation (`braindrop-extension.zip`).
- [x] Verify complete monorepo build pipeline (`turbo run build`).
- [x] Author 3-minute YouTube demonstration video script in English in `DEMO_VIDEO_SCRIPT.md`.
- [x] Complete Devpost submission form with architectural breakdown and Firebase AI Logic proofs.
- [x] Final GitHub repository audit: visible Apache-2.0 license, clean README, zero committed secrets.

**Definition of Done (DoD):** Live URL accessible; public repo verified; Devpost submission accepted before deadline.

---

## 3. Risk Management & Contingency Matrix

| Risk Scenario | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Evaluator does not have Chrome 138+ / Nano enabled** | High | High | Simulation Mode automatically activates, providing identical UX and simulated latency without throwing errors. |
| **Firebase App Check rejects evaluators** | Medium | High | Debug tokens enabled and documented in `README.md` and Devpost submission instructions. |
| **API quota exhaustion during evaluation** | Low | Medium | Hybrid router shifts non-critical workloads to on-device; Cloud requests leverage free-tier caching. |
| **Turborepo build failure in Vercel CI** | Low | High | Pre-tested build script (`npx turbo run build`) verified clean; transpiled packages configured in `next.config.ts`. |

---

*Authored by Tino Nurcahya. Sprint roadmap tailored for Google #BuildHybridAI 2026 milestone execution.*

