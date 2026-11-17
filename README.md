# 🧠 BrainDrop AI

[![Build](https://github.com/tinonurcahya/braindrop-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/tinonurcahya/braindrop-ai/actions)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Firebase AI Logic](https://img.shields.io/badge/Firebase-AI_Logic-FFCA28?logo=firebase)](https://firebase.google.com/docs/ai-logic)
[![Built for #BuildHybridAI](https://img.shields.io/badge/%23BuildHybridAI-2026-4285F4?logo=google)](https://firebasehybridaihackathon.devpost.com/)

> **Capture anything, forget nothing — your second brain that never leaves your device.**

BrainDrop AI is a privacy-first knowledge capture and research assistant built with **Firebase AI Logic Hybrid Inference**. Clip content from the web, organize notes with AI-powered tagging and linking, and visualize your knowledge graph — all while keeping your personal data on-device.

## 🏗️ Architecture

```
On-Device (Gemini Nano 4)          Cloud (Gemini 3.8 Flash)
├── Auto-tag clips                 ├── Deep synthesis
├── Quick summarize                ├── Multi-doc analysis  
├── Semantic search                ├── Flashcard generation
├── Smart linking                  └── Translation
└── PII detection
         \                              /
          \── Firebase AI Logic ──────/
                    |
              Hybrid Router
           (prefer on-device)
```

## 🚀 Features

- **Web Clipper** — Chrome Extension to highlight & save from any page
- **Smart Notes** — Tiptap rich editor with AI sidebar
- **Knowledge Graph** — Interactive visualization of note relationships
- **Flashcards** — AI-generated study cards with spaced repetition
- **Privacy Dashboard** — Real-time telemetry of on-device vs cloud ops
- **Demo Mode** — Pre-loaded sample data for instant exploration

## 📦 Monorepo Structure

| Package | Description |
|:--|:--|
| `apps/web` | Next.js 15 web application |
| `apps/extension` | Chrome Extension MV3 (Web Clipper) |
| `packages/core` | Shared TypeScript types & utilities |
| `packages/ai-logic` | Firebase AI Logic hybrid inference |

## 🛠️ Getting Started

```bash
npm install
npm run dev
npm run build
```

### Environment Variables

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

### Chrome Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `apps/extension/`

## 🔑 Firebase Setup

- **Firebase AI Logic** (Gemini Nano 4 + Gemini 3.8 Flash)
- **Firebase Authentication** (Google Sign-In)
- **Cloud Firestore** (notes database)
- **Firebase App Check** (debug tokens accepted)

## 📚 Documentation Suite

BrainDrop AI features a comprehensive, enterprise-grade documentation suite matching the standard of production AI systems:

| Document | Description |
|:--|:--|
| [**PRD.md**](./docs/PRD.md) | Product Requirements Document — User personas, core loops, functional & non-functional requirements. |
| [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | System Architecture Blueprint — Monorepo topology, Mermaid flowcharts, and component layers. |
| [**AI_SPEC.md**](./docs/AI_SPEC.md) | AI Behavioral Specification — Prompt templates, Prompt API runtime, Firebase AI Logic, and PII sanitization. |
| [**DATABASE.md**](./docs/DATABASE.md) | Database & Storage Manual — Cloud Firestore schema, App Check security rules, and demo fixtures. |
| [**DESIGN.md**](./docs/DESIGN.md) | UI/UX Design System — Cosmic Glassmorphism tokens, component anatomy, and screen contracts. |
| [**SPRINT.md**](./docs/SPRINT.md) | 15-Day Sprint Plan — Sequential roadmap with daily deliverables, DoD, and validation gates. |
| [**SUBMISSION.md**](./docs/SUBMISSION.md) | Hackathon Submission Kit — Judges' 1-click evaluation guide, compliance checklist, and pitch. |
| [**IMPLEMENTATION_STATUS.md**](./docs/IMPLEMENTATION_STATUS.md) | Implementation Audit — Verified package builds, test commands, and progress tracking. |
| [**GAP.md**](./docs/GAP.md) | Competitive GAP Analysis — Benchmark comparison against Notion AI, Obsidian, and Readwise. |
| [**MEDIA_LIBRARY.md**](./docs/media/MEDIA_LIBRARY.md) | Media & Asset Registry — 3-minute video storyboard, UI screenshots inventory, and badges. |

## 🏆 Hackathon

Built for [Google #BuildHybridAI 2026](https://firebasehybridaihackathon.devpost.com/) — Web (Chrome) platform.

## 📄 License

[Apache License 2.0](LICENSE)

