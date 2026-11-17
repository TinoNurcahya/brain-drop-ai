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

Firebase AI Logic provides a unified orchestration layer to dynamically switch between on-device inference (via Chrome Built-in AI Gemini Nano) and high-throughput cloud models (Gemini 3.8 Flash).

### Key Architectural Pillars:
- **Zero-latency local processing** for privacy-sensitive tasks: note summarization, PII redaction, instant tagging.
- **Automatic Fallback** to Cloud Gemini 3.8 Flash when device memory or capabilities are constrained.
- **Unified Telemetry**: Real-time tracking of latency, token savings, and on-device compute ratios.

\`\`\`typescript
const result = await aiRouter.runTask({
  type: "summarize",
  input: rawNoteContent
});
\`\`\`
`,
    plainText: "Firebase AI Logic provides a unified orchestration layer to dynamically switch between on-device inference and high-throughput cloud models...",
    tags: ["firebase", "hybrid-ai", "gemini-nano", "architecture"],
    isClip: false,
    linkedNoteIds: ["note-2", "note-3"],
    summary: "Architecture guide for hybrid on-device (Gemini Nano) and cloud (Gemini 3.8 Flash) AI routing with zero-latency local processing.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-2",
    title: "Chrome Prompt API: Built-in Gemini Nano in Web Apps",
    content: `# Chrome Prompt API & Gemini Nano

The \`window.ai\` Prompt API enables web applications to run the lightweight Gemini Nano model directly inside Chrome without backend round-trips.

### Capabilities:
- Summarization API (\`window.ai.summarizer\`)
- Language Model API (\`window.ai.languageModel\`)
- Writer & Rewriter APIs for text polish

> **Privacy Guarantee**: All user keystrokes remain confined to client memory. No telemetry or plain text leaves the browser during local inference.
`,
    plainText: "The window.ai Prompt API enables web applications to run the lightweight Gemini Nano model directly inside Chrome...",
    tags: ["chrome-ai", "gemini-nano", "privacy", "web-apis"],
    isClip: true,
    sourceUrl: "https://developer.chrome.com/docs/ai/built-in",
    sourceTitle: "Chrome Built-in AI Overview",
    linkedNoteIds: ["note-1"],
    summary: "Overview of Chrome's native window.ai Prompt API allowing client-side execution of Gemini Nano without sending data to servers.",
    aiProcessed: true,
    aiMode: "on-device",
    aiLatencyMs: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    userId: "local-user",
  },
  {
    id: "note-3",
    title: "Interactive Knowledge Graph Construction",
    content: `# Interactive Knowledge Graph

Transforming linear notes into an associative semantic memory network.

### Graph Generation Rules:
1. **Shared Tag Clustering**: Notes with matching tags form preliminary cluster edges.
2. **AI Semantic Linker**: Cloud AI analyzes topic affinity and predicts connection weights (0.0 to 1.0).
3. **Interactive Force Simulation**: Nodes attract and repel based on edge weights.
`,
    plainText: "Transforming linear notes into an associative semantic memory network with shared tag clustering and AI link predictions.",
    tags: ["knowledge-graph", "react-flow", "visualization"],
    isClip: false,
    linkedNoteIds: ["note-1"],
    summary: "Technical notes on constructing interactive associative graphs from notes using tag clustering and semantic similarity.",
    aiProcessed: true,
    aiMode: "cloud",
    aiLatencyMs: 412,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
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
