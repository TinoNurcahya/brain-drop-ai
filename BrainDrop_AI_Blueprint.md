# BrainDrop AI — Engineering Blueprint
## Hybrid AI Knowledge Capture & Research Assistant
### Google #BuildHybridAI 2026 | Web (Chrome) Platform

> **Tagline:** *"Capture anything, forget nothing — your second brain that never leaves your device."*  
> **Live URL:** `brain.tinonurcahya.dev`  
> **Repository:** GitHub (Public, Apache-2.0)

---

## 1. Problem Statement

Researchers, students, and developers face **information overload** daily:
- Open 30+ browser tabs → forget which was important
- Copy-paste snippets to Notion/Docs → lose original context (source URL, date, surrounding text)
- Want AI to summarize & connect notes, but personal research data is **too sensitive** for cloud

**BrainDrop AI** solves this with a **privacy-first hybrid AI** approach: all clipping, tagging, and searching happens **on-device** (Gemini Nano 4), while deep synthesis and multi-document analysis falls back to **cloud** (Gemini 3.8 Flash) — only with anonymized content.

---

## 2. Hybrid AI Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER (Chrome)                   │
│                                                              │
│  ┌──────────────────┐    ┌─────────────────────────────────┐ │
│  │  Chrome Extension │    │        Next.js Web App          │ │
│  │  (Web Clipper)    │───▶│     brain.tinonurcahya.dev      │ │
│  │  - Highlight text │    │                                 │ │
│  │  - 1-click clip   │    │  ┌───────────┐ ┌─────────────┐ │ │
│  │  - Quick tag      │    │  │  Tiptap   │ │  Knowledge  │ │ │
│  │  - Page metadata  │    │  │  Editor   │ │   Graph     │ │ │
│  └──────────────────┘    │  └───────────┘ └─────────────┘ │ │
│                           │  ┌───────────┐ ┌─────────────┐ │ │
│                           │  │ Flashcard │ │  Research   │ │ │
│                           │  │ Generator │ │  Dashboard  │ │ │
│                           │  └───────────┘ └─────────────┘ │ │
│                           └────────────┬──────────────────┘ │
│                                        │                     │
│  ┌─────────────────────────────────────▼───────────────────┐ │
│  │              @braindrop/ai-logic (Hybrid Router)         │ │
│  │                                                          │ │
│  │   ┌─────────────────────┐    ┌────────────────────────┐ │ │
│  │   │    ON-DEVICE LANE    │    │     CLOUD LANE         │ │ │
│  │   │    Gemini Nano 4     │    │   Gemini 3.8 Flash     │ │ │
│  │   │                     │    │                        │ │ │
│  │   │  • Auto-tag clips   │    │  • Deep synthesis      │ │ │
│  │   │  • Quick summarize  │    │  • Multi-doc analysis  │ │ │
│  │   │  • Semantic search  │    │  • Literature review   │ │ │
│  │   │  • Smart linking    │    │  • Flashcard gen       │ │ │
│  │   │  • PII detection    │    │  • Translation         │ │ │
│  │   │                     │    │                        │ │ │
│  │   │  Privacy: FULL      │    │  Privacy: Anonymized   │ │ │
│  │   │  Latency: ~50ms     │    │  Latency: ~800ms       │ │ │
│  │   │  Cost: FREE         │    │  Cost: Free tier       │ │ │
│  │   └─────────────────────┘    └────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Firebase Backend                        │ │
│  │  Auth (Google) │ Firestore (notes DB) │ App Check         │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Why Hybrid AI Makes Sense Here

| Operation | On-Device (Nano 4) | Cloud (Flash) | Justification |
|:--|:--|:--|:--|
| Auto-tag a new clip | ✅ | | Tags derived from personal content → must stay local |
| Quick summarize (< 500 words) | ✅ | | Fast, private, no network needed |
| Semantic search within notes | ✅ | | Search queries reveal intent → privacy-sensitive |
| Smart linking between notes | ✅ | | Relationship patterns = personal knowledge map |
| PII/sensitive data detection | ✅ | | Must detect before anything goes to cloud |
| Deep synthesis (5+ notes) | | ✅ | Requires large context window + complex reasoning |
| Flashcard generation | | ✅ | Multi-step extraction + formatting |
| Literature review generation | | ✅ | Needs to synthesize and structure long content |
| Translation | | ✅ | Better quality with larger model |
| Offline mode (no internet) | ✅ | ❌ | Core features work offline |

