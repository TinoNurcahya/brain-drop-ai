"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Sparkles,
  Tag,
  X,
  PanelRightClose,
  PanelRightOpen,
  Check,
  FileText,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useNotesStore, NoteStoreItem } from "@/stores/notes-store";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { AIInspector } from "@/components/editor/AIInspector";

export default function NotesPage() {
  const {
    notes,
    activeNoteId,
    searchQuery,
    selectedTag,
    syncStatus,
    setActiveNoteId,
    setSearchQuery,
    setSelectedTag,
    createNote,
    updateNote,
    deleteNote,
    resetToSeeds,
  } = useNotesStore();

  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active note lookup
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || null;

  // Filter notes based on search query and selected tag
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === null || n.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Trigger AI Analysis (Hybrid: On-Device Nano -> API Route Cloud/Heuristic)
  const triggerAiAnalysis = useCallback(async (noteToAnalyze: NoteStoreItem) => {
    if (!noteToAnalyze.content || noteToAnalyze.content.trim().length < 20) {
      return;
    }

    setIsAnalyzing(true);
    const startMs = performance.now();

    try {
      // 1. Check if Chrome Built-in AI (Gemini Nano) is available locally in the browser
      const winAi = typeof window !== "undefined" ? (window as any).ai : null;

      if (winAi?.languageModel) {
        try {
          const session = await winAi.languageModel.create();
          const prompt = `Analyze this note and provide:
1. A 1-2 sentence executive summary.
2. 3-5 lowercase tags separated by commas.

Content:
${noteToAnalyze.content.slice(0, 1500)}`;

          const response = await session.prompt(prompt);
          session.destroy();

          const latencyMs = Math.round(performance.now() - startMs);
          const lines = response.split("\n").filter((l: string) => l.trim().length > 0);
          const summary = lines[0] || "Summary generated locally on-device.";
          const tagMatches = response.match(/#[a-z0-9_-]+|[a-z0-9_-]{3,}/gi) || [];
          const newTags = Array.from(
            new Set([...noteToAnalyze.tags, ...tagMatches.slice(0, 4).map((t: string) => t.toLowerCase())])
          );

          updateNote(noteToAnalyze.id, {
            summary,
            tags: newTags,
            aiProcessed: true,
            aiMode: "on-device",
            aiLatencyMs: latencyMs,
          });

          toast.success("AI Insights updated (Gemini Nano on-device)");
          setIsAnalyzing(false);
          return;
        } catch {
          // On-device failed or user cancelled, fall through to cloud API route
        }
      }

      // 2. Call server-side API route (/api/ai/analyze) with Gemini 3.8 Flash / Heuristic
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteToAnalyze.title,
          content: noteToAnalyze.content,
          existingTags: noteToAnalyze.tags,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze note");

      const data = await res.json();

      updateNote(noteToAnalyze.id, {
        summary: data.summary,
        tags: data.tags,
        aiProcessed: true,
        aiMode: data.mode === "cloud" ? "cloud" : "simulated",
        aiLatencyMs: data.latencyMs,
      });

      toast.success(
        data.mode === "cloud"
          ? "AI Insights generated (Gemini 3.8 Flash)"
          : "AI Insights generated (Smart Heuristic Engine)"
      );
    } catch (err) {
      console.error("AI Analysis error:", err);
      toast.error("AI analysis could not be completed.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateNote]);

  // Handle Editor Content Change with Debounced AI Analysis
  const handleEditorChange = (newMarkdown: string, plainText: string) => {
    if (!activeNote) return;

    updateNote(activeNote.id, {
      content: newMarkdown,
      plainText,
    });

    // Reset previous debounced timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce trigger after 3 seconds of typing idle
    debounceTimerRef.current = setTimeout(() => {
      const currentNote = useNotesStore
        .getState()
        .notes.find((n) => n.id === activeNote.id);
      if (currentNote && currentNote.content.length > 30) {
        triggerAiAnalysis(currentNote);
      }
    }, 3000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { title: e.target.value });
  };

  const handleNewNote = () => {
    const created = createNote({
      title: "Untitled Note",
      content: "",
      plainText: "",
      tags: [],
    });
    setActiveNoteId(created.id);
    toast.success("Created new note");
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(id);
    toast.info("Note deleted");
  };

  // Word count & stats
  const wordCount = activeNote?.plainText
    ? activeNote.plainText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[var(--bg-primary)]">
      {/* LEFT PANEL: Note Explorer & Vault List */}
      <aside className="w-80 border-r border-[var(--border)] bg-[var(--bg-secondary)]/30 flex flex-col shrink-0">
        {/* Header Search & Actions */}
        <div className="p-4 border-b border-[var(--border)] space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search notes, tags, ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Active Tag Filter Pill */}
          {selectedTag && (
            <div className="flex items-center justify-between px-2.5 py-1 rounded bg-[var(--accent-blue)]/15 border border-[var(--accent-blue)]/30 text-xs text-[var(--accent-blue)]">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" /> #{selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="hover:text-white"
                title="Clear filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleNewNote}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white text-xs font-medium hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]/40">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
              <p className="text-xs text-[var(--text-muted)]">No notes match your filter.</p>
              <button
                onClick={resetToSeeds}
                className="inline-flex items-center gap-1 text-xs text-[var(--accent-blue)] hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Load demo notes
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3.5 cursor-pointer hover:bg-[var(--bg-tertiary)]/70 transition-colors group relative ${
                    isSelected
                      ? "bg-[var(--bg-tertiary)] border-l-2 border-l-[var(--accent-blue)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1 flex-1">
                      {note.isClip && <span className="mr-1">📎</span>}
                      {note.title || "Untitled Note"}
                    </h3>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 text-[var(--text-muted)] p-1 rounded transition-opacity"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mb-2 leading-relaxed">
                    {note.summary || note.plainText || "Empty note content..."}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-1 overflow-hidden">
                      {note.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] truncate max-w-[80px]"
                        >
                          #{t}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-[9px]">+{note.tags.length - 2}</span>
                      )}
                    </div>

                    {note.aiProcessed && (
                      <span className="flex items-center gap-0.5 text-emerald-400/80">
                        <Sparkles className="w-2.5 h-2.5" /> AI
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* CENTER PANEL: Main Workspace & Tiptap Editor */}
      {activeNote ? (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-primary)]">
          {/* Top Title Bar */}
          <div className="px-6 py-3 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--bg-secondary)]/30 shrink-0">
            <input
              type="text"
              value={activeNote.title}
              onChange={handleTitleChange}
              placeholder="Note title..."
              className="flex-1 text-base md:text-lg font-bold bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />

            <div className="flex items-center gap-3 shrink-0">
              {/* Sync Status Badge */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                {syncStatus === "saving" ? (
                  <span className="text-amber-400 text-[11px]">Saving...</span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                    <Check className="w-3 h-3" /> Synced Local
                  </span>
                )}
              </div>

              <span className="text-xs text-[var(--text-muted)] font-mono">
                {wordCount} words
              </span>

              {/* Toggle AI Inspector */}
              <button
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className={`p-1.5 rounded-lg border border-[var(--border)] text-xs flex items-center gap-1 transition-colors ${
                  isAiPanelOpen
                    ? "bg-[var(--accent-purple)]/15 border-[var(--accent-purple)]/40 text-[var(--accent-purple)]"
                    : "hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                }`}
                title={isAiPanelOpen ? "Collapse AI Panel" : "Expand AI Panel"}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiPanelOpen ? (
                  <PanelRightClose className="w-3.5 h-3.5" />
                ) : (
                  <PanelRightOpen className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <TiptapEditor
            content={activeNote.content}
            onChange={handleEditorChange}
            placeholder="Write your note in rich text or markdown. AI will summarize and extract tags automatically..."
          />
        </main>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <FileText className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            No Note Selected
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm">
            Select an existing note from the explorer or create a new one to begin editing.
          </p>
          <button
            onClick={handleNewNote}
            className="px-4 py-2 rounded-lg bg-[var(--accent-blue)] text-white text-xs font-medium hover:opacity-90"
          >
            + Create First Note
          </button>
        </div>
      )}

      {/* RIGHT PANEL: AI Inspector & Telemetry */}
      {activeNote && isAiPanelOpen && (
        <AIInspector
          note={activeNote}
          onAnalyze={() => triggerAiAnalysis(activeNote)}
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
}
