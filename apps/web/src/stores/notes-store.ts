import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Note } from "@braindrop/core";

export interface NoteStoreItem extends Omit<Note, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
  aiMode?: "on-device" | "cloud" | "simulated";
  aiLatencyMs?: number;
}

const INITIAL_SEED_NOTES: NoteStoreItem[] = [
  {
    id: "note-1",
    title: "Firebase AI Logic & Hybrid Inference Architecture",
    content: `# Firebase AI Logic & Hybrid Inference

Firebase AI Logic provides a unified orchestration layer to dynamically switch between on-device inference (via Chrome Built-in AI Gemini Nano) and high-throughput cloud models (Gemini 2.5/3.8 Flash).

### Key Architectural Pillars:
- **Zero-latency local processing** for privacy-sensitive tasks: note summarization, PII redaction, instant tagging.
- **Automatic Fallback** to Cloud Gemini Flash when device memory or model capabilities are constrained.
- **Unified Telemetry**: Real-time tracking of latency, token savings, and on-device compute ratios.

\`\`\`typescript
const result = await executeFirebaseAI(prompt, {
  model: "gemini-2.5-flash"
});
\`\`\`
`,
    plainText: "Firebase AI Logic provides a unified orchestration layer to dynamically switch between on-device inference and high-throughput cloud models...",
    tags: ["firebase", "hybrid-ai", "gemini-nano", "architecture"],
    isClip: false,
    linkedNoteIds: ["note-2", "note-4", "note-6"],
    summary: "Architecture guide for hybrid on-device (Gemini Nano) and cloud (Gemini Flash) AI routing with zero-latency local processing.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 34,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-2",
    title: "Chrome Built-in AI Prompt API Capabilities",
    content: `# Chrome Built-in AI Prompt API

The \`window.ai\` Prompt API enables web applications to run the lightweight Gemini Nano model directly inside Chrome without backend round-trips.

### Capabilities:
- Summarization API (\`window.ai.summarizer\`)
- Language Model API (\`window.ai.languageModel\`)
- Writer & Rewriter APIs for text polish

> **Privacy Guarantee**: All user keystrokes remain confined to client memory. No telemetry or plain text leaves the browser during local inference.
`,
    plainText: "The window.ai Prompt API enables web applications to run the lightweight Gemini Nano model directly inside Chrome...",
    tags: ["chrome-ai", "prompt-api", "gemini-nano", "web-apis"],
    isClip: true,
    sourceUrl: "https://developer.chrome.com/docs/ai/built-in",
    sourceTitle: "Chrome Built-in AI Overview",
    linkedNoteIds: ["note-1", "note-6", "note-7"],
    summary: "Overview of Chrome's native window.ai Prompt API allowing client-side execution of Gemini Nano without sending data to servers.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 29,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-3",
    title: "React Server Components vs Client Island Architecture",
    content: `# React Server Components vs Client Island Architecture

Modern React 19 and Next.js 15 architectures bifurcate render execution between zero-bundle server components and interactive client islands.

### Tradeoff Matrix:
- **Server Components**: Zero client bundle footprint, direct database access, static markdown generation.
- **Client Islands**: Full access to browser Web APIs (\`window.ai\`, IndexedDB, Web Speech API, HTML5 Canvas).
- **Serialization Boundary**: Props passed across boundaries must be JSON-serializable.

\`\`\`tsx
// Client Island for On-Device AI Canvas
"use client";
export function KnowledgeGraphCanvas() { /* Canvas physics */ }
\`\`\`
`,
    plainText: "Modern React 19 and Next.js 15 architectures bifurcate render execution between zero-bundle server components and interactive client islands...",
    tags: ["react", "nextjs", "architecture", "performance"],
    isClip: false,
    linkedNoteIds: ["note-1", "note-8"],
    summary: "Comparative analysis of React Server Components and interactive client islands for zero-bundle rendering and browser API access.",
    aiProcessed: true,
    aiMode: "cloud",
    aiLatencyMs: 420,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-4",
    title: "Knowledge Graph Layout Algorithms: Force-Directed vs Hierarchical",
    content: `# Knowledge Graph Layout Algorithms

Visualizing high-dimensional second-brain concept associations requires dynamic physics simulation rather than static rigid layouts.

### Algorithmic Foundations:
1. **Coulomb's Law (Repulsion)**: Like nodes push away inversely with square distance to prevent visual crowding.
2. **Hooke's Law (Spring Attraction)**: Semantic edges pull connected nodes together proportionally to relationship strength.
3. **Velocity Damping**: Friction decay factor (\`damping = 0.92\`) stabilizes layout into harmonic equilibrium at 60 FPS.
`,
    plainText: "Visualizing high-dimensional second-brain concept associations requires dynamic physics simulation rather than static rigid layouts...",
    tags: ["knowledge-graph", "algorithms", "visualization"],
    isClip: true,
    sourceUrl: "https://visualdata.org/graphs/force-directed",
    sourceTitle: "Physics Simulation for Semantic Networks",
    linkedNoteIds: ["note-1", "note-5"],
    summary: "Mathematical foundations of force-directed graph layouts utilizing Coulomb repulsion and Hooke spring attraction at 60 FPS.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-5",
    title: "Leitner System Spaced Repetition Mathematical Interval Formula",
    content: `# Leitner System Mathematical Formula

The Leitner system structures active recall into ascending frequency boxes based on the Ebbinghaus forgetting curve:

$$R = e^{-\\frac{t}{S}}$$

### 3-Tier Interval Schedule:
- **Box 1 (Daily)**: Review interval $I_1 = 1\\text{ day}$ (Initial acquisition).
- **Box 2 (Consolidation)**: Review interval $I_2 = 3\\text{ days}$ (Intermediate memory).
- **Box 3 (Mastery)**: Review interval $I_3 = 7\\text{ days}$ (Long-term retention).

Incorrect answers immediately reset the card to Box 1, guaranteeing active cognitive reinforcement.
`,
    plainText: "The Leitner system structures active recall into ascending frequency boxes based on the Ebbinghaus forgetting curve...",
    tags: ["learning", "algorithms", "flashcards"],
    isClip: false,
    linkedNoteIds: ["note-4"],
    summary: "Mathematical model of spaced repetition scheduling using tiered review intervals to combat the Ebbinghaus forgetting curve.",
    aiProcessed: true,
    aiMode: "cloud",
    aiLatencyMs: 395,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-6",
    title: "Zero-Leak Client-Side Sanitization Best Practices",
    content: `# Zero-Leak Client-Side Sanitization

To guarantee enterprise data privacy before sending requests to cloud LLMs, BrainDrop AI enforces client-side regex redaction across 6 critical entity classes:

### Redaction Patterns:
1. **Email Addresses**: \`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\` → \`[REDACTED_EMAIL]\`
2. **API Keys & Secrets**: \`sk_live_[a-zA-Z0-9]{24,}\` → \`[REDACTED_API_KEY]\`
3. **Credit Cards**: Luhn-validated 16-digit sequences → \`[REDACTED_CARD]\`
4. **Phone Numbers**: Indonesian (+62) and international formats → \`[REDACTED_PHONE]\`
5. **National ID (NIK / SSN)**: 16-digit civil identity strings → \`[REDACTED_ID]\`
6. **IPv4 Addresses**: Internal network octets → \`[REDACTED_IP]\`
`,
    plainText: "To guarantee enterprise data privacy before sending requests to cloud LLMs, BrainDrop AI enforces client-side regex redaction...",
    tags: ["security", "privacy", "regex"],
    isClip: false,
    linkedNoteIds: ["note-1", "note-2"],
    summary: "Comprehensive client-side regex masking specification preventing PII and API credentials from leaving browser memory.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-7",
    title: "Chrome Extension Manifest V3 Side Panel API",
    content: `# Chrome Extension Manifest V3 Side Panel API

Manifest V3 replaces persistent background pages with event-driven service workers and introduces native side panels for contextual companion tools.

### Key Implementation Details:
- **Zero Tab Switching**: The side panel renders alongside active web content.
- **Message Bridge**: Context menu clicks broadcast through \`chrome.runtime.sendMessage\` to write clips into IndexedDB.
- **Content Security Policy**: MV3 bans external script execution, enforcing self-contained local builds.
`,
    plainText: "Manifest V3 replaces persistent background pages with event-driven service workers and introduces native side panels...",
    tags: ["chrome-extension", "mv3", "web-apis", "devtools"],
    isClip: true,
    sourceUrl: "https://developer.chrome.com/docs/extensions/reference/sidePanel",
    sourceTitle: "Chrome Extensions Side Panel Documentation",
    linkedNoteIds: ["note-2"],
    summary: "Guide to building non-disruptive research companions using Chrome Manifest V3 Side Panel and Background Service Workers.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 31,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 84).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-8",
    title: "Turborepo Monorepo Caching Strategies for Next.js 15",
    content: `# Turborepo Monorepo Caching Strategies

Engineering a high-performance hybrid monorepo containing multiple packages (\`@braindrop/core\`, \`@braindrop/ai-logic\`) and applications (\`web\`, \`extension\`).

### Pipeline Architecture:
- **Content-Aware Hash Caching**: Inputs to task trees compute deterministic SHA hashes. Unchanged packages restore instantly from cache in <1s.
- **Topological Sorting**: Core types and utility packages compile prior to dependent Next.js apps.
- **Zero Drift**: Single shared \`tsconfig.json\` and root lockfile guarantee consistent dependency resolution.
`,
    plainText: "Engineering a high-performance hybrid monorepo containing multiple packages and applications with content-aware hash caching...",
    tags: ["turborepo", "monorepo", "nextjs", "devops"],
    isClip: false,
    linkedNoteIds: ["note-3"],
    summary: "Monorepo pipeline architecture leveraging Turborepo content hashing and topological task scheduling for sub-minute builds.",
    aiProcessed: true,
    aiMode: "cloud",
    aiLatencyMs: 440,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    userId: "local-user",
  },
];

