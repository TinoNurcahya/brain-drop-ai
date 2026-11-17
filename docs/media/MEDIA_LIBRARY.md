# BrainDrop AI — Media & Visual Asset Inventory

> **Document Version:** 1.0  
> **Status:** Asset Registry & Specification Baseline  
> **Target Media:** UI Screenshots, Architecture Diagrams, Badges, Video Storyboards  
> **Canonical References:** [PRD.md](../PRD.md) · [DESIGN.md](../DESIGN.md) · [SUBMISSION.md](../SUBMISSION.md)

---

## 1. Video Demonstration Storyboard (3 Minutes Max)

The YouTube demonstration video adheres strictly to the competition requirement: **maximum 3 minutes (180 seconds)**, presented in English with clear subtitles and direct application footage.

```
0:00 ─── Hook & Problem (Tab Graveyard & Privacy Dilemma)
0:25 ─── Solution: Web Clipper Chrome Extension (1-Click Highlight)
0:50 ─── Smart Note Canvas & Gemini Nano 4 On-Device AI Actions
1:30 ─── Interactive Knowledge Graph (React Flow)
2:00 ─── Leitner Spaced Repetition Flashcards & 3D Flip
2:25 ─── Cloud Research Synthesis (Gemini 3.8 Flash via Firebase AI Logic)
2:45 ─── Privacy Telemetry HUD & Benchmark Proof (16x Faster, 0 Leaks)
3:00 ─── Outro: brain.tinonurcahya.dev
```

### Detailed Sequence Breakdown

| Time Stamp | Visual Screen / Footage | Narration Script (English) | Model / Engineering Highlight |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:15** | Browser with 25+ open tabs. Frustrated workflow. | *"Every day, we open dozens of tabs, discover profound insights, and lose them in the bookmark graveyard. Traditional tools either leak our private thoughts to cloud LLMs or require clunky local setups."* | Problem statement. |
| **0:15 – 0:45** | Browsing a Firebase technical article. Highlighting text. | *"Meet BrainDrop AI: your second brain that never leaves your device. On any webpage, simply highlight text. Our Chrome Extension's floating button captures the excerpt, page title, and origin URL in one click."* | Chrome Extension MV3, content script, local caching. |
| **0:45 – 1:25** | Switching to `brain.tinonurcahya.dev/notes`. Selecting clip. | *"Inside the workspace, Gemini Nano 4 processes clips on-device. With zero network calls and sub-50ms latency, it extracts tags and generates crisp summaries. Notice our Telemetry HUD incrementing local bytes saved."* | On-Device Gemini Nano 4, Prompt API, Telemetry HUD. |
| **1:25 – 1:55** | Navigating to `/graph`. Zooming on interactive nodes. | *"Knowledge isn't linear. In our Knowledge Graph, BrainDrop connects related concepts autonomously. Click any node to inspect source notes and discover unexpected links across your research."* | React Flow, physics-based layout, AI link discovery. |
| **1:55 – 2:25** | Navigating to `/flashcards`. 3D card flip. | *"To bridge reading and retention, our Leitner Spaced Repetition suite transforms notes into study cards. Test your recall with 3D flip cards; correct answers advance to higher review intervals."* | Spaced Repetition System (SRS), Framer Motion 3D. |
| **2:25 – 2:45** | Triggering "Synthesize" in AI Sidebar. | *"When you need deep reasoning across multiple notes, Firebase AI Logic kicks in. Our client-side sanitizer scrubs all PII before Gemini 3.8 Flash compiles a unified research brief."* | Firebase AI Logic (`firebase/ai`), Gemini 3.8 Flash, PII regex sanitizer. |
| **2:45 – 3:00** | Showing `/dashboard` with Privacy Ratio and Latency comparison. | *"BrainDrop AI: fast, intelligent, and private by design. Built with Firebase AI Logic for #BuildHybridAI 2026. Try it live at brain.tinonurcahya.dev."* | Call to action, production deploy URL. |

---

## 2. UI Screenshots & Visual Artifact Inventory

The following screenshots are cataloged for documentation, Devpost submission gallery, and README display:

| Filename / Target Path | Dimensions | Context / Screen Captured |
| :--- | :--- | :--- |
| `screenshot/01-landing-hero.png` | 1920 × 1080 | Landing page hero with Cosmic Glassmorphism, headline, and Nano status badge. |
| `screenshot/02-extension-clipper.png`| 1920 × 1080 | Chrome Extension floating "🧠 Clip" button over a technical article. |
| `screenshot/03-notes-workspace.png` | 1920 × 1080 | Split-view editor, search sidebar, active note, and AI Assistant panel with Nano tags. |
| `screenshot/04-knowledge-graph.png` | 1920 × 1080 | Interactive node cluster showing Firebase, React, and Machine Learning connections. |
| `screenshot/05-flashcards-study.png`| 1920 × 1080 | 3D flashcard flipped showing answer, Leitner difficulty badge, and score counters. |
| `screenshot/06-dashboard-roi.png` | 1920 × 1080 | Privacy Telemetry (87% On-Device), Latency comparison (52ms vs 834ms), 30-day heatmap. |
| `screenshot/07-extension-sidepanel.png`| 800 × 1200 | Chrome MV3 side panel displaying chronological clips, word count, and search filter. |

---

## 3. Official Repository Badges

Configured in `README.md` for GitHub presentation:

```markdown
[![Build](https://github.com/tinonurcahya/braindrop-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/tinonurcahya/braindrop-ai/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Firebase AI Logic](https://img.shields.io/badge/Firebase-AI_Logic-FFCA28?logo=firebase)](https://firebase.google.com/docs/ai-logic)
[![Built for #BuildHybridAI](https://img.shields.io/badge/%23BuildHybridAI-2026-4285F4?logo=google)](https://firebasehybridaihackathon.devpost.com/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo)](https://turbo.build/)
```

---

*Catalog managed by Tino Nurcahya. All assets prepared for Google #BuildHybridAI 2026 submission package.*

