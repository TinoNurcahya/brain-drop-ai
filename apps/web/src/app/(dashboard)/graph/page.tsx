"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Network,
  Search,
  Sparkles,
  Tag,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
  RotateCcw,
  Plus,
  Cpu,
} from "lucide-react";
import { useNotesStore, NoteStoreItem } from "@/stores/notes-store";
import { KnowledgeGraphCanvas } from "@/components/graph/KnowledgeGraphCanvas";

export default function GraphPage() {
  const router = useRouter();
  const { notes, setActiveNoteId, resetToSeeds, createNote } = useNotesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAiLinks, setShowAiLinks] = useState(true);
  const [selectedNote, setSelectedNote] = useState<NoteStoreItem | null>(null);

  // Extract all unique tags across notes for filtering
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const note of notes) {
      for (const tag of note.tags || []) {
        set.add(tag);
      }
    }
    return Array.from(set);
  }, [notes]);

  // Calculate approximate edges count for the HUD
  const edgeCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const shared = (notes[i].tags || []).some((t) =>
          (notes[j].tags || []).includes(t)
        );
        const linked =
          notes[i].linkedNoteIds?.includes(notes[j].id) ||
          notes[j].linkedNoteIds?.includes(notes[i].id);
        if (shared || linked) count++;
      }
    }
    return count;
  }, [notes]);

  // Find direct neighbors for the selected note
  const selectedNeighbors = useMemo(() => {
    if (!selectedNote) return [];
    return notes.filter((n) => {
      if (n.id === selectedNote.id) return false;
      const sharedTag = (n.tags || []).some((t) =>
        (selectedNote.tags || []).includes(t)
      );
      const isLinked =
        selectedNote.linkedNoteIds?.includes(n.id) ||
        n.linkedNoteIds?.includes(selectedNote.id);
      return sharedTag || isLinked;
    });
  }, [selectedNote, notes]);

  const handleOpenInEditor = (noteId: string) => {
    setActiveNoteId(noteId);
    router.push("/notes");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      {/* Top Controls Toolbar */}
      <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0 z-10">
        {/* Left: Title & Live Metrics */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/20">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              Semantic Knowledge Graph
              <span className="text-[10px] font-normal text-[var(--accent-emerald)] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Dynamic
              </span>
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              {notes.length} notes · {edgeCount} semantic links · {allTags.length} topic clusters
            </p>
          </div>
        </div>

        {/* Right: Search, Tag Filter, and AI Link Toggle */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Node Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Filter nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] w-44 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Tag Filter Selector */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1">
              <select
                value={selectedTag || ""}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
              >
                <option value="">All Topics ({allTags.length})</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    #{t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* AI Semantic Links Toggle */}
          <button
            onClick={() => setShowAiLinks(!showAiLinks)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              showAiLinks
                ? "bg-[var(--accent-purple)]/15 border border-[var(--accent-purple)]/40 text-[var(--accent-purple)] shadow-sm"
                : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]"
            }`}
            title="Toggle AI Discovered Semantic Cross-Links"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Links</span>
          </button>
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Network className="w-16 h-16 text-[var(--text-muted)] opacity-30" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              No Notes in Vault
            </h2>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              Your knowledge graph creates associative networks between your notes. Load demo notes to explore.
            </p>
            <button
              onClick={resetToSeeds}
              className="px-4 py-2 rounded-lg bg-[image:var(--gradient-primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Load Demo Knowledge Graph
            </button>
          </div>
        ) : (
          <KnowledgeGraphCanvas
            notes={notes}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onSelectNode={(note) => setSelectedNote(note)}
            showAiLinks={showAiLinks}
          />
        )}

        {/* Selected Node Inspector Flyout (Slide-over Card) */}
        {selectedNote && (
          <div className="absolute top-4 right-4 w-84 sm:w-96 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border)] shadow-2xl p-5 backdrop-blur-xl space-y-4 animate-in fade-in slide-in-from-right-4 duration-200 z-20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded-full border border-[var(--accent-blue)]/20">
                  {selectedNote.isClip ? "📎 Web Clip Node" : "📝 Note Node"}
                </span>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mt-1.5 line-clamp-2">
                  {selectedNote.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary */}
            <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/70 border border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed">
              {selectedNote.summary || selectedNote.plainText || (
                <span className="italic text-[var(--text-muted)]">No summary recorded.</span>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Cluster Tags
              </span>
              <div className="flex flex-wrap gap-1">
                {(selectedNote.tags || []).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[11px] bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Connected Neighbors in Graph */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span className="font-semibold uppercase tracking-wider">
                  Connected Notes ({selectedNeighbors.length})
                </span>
              </div>

              {selectedNeighbors.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedNeighbors.map((neighbor) => (
                    <button
                      key={neighbor.id}
                      onClick={() => setSelectedNote(neighbor)}
                      className="w-full text-left p-2 rounded-lg bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] border border-[var(--border)]/60 hover:border-[var(--accent-blue)] transition-colors group flex items-center justify-between"
                    >
                      <span className="text-xs text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-blue)]">
                        {neighbor.title}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)] italic">
                  No other notes in the vault currently share tags with this note.
                </p>
              )}
            </div>

            {/* Action: Open in Tiptap Editor */}
            <button
              onClick={() => handleOpenInEditor(selectedNote.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-[image:var(--gradient-primary)] text-white text-xs font-semibold hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Open in Notes Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
