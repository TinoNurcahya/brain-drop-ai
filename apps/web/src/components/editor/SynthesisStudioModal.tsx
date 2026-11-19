"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  FileText,
  Copy,
  Check,
  Download,
  ArrowRight,
  Layers,
  BookOpen,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { NoteStoreItem, useNotesStore } from "@/stores/notes-store";

interface SynthesisStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNotes: NoteStoreItem[];
}

export function SynthesisStudioModal({
  isOpen,
  onClose,
  selectedNotes,
}: SynthesisStudioModalProps) {
  const [synthesisMode, setSynthesisMode] = useState<
    "comprehensive" | "comparative" | "actionable"
  >("comprehensive");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<{
    title: string;
    markdown: string;
    abstract: string;
    keyInsights: string[];
    source: string;
    latencyMs: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const createNote = useNotesStore((state) => state.createNote);
  const setActiveNoteId = useNotesStore((state) => state.setActiveNoteId);

  if (!isOpen) return null;

  const handleGenerateSynthesis = async () => {
    setIsSynthesizing(true);
    setSynthesisResult(null);

    try {
      const res = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: selectedNotes.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content || n.plainText,
            sourceUrl: n.sourceUrl,
            tags: n.tags,
          })),
          synthesisMode,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengompilasi sintesis multi-catatan.");
      }

      const data = await res.json();
      setSynthesisResult({
        title: data.title,
        markdown: data.markdown,
        abstract: data.abstract,
        keyInsights: data.keyInsights || [],
        source: data.source,
        latencyMs: data.latencyMs,
      });

      toast.success("Executive Research Brief berhasil dihasilkan!", {
        description: `Disintesis dari ${selectedNotes.length} catatan via ${data.source} (${data.latencyMs}ms).`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sintesis gagal.";
      toast.error(msg);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveToVault = () => {
    if (!synthesisResult) return;

    const sourceTags = Array.from(
      new Set(selectedNotes.flatMap((n) => n.tags))
    ).slice(0, 4);

    const newNote = createNote({
      title: synthesisResult.title,
      content: synthesisResult.markdown,
      plainText: synthesisResult.abstract,
      tags: ["synthesis", "research-brief", ...sourceTags],
      isClip: false,
      linkedNoteIds: selectedNotes.map((n) => n.id),
      summary: synthesisResult.abstract,
      aiProcessed: true,
      aiMode: "cloud",
      aiLatencyMs: synthesisResult.latencyMs,
    });

    setActiveNoteId(newNote.id);
    toast.success("Brief tersimpan ke vault catatan!", {
      description: `Otomatis terhubung ke ${selectedNotes.length} catatan sumber di Knowledge Graph.`,
    });
    onClose();
  };

  const handleCopyMarkdown = async () => {
    if (!synthesisResult) return;
    await navigator.clipboard.writeText(synthesisResult.markdown);
    setCopied(true);
    toast.info("Markdown berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--overlay)] backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl overflow-hidden text-[var(--text-primary)]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Multi-Note Research Synthesis Studio</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-[var(--accent-violet)] border border-indigo-500/30">
                  Firebase AI Logic
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Kompilasi dan temukan benang merah dari {selectedNotes.length} dokumen sekaligus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selected Notes Bar */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
              Dokumen Terpilih ({selectedNotes.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedNotes.map((note, idx) => (
                <div
                  key={note.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] max-w-[280px]"
                >
                  <FileText className="w-3.5 h-3.5 text-[var(--accent-cyan)] shrink-0" />
                  <span className="truncate font-medium">
                    [{idx + 1}] {note.title || "Untitled Note"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
              Sudut Pandang Sintesis
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "comprehensive",
                  label: "Comprehensive Brief",
                  desc: "Rangkuman eksekutif lengkap dengan konvergensi tema utama",
                },
                {
                  id: "comparative",
                  label: "Comparative Analysis",
                  desc: "Analisis komparatif, pro-kontra, dan resolusi kontradiksi",
                },
                {
                  id: "actionable",
                  label: "Actionable Roadmap",
                  desc: "Ekstraksi langkah aksi praktis dan checklist implementasi",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSynthesisMode(m.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    synthesisMode === m.id
                      ? "bg-cyan-500/10 border-cyan-400/50 shadow-sm shadow-cyan-500/20 text-[var(--text-primary)]"
                      : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text-primary)] mb-1 flex items-center justify-between">
                    <span>{m.label}</span>
                    {synthesisMode === m.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button (if not generated yet) */}
          {!synthesisResult && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleGenerateSynthesis}
                disabled={isSynthesizing}
                className="px-8 py-3.5 rounded-full bg-[image:var(--gradient-primary)] text-white font-semibold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span>
                  {isSynthesizing
                    ? "Menganalisis & Menyusun Sintesis..."
                    : `Sintesis ${selectedNotes.length} Catatan (Gemini 3.8 Flash)`}
                </span>
              </button>
            </div>
          )}

          {/* Generated Result Preview */}
          {synthesisResult && (
            <div className="space-y-4 pt-2 border-t border-[var(--border)] animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[var(--accent-emerald)] font-bold">
                    {synthesisResult.source}
                  </span>
                  <span>•</span>
                  <span>Latency: {synthesisResult.latencyMs}ms</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[var(--accent-emerald)]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin" : "Salin MD"}</span>
                  </button>

                  <button
                    onClick={handleGenerateSynthesis}
                    disabled={isSynthesizing}
                    className="px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              {/* Key Insights Pills */}
              {synthesisResult.keyInsights.length > 0 && (
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                  <div className="text-xs font-bold text-[var(--accent-cyan)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Executive Takeaways</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-[var(--text-secondary)] pl-4 list-disc">
                    {synthesisResult.keyInsights.map((insight, i) => (
                      <li key={i} className="leading-relaxed">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Markdown Content Box */}
              <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] max-h-[340px] overflow-y-auto space-y-3 font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
                {synthesisResult.markdown}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            Batal
          </button>

          {synthesisResult && (
            <button
              onClick={handleSaveToVault}
              className="px-6 py-2.5 rounded-full bg-[image:var(--gradient-primary)] text-white font-semibold text-xs hover:opacity-95 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>💾 Simpan Sebagai Catatan Vault Baru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