---

## 3. Monorepo Structure (Turborepo + npm workspaces)

```
braindrop-ai/
├── package.json              # Root: workspaces, packageManager
├── turbo.json                # Pipeline config
├── tsconfig.json             # Base TS config
├── LICENSE                   # Apache-2.0
├── README.md                 # Badges, architecture diagram, setup guide
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
│
├── apps/
│   ├── web/                  # Next.js 15 Web Application
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.mjs
│   │   ├── tsconfig.json
│   │   ├── .env.local.example
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── og-image.png
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx          # Root layout, navbar, theme
│   │       │   ├── page.tsx            # Landing page / hero
│   │       │   ├── globals.css         # Tailwind + custom CSS
│   │       │   ├── (dashboard)/
│   │       │   │   ├── notes/
│   │       │   │   │   └── page.tsx    # Note canvas + AI sidebar
│   │       │   │   ├── graph/
│   │       │   │   │   └── page.tsx    # Knowledge graph visualization
│   │       │   │   ├── flashcards/
│   │       │   │   │   └── page.tsx    # Flashcard study mode
│   │       │   │   └── dashboard/
│   │       │   │       └── page.tsx    # Research analytics dashboard
│   │       │   └── api/
│   │       │       └── clips/
│   │       │           └── route.ts    # API: receive clips from extension
│   │       ├── components/
│   │       │   ├── ui/                 # shadcn/ui components
│   │       │   ├── editor/             # Tiptap editor components
│   │       │   ├── graph/              # React Flow graph components
│   │       │   ├── ai/                 # AI sidebar, telemetry HUD
│   │       │   └── layout/             # Navbar, sidebar, footer
│   │       ├── hooks/                  # Custom React hooks
│   │       ├── lib/                    # Utilities, firebase config
│   │       └── stores/                 # Zustand stores
│   │
│   └── extension/            # Chrome Extension MV3 (Web Clipper)
│       ├── manifest.json     # MV3: side_panel, permissions
│       ├── popup.html        # Quick clip popup
│       ├── popup.js
│       ├── sidepanel.html    # Side panel: recent clips + quick notes
│       ├── sidepanel.js
│       ├── content.js        # Content script: text selection handler
│       ├── background.js     # Service worker
│       ├── styles.css
│       └── icons/
│
├── packages/
│   ├── core/                 # Shared types & utilities
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types/
│   │       │   └── index.ts  # Note, Clip, Tag, FlashCard, GraphNode types
│   │       └── utils/
│   │           ├── sanitizer.ts    # PII/sensitive data sanitizer
│   │           └── formatters.ts   # Date, text formatting helpers
│   │
│   └── ai-logic/             # Firebase AI Logic hybrid inference
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── detector.ts   # On-device AI capability detection
│           ├── router.ts     # Hybrid routing: on-device vs cloud
│           ├── prompts.ts    # All prompt templates
│           ├── tasks/
│           │   ├── tagger.ts       # Auto-tag clips/notes
│           │   ├── summarizer.ts   # Quick summarization
│           │   ├── linker.ts       # Smart linking between notes
│           │   ├── synthesizer.ts  # Deep multi-note synthesis (cloud)
│           │   ├── flashcard.ts    # Flashcard generation (cloud)
│           │   └── search.ts       # Semantic search
│           └── simulation.ts # Simulated Nano for non-Chrome browsers
│
├── tests/
│   ├── unit/
│   │   ├── sanitizer.test.ts
│   │   ├── tagger.test.ts
│   │   └── router.test.ts
│   └── e2e/
│       └── clip-flow.test.ts
│
└── docs/
    ├── DEMO_VIDEO_SCRIPT.md
    └── ARCHITECTURE.md
```

---

## 4. Feature Specifications

### 4.1 Web Clipper Chrome Extension
- **Manifest V3** with `side_panel`, `activeTab`, `contextMenus` permissions
- **Content Script:** Detects text selection → floating "Clip to BrainDrop" button
- **Popup:** Quick clip with title, tags, and source URL auto-filled
- **Side Panel:** Shows recent clips, quick note input, search
- **Communication:** Sends clips to web app via `chrome.runtime.sendMessage` + Firestore sync

