# BrainDrop AI — Design System & Screen Contract

> **Document Version:** 1.0  
> **Status:** Approved UI/UX Design System Specification  
> **Design Language:** Cosmic Glassmorphism & High-Density Engineering Dashboard  
> **Target Framework:** Tailwind CSS 4, shadcn/ui, Framer Motion, React Flow  
> **Canonical References:** [PRD.md](./PRD.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [AI_SPEC.md](./AI_SPEC.md) · [DATABASE.md](./DATABASE.md)

---

## 1. Design Philosophy & Aesthetic Principles

BrainDrop AI is built for intellectual deep work. When a researcher, developer, or student is clipping knowledge and synthesizing complex ideas, the interface must remain unobtrusive, calm, and exquisitely crafted:

1. **Dark-First Cosmic Glassmorphism:** Deep space navy foundations (`#0a0a0f`) layered with translucent backdrop-blurred panels (`rgba(22, 22, 42, 0.8)`) create visual depth while eliminating eye fatigue during night study sessions.
2. **Deterministic Status Transparency:** Users should never wonder what the AI is doing. Dedicated color cues immediately communicate model execution states:
   - 🟢 **Emerald (`#10b981`):** On-Device Gemini Nano 4 execution (Fast, Free, 100% Private).
   - 🔵 **Blue (`#4f8ff7`):** Cloud Gemini 3.8 Flash execution (Deep Reasoning, Sanitized).
   - 🟡 **Amber (`#f59e0b`):** Synthetic Simulation / Demo Evaluation fallback.
   - 🟣 **Purple (`#8b5cf6`):** Cross-document Knowledge Graph connections.
3. **Information Density Over Whitespace Waste:** Modeled after developer tools like Linear, Raycast, and VS Code, screens provide high-density utility with clear typographical hierarchies rather than oversized empty margins.
4. **Instant Tactility & 60fps Micro-Interactions:** Buttons illuminate on hover with subtle CSS glows (`glow-blue`, `glow-emerald`); flashcards flip with hardware-accelerated 3D transforms; knowledge nodes pulse upon AI discovery.

---

## 2. Design Tokens & Color Palette

### 2.1 CSS Custom Properties (`globals.css`)

```css
:root {
  /* Surface Layers */
  --bg-primary: #0a0a0f;           /* Deep obsidian base */
  --bg-secondary: #12121a;         /* Elevated sidebar & card surface */
  --bg-tertiary: #1a1a2e;          /* Interactive hover surfaces & inputs */
  --bg-card: #16162a;              /* Translucent content containers */
  
  /* Borders & Hairlines */
  --border: #2a2a4a;               /* 1px subtle divider */
  --border-hover: #3a3a6a;         /* High-contrast active outline */
  
  /* Typographical Foregrounds */
  --text-primary: #f0f0ff;          /* Crisp high-contrast reading text */
  --text-secondary: #a0a0c0;        /* Descriptive copy and metadata */
  --text-muted: #6a6a8a;            /* Footnotes, timestamps, inactive states */
  
  /* Semantic Accent Accents */
  --accent-blue: #4f8ff7;          /* Cloud AI & Primary action brand */
  --accent-purple: #8b5cf6;        /* Knowledge Graph & Synthesis */
  --accent-emerald: #10b981;       /* On-device Nano & Privacy security */
  --accent-amber: #f59e0b;         /* Caution, Simulation, Review state */
  --accent-rose: #f43f5e;          /* Destructive action & Hard difficulty */

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #4f8ff7, #8b5cf6);
  --gradient-glow: linear-gradient(135deg, rgba(79, 143, 247, 0.15), rgba(139, 92, 246, 0.15));
}
```

### 2.2 Typography Contract

| Role | Font Family | Weights | Letter Spacing | Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Interface / UI** | `system-ui, -apple-system, 'Inter'` | 400, 500, 600, 700 | `-0.01em` | Buttons, navigation, labels, data tables |
| **Note Content** | `'Inter', system-ui, sans-serif` | 400, 500 | `normal` | Rich text editor, note reading body |
| **Code & Identifiers** | `'JetBrains Mono', 'Fira Code', monospace` | 400, 600 | `tight` | Latency (ms), byte volume, API signatures |
| **Editorial Headings**| `system-ui, sans-serif` | 700, 800 | `-0.03em` | Hero titles, landing page value propositions |

---

## 3. UI Component Anatomy & Micro-Interactions

### 3.1 Glassmorphism Container (`.glass`)
```css
.glass {
  background: rgba(22, 22, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.glass:hover {
  border-color: var(--border-hover);
}
```

### 3.2 Privacy Telemetry HUD
The persistent Telemetry HUD sits anchored at the bottom edge (`z-index: 40`), constantly reassuring the user regarding data locality:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  🟢 On-Device: 156   🔵 Cloud: 23   🟡 Simulated: 0   ⏱️ Nano Avg: 48ms   🔒 Data Kept Local: 284.6 KB │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- Clicking the HUD expands a slide-up drawer detailing the exact timestamp, token volume, and redaction log for the last 50 AI operations.

---

## 4. Screen-by-Screen Implementation Contract

### 4.1 Screen 1: `/` — Cinematic Landing Page
- **Hero Section:** High-contrast typography with gradient text (`Capture anything. Forget nothing.`).
- **Live Nano Capability Detector:** Real-time badge in the top right indicating whether the visiting browser has Gemini Nano 4 enabled.
- **Visual Architecture Comparison:** 3-column card grid visualizing On-Device vs Router vs Cloud models.
- **CTAs:** Direct access to `Start Capturing →` and `View Demo Dashboard`.

### 4.2 Screen 2: `/notes` — Smart Note & Clipping Canvas
- **Left Panel (Width: 320px):** Search input, quick note button, tag filtering pills, scrollable card list displaying note title, verbatim excerpt, and relative time (`2m ago`).
- **Center Canvas (Fluid Flex):** Note title editor, tag manager, rich text area powered by Tiptap with ProseMirror schema support.
- **Right Panel (Width: 280px):** **AI Assistant Sidebar** featuring 1-click action triggers:
  - 📝 **Summarize** (Emerald badge: On-Device)
  - 💡 **Simplify** (Emerald badge: On-Device)
  - 📖 **Expand** (Blue badge: Cloud)
  - 🔗 **Find Related** (Emerald badge: On-Device)
  - 🌐 **Translate** (Blue badge: Cloud)
  - 🧪 **Synthesize** (Blue badge: Cloud)

### 4.3 Screen 3: `/graph` — Interactive Knowledge Graph
- **Canvas:** Full viewport interactive canvas powered by React Flow.
- **Nodes:** Customized circular nodes sized by connection degree and colored by primary tag topic.
- **Physics:** Force-directed layout clustering related topics together.
- **Interaction:** Clicking any node reveals a flyout inspector with note preview, source attribution link, and suggested connections.

### 4.4 Screen 4: `/flashcards` — Leitner Spaced Repetition Study Suite
- **Card Viewport:** 3/2 aspect ratio glassmorphic card with smooth 3D CSS `rotateY` perspective flip.
- **Study Controls:** ❌ Incorrect (resets to Box 1) vs ✅ Correct (advances to higher box).
- **Difficulty Badges:** Emerald for Easy, Amber for Medium, Rose for Hard.

### 4.5 Screen 5: `/dashboard` — Research Analytics & Privacy Telemetry
- **Top Metrics Grid:** 4-card overview (Total Notes, Web Clips, Flashcards, Connections).
- **Privacy Telemetry Card:** Visual progress bar illustrating the local-to-cloud ratio (e.g., 87% On-Device).
- **Latency Benchmark Card:** Visual bar comparing On-Device (~52ms) vs Cloud (~834ms) execution times.
- **Topic Distribution Radar / Donut:** Recharts breakdown of research domains.
- **Activity Heatmap:** 30-day GitHub-style square matrix of clipping frequency.

### 4.6 Chrome Extension Companion (Side Panel & Popup)
- **Content Script:** Highlights on any webpage trigger a floating glassmorphic `🧠 Clip` button.
- **Side Panel (`sidepanel.html`):** Displays recent clips with search filter, word count, and source URLs.
- **Popup (`popup.html`):** Width 360px quick-note capture with instant character count and "Clips Today" stats.

---

## 5. Keyboard Navigation & Accessibility (a11y)

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| `Cmd/Ctrl + K` | Global | Open global command palette & search |
| `Cmd/Ctrl + N` | Global | Create a new blank research note |
| `Cmd/Ctrl + /` | Editor | Trigger on-device AI quick summary |
| `Cmd/Ctrl + B` | Editor | Toggle AI Assistant sidebar |
| `Space` | Flashcards | Flip active study card |
| `1` / `2` | Flashcards | Mark card as Incorrect (1) or Correct (2) |
| `Escape` | Modals / Graph | Close flyout drawer / return to neutral zoom |

---

*Authored by Tino Nurcahya. Certified compliant with Google #BuildHybridAI 2026 UI/UX design specifications.*