interface NotesState {
  notes: NoteStoreItem[];
  activeNoteId: string | null;
  searchQuery: string;
  selectedTag: string | null;
  isAnalyzing: boolean;
  syncStatus: "synced" | "saving" | "offline";

  // Actions
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setSyncStatus: (status: "synced" | "saving" | "offline") => void;

  createNote: (initial?: Partial<NoteStoreItem>) => NoteStoreItem;
  addClipNote: (clip: {
    title: string;
    content: string;
    sourceUrl?: string;
    sourceTitle?: string;
    tags?: string[];
    summary?: string;
    aiMode?: "on-device" | "cloud" | "simulated";
    aiLatencyMs?: number;
  }) => NoteStoreItem;
  importClipsFromApi: () => Promise<number>;
  updateNote: (id: string, updates: Partial<NoteStoreItem>) => void;
  deleteNote: (id: string) => void;
  linkNotes: (noteIdA: string, noteIdB: string) => void;
  addTagToNote: (noteId: string, tag: string) => void;
  removeTagFromNote: (noteId: string, tag: string) => void;
  resetToSeeds: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: INITIAL_SEED_NOTES,
      activeNoteId: "note-1",
      searchQuery: "",
      selectedTag: null,
      isAnalyzing: false,
      syncStatus: "synced",