### 4.2 Smart Note Canvas (Tiptap Editor)
- Rich text editor powered by **Tiptap** (ProseMirror-based)
- AI Sidebar (right panel):
  - **Summarize** selected text (on-device)
  - **Expand** a bullet point into a paragraph (cloud)
  - **Simplify** complex text (on-device)
  - **Find related notes** (on-device semantic matching)
  - **Translate** to/from English (cloud)
- Markdown export support
- Auto-save to Firestore with debounce

### 4.3 Knowledge Graph Visualization
- Built with **React Flow** (or Cytoscape.js)
- Each note = a node, edges = AI-detected relationships
- Interactive: click a node to open the note, drag to rearrange
- Cluster coloring by tag/topic
- Zoom, pan, search within graph
- AI can suggest "These 3 notes seem related, want to link them?"

### 4.4 Flashcard Generator
- Select a note → AI generates Q&A flashcards (cloud — requires deep extraction)
- Study mode with flip animation
- Spaced repetition scheduling (basic Leitner system)
- Track mastery percentage per topic

### 4.5 Research Dashboard
- **Clip Timeline:** When clips were captured (heatmap calendar)
- **Topic Clusters:** Pie/donut chart of tag distribution
- **Reading Progress:** Notes read vs unread, clips processed vs raw
- **Privacy Telemetry:** Real-time counter of on-device vs cloud operations
- **Export:** Download all notes as Markdown ZIP

### 4.6 Privacy Telemetry HUD
- Persistent bottom bar showing:
  - 🟢 On-Device operations count
  - 🔵 Cloud operations count
  - 🔒 Data never sent to cloud (bytes)
  - ⏱️ Average latency comparison
- Click to expand full privacy audit log

---

## 5. Tech Stack

| Layer | Technology | Why |
|:--|:--|:--|
| **Framework** | Next.js 15 + TypeScript | SSR, App Router, API routes, industry standard |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| **Rich Editor** | Tiptap (ProseMirror) | Extensible, React-native, markdown support |
| **Graph Viz** | React Flow | Purpose-built for node graphs in React |
| **State** | Zustand | Lightweight, TypeScript-first |
| **Animation** | Framer Motion | Smooth page transitions, card animations |
| **Charts** | Recharts | Simple, responsive, React-native |
| **AI (On-Device)** | Gemini Nano 4 via Firebase AI Logic | Privacy-first, zero latency, free |
| **AI (Cloud)** | Gemini 3.8 Flash via Firebase AI Logic | Deep reasoning, large context |
| **Auth** | Firebase Authentication (Google) | One-click sign in, hackathon requirement |
| **Database** | Cloud Firestore | Real-time sync, offline persistence |
| **Security** | Firebase App Check | Required by hackathon rules |
| **Hosting** | Vercel | `brain.tinonurcahya.dev` |
| **Monorepo** | Turborepo + npm workspaces | Learned from AuditEdge AI experience |
| **CI** | GitHub Actions | Auto build + test on push |

---

## 6. Firestore Schema

```
users/{userId}/
  ├── profile: { displayName, email, createdAt, settings }
  │
  ├── notes/{noteId}: {
  │     title: string
  │     content: string (Tiptap JSON or HTML)
  │     plainText: string (for search)
  │     tags: string[]
  │     sourceUrl?: string
  │     sourceTitle?: string
  │     clippedText?: string
  │     isClip: boolean
  │     linkedNoteIds: string[]
  │     createdAt: Timestamp
  │     updatedAt: Timestamp
  │     summary?: string
  │     aiProcessed: boolean
  │   }
  │
  ├── flashcards/{cardId}: {
  │     noteId: string
  │     question: string
  │     answer: string
  │     difficulty: 'easy' | 'medium' | 'hard'
  │     nextReview: Timestamp
  │     correctCount: number
  │     incorrectCount: number
  │   }
  │
  └── telemetry/{logId}: {
        operation: string
        mode: 'on-device' | 'cloud' | 'simulated'
        latencyMs: number
        inputTokens: number
        timestamp: Timestamp
      }
```

---

## 7. Sprint Roadmap (15 Days)

### Phase 1: Foundation (Day 1-3)
- [x] Engineering blueprint (this document)
- [ ] Scaffold Turborepo monorepo
- [ ] Setup Next.js 15 + Tailwind + shadcn/ui
- [ ] Firebase project creation + Auth + Firestore + App Check
- [ ] Landing page with hero section
- [ ] Basic note CRUD (create, read, update, delete)
- [ ] Tiptap editor integration
- [ ] Zustand stores for notes state

