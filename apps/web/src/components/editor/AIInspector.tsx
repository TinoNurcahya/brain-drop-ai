"use client";

import { useState } from "react";
import {
  Sparkles,
  Cpu,
  Cloud,
  CheckCircle2,
  Clock,
  Tag as TagIcon,
  Plus,
  X,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Network,
} from "lucide-react";
import { toast } from "sonner";
import { useNotesStore, NoteStoreItem } from "@/stores/notes-store";

interface AIInspectorProps {
  note: NoteStoreItem;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function AIInspector({ note, onAnalyze, isAnalyzing }: AIInspectorProps) {
  const [newTagInput, setNewTagInput] = useState("");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const { notes, addTagToNote, removeTagFromNote, setActiveNoteId, setSelectedTag } =
    useNotesStore();

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    addTagToNote(note.id, newTagInput);
    setNewTagInput("");
    toast.success("Tag added");
  };

  const handleCopySummary = () => {
    if (!note.summary) return;
    navigator.clipboard.writeText(note.summary);
    setCopiedSummary(true);
    toast.success("Summary copied to clipboard");
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const linkedNotes = notes.filter((n) => note.linkedNoteIds?.includes(n.id));

  return (
    <aside className="w-80 border-l border-[var(--border)] bg-[var(--bg-secondary)]/40 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-purple)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            AI Copilot & Insights
          </h2>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
          title="Regenerate AI Analysis"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin text-[var(--accent-blue)]" : ""}`} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Model Inference & Telemetry Badge */}
        <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Inference Mode</span>
            {note.aiMode === "on-device" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-3 h-3" /> Gemini Nano (Local)
              </span>
            ) : note.aiMode === "cloud" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Cloud className="w-3 h-3" /> Gemini 3.8 Flash
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-3 h-3" /> Smart Heuristic
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1 text-[var(--text-muted)]">
              <Clock className="w-3 h-3" /> Latency
            </span>
            <span className="font-mono text-[11px] text-[var(--text-primary)]">
              {note.aiLatencyMs ? `${note.aiLatencyMs} ms` : isAnalyzing ? "measuring..." : "< 50 ms"}
            </span>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 pt-1 border-t border-[var(--border)]/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              {note.aiMode === "on-device"
                ? "Zero data left your device. Kept 100% local."
                : "Protected via client sanitizer & edge proxy."}
            </span>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Executive Summary
            </h3>
            {note.summary && (
              <button
                onClick={handleCopySummary}
                className="text-[11px] text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors"
                title="Copy Summary"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/70 border border-[var(--border)] min-h-[75px] relative">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2 text-xs text-[var(--text-muted)]">
                <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-blue)]" />
                <span>AI extracting core insights...</span>
              </div>
            ) : note.summary ? (
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {note.summary}
              </p>
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">
                Start typing notes or press regenerate to produce an instant executive summary.
              </p>
            )}
          </div>
        </div>

        {/* Smart Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
              <TagIcon className="w-3 h-3" /> Smart Tags
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {note.tags.length} tags
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-colors group"
              >
                <button
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className="hover:text-[var(--accent-blue)]"
                  title={`Filter by #${tag}`}
                >
                  #{tag}
                </button>
                <button
                  type="button"
                  onClick={() => removeTagFromNote(note.id, tag)}
                  className="text-[var(--text-muted)] hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5"
                  title="Remove Tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Tag Form */}
          <form onSubmit={handleAddTag} className="flex gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Add tag..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
            />
            <button
              type="submit"
              disabled={!newTagInput.trim()}
              className="px-2.5 py-1 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)] disabled:opacity-30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Linked / Related Notes in Vault */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
              <Network className="w-3 h-3" /> Semantic Graph Links
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {linkedNotes.length} linked
            </span>
          </div>

          {linkedNotes.length > 0 ? (
            <div className="space-y-1.5">
              {linkedNotes.map((ln) => (
                <button
                  key={ln.id}
                  onClick={() => setActiveNoteId(ln.id)}
                  className="w-full text-left p-2 rounded-md bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent-blue)] hover:bg-[var(--bg-tertiary)] transition-colors group flex items-start justify-between"
                >
                  <span className="text-xs text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-blue)]">
                    {ln.title}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[var(--text-muted)] shrink-0 ml-1 mt-0.5 group-hover:text-[var(--accent-blue)]" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] italic">
              No direct semantic links yet. Similar tags will connect this note in the Knowledge Graph.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