      setActiveNoteId: (id) => set({ activeNoteId: id }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedTag: (selectedTag) => set({ selectedTag }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),

      createNote: (initial = {}) => {
        const id = `note-${Date.now()}`;
        const newNote: NoteStoreItem = {
          id,
          title: initial.title || "Untitled Note",
          content: initial.content || "",
          plainText: initial.plainText || "",
          tags: initial.tags || [],
          isClip: Boolean(initial.isClip),
          sourceUrl: initial.sourceUrl,
          sourceTitle: initial.sourceTitle,
          linkedNoteIds: initial.linkedNoteIds || [],
          summary: initial.summary || "",
          aiProcessed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "local-user",
          ...initial,
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: id,
          syncStatus: "saving",
        }));

        setTimeout(() => {
          set({ syncStatus: "synced" });
        }, 400);

        return newNote;
      },

      addClipNote: (clip) => {
        const id = `clip-note-${Date.now()}`;
        const newNote: NoteStoreItem = {
          id,
          title: clip.title || "Web Clip",
          content: clip.content,
          plainText: clip.content.replace(/#+\s/g, "").replace(/[`*_[\]]/g, "").trim(),
          tags: clip.tags || ["web-clip"],
          isClip: true,
          sourceUrl: clip.sourceUrl,
          sourceTitle: clip.sourceTitle || clip.title,
          linkedNoteIds: [],
          summary: clip.summary || "",
          aiProcessed: Boolean(clip.summary || clip.tags?.length),
          aiMode: clip.aiMode || "on-device",
          aiLatencyMs: clip.aiLatencyMs || 35,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "local-user",
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: id,
          syncStatus: "saving",
        }));

        setTimeout(() => {
          set({ syncStatus: "synced" });
        }, 400);

        return newNote;
      },

      importClipsFromApi: async () => {
        try {
          const res = await fetch("/api/clips");
          if (!res.ok) return 0;
          const data = await res.json();
          const clips = data.clips || [];

          let importedCount = 0;
          set((state) => {
            const existingIds = new Set(state.notes.map((n) => n.id));
            const newNotes: NoteStoreItem[] = [];

            for (const c of clips) {
              const noteId = c.id || `clip-${Date.now()}`;
              if (!existingIds.has(noteId)) {
                newNotes.push({
                  id: noteId,
                  title: c.sourceTitle || "Web Clip",
                  content: c.text,
                  plainText: c.text,
                  tags: c.tags || ["web-clip"],
                  isClip: true,
                  sourceUrl: c.sourceUrl,
                  sourceTitle: c.sourceTitle,
                  linkedNoteIds: [],
                  summary: c.summary || "",
                  aiProcessed: true,
                  aiMode: "on-device",
                  aiLatencyMs: 40,
                  createdAt: c.createdAt || new Date().toISOString(),
                  updatedAt: c.createdAt || new Date().toISOString(),
                  userId: "local-user",
                });
                importedCount++;
              }
            }

            if (newNotes.length === 0) return state;

            return {
              notes: [...newNotes, ...state.notes],
              syncStatus: "synced",
            };
          });

          return importedCount;
        } catch {
          return 0;
        }
      },

      updateNote: (id, updates) => {
        set((state) => {
          const updatedNotes = state.notes.map((n) => {
            if (n.id !== id) return n;
            return {
              ...n,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          });
          return {
            notes: updatedNotes,
            syncStatus: "saving",
          };
        });

        setTimeout(() => {
          set({ syncStatus: "synced" });
        }, 500);
      },

      deleteNote: (id) => {
        set((state) => {
          const remainingNotes = state.notes.filter((n) => n.id !== id);
          const nextActiveId =
            state.activeNoteId === id
              ? remainingNotes[0]?.id ?? null
              : state.activeNoteId;

          return {
            notes: remainingNotes,
            activeNoteId: nextActiveId,
          };
        });
      },

      linkNotes: (noteIdA, noteIdB) => {
        if (!noteIdA || !noteIdB || noteIdA === noteIdB) return;
        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id === noteIdA) {
              const existing = n.linkedNoteIds || [];
              if (!existing.includes(noteIdB)) {
                return {
                  ...n,
                  linkedNoteIds: [...existing, noteIdB],
                  updatedAt: new Date().toISOString(),
                };
              }
            }
            if (n.id === noteIdB) {
              const existing = n.linkedNoteIds || [];
              if (!existing.includes(noteIdA)) {
                return {
                  ...n,
                  linkedNoteIds: [...existing, noteIdA],
                  updatedAt: new Date().toISOString(),
                };
              }
            }
            return n;
          }),
        }));
      },

      addTagToNote: (noteId, rawTag) => {
        const cleanTag = rawTag.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (!cleanTag) return;

        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id !== noteId) return n;
            if (n.tags.includes(cleanTag)) return n;
            return {
              ...n,
              tags: [...n.tags, cleanTag],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeTagFromNote: (noteId, tagToRemove) => {
        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id !== noteId) return n;
            return {
              ...n,
              tags: n.tags.filter((t) => t !== tagToRemove),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      resetToSeeds: () => {
        set({
          notes: INITIAL_SEED_NOTES,
          activeNoteId: "note-1",
          searchQuery: "",
          selectedTag: null,
        });
      },
    }),
    {
      name: "braindrop_notes_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
      }),
    }
  )
);