### Phase 2: AI Core (Day 4-6)
- [ ] Firebase AI Logic setup (hybrid inference SDK)
- [ ] On-device capability detection + simulation fallback
- [ ] Auto-tag task (on-device)
- [ ] Quick summarize task (on-device)
- [ ] Smart linking task (on-device)
- [ ] Deep synthesis task (cloud)
- [ ] Flashcard generation task (cloud)
- [ ] AI sidebar in editor
- [ ] Privacy telemetry HUD

### Phase 3: Chrome Extension (Day 7-8)
- [ ] Manifest V3 setup
- [ ] Content script: text selection → clip button
- [ ] Popup: quick clip with auto-fill
- [ ] Side panel: recent clips + search
- [ ] Communication with web app (Firestore sync)

### Phase 4: Visualization & Dashboard (Day 9-11)
- [ ] Knowledge graph with React Flow
- [ ] AI-suggested relationships between notes
- [ ] Flashcard study mode with flip animation
- [ ] Research dashboard (timeline, topic clusters, progress)
- [ ] Privacy telemetry detailed view

### Phase 5: Polish & Deploy (Day 12-13)
- [ ] UI/UX polish: animations, transitions, responsive design
- [ ] Mobile responsive (PWA-ready)
- [ ] Dark mode
- [ ] Demo mode (pre-loaded sample data for recruiters)
- [ ] Deploy to Vercel → brain.tinonurcahya.dev
- [ ] Chrome Extension packaged for side-loading

### Phase 6: Submission (Day 14-15)
- [ ] Record 3-minute demo video (English)
- [ ] Upload to YouTube (public/unlisted)
- [ ] Push final code to GitHub (public, Apache-2.0)
- [ ] Write Devpost submission text
- [ ] Submit to Devpost

---

## 8. Demo Video Script (3 Minutes)

```
[0:00-0:15] Hook
"Every day, you open 30 tabs, find golden insights, then close them forever.
BrainDrop AI is your second brain that captures, connects, and remembers
— all without your data ever leaving your device."

[0:15-0:45] Web Clipper Demo
- Browse a tech article in Chrome
- Highlight text → "Clip to BrainDrop" button appears
- One-click save → side panel shows clip with auto-tags
- Show: "Tagged on-device in 47ms — zero data sent to cloud"

[0:45-1:30] Smart Note Canvas
- Open BrainDrop web app → note editor
- Show AI sidebar: select text → "Summarize" (on-device, instant)
- Type a complex paragraph → "Simplify" (on-device)
- Ask AI to "Synthesize these 3 notes into a research brief" (cloud fallback)
- Show telemetry: "3 on-device ops, 1 cloud op"

[1:30-2:00] Knowledge Graph
- Switch to Graph view → interactive node visualization
- Click a node → see the note
- AI suggests: "These notes about Firebase and Hybrid AI seem related"
- Accept → new edge appears with animation

[2:00-2:30] Flashcards & Dashboard
- Generate flashcards from a long note (cloud)
- Quick study session with flip cards
- Research dashboard: clip timeline heatmap, topic distribution, privacy stats

[2:30-2:50] Privacy Architecture
- Show Privacy Telemetry HUD in detail
- "87% of all AI operations ran on-device"
- "0 bytes of personal notes sent to cloud without anonymization"
- Architecture diagram: on-device vs cloud routing

[2:50-3:00] Closing
"BrainDrop AI — built with Firebase AI Logic for the #BuildHybridAI hackathon.
Try it live at brain.tinonurcahya.dev"
```

---

## 9. Submission Checklist

- [ ] Public GitHub repo with Apache-2.0 license visible in About
- [ ] `firebase/ai` imported AND called at runtime (not just README)
- [ ] Firebase App Check with debug token documented
- [ ] Live demo at `brain.tinonurcahya.dev`
- [ ] Demo mode for recruiters (no sign-up required to explore)
- [ ] 3-minute YouTube demo video (English)
- [ ] Devpost text description with Firebase AI Logic usage details
- [ ] README with architecture diagram, setup guide, CI badge
- [ ] No secrets/API keys committed to git
- [ ] Chrome Extension folder ready for side-loading

