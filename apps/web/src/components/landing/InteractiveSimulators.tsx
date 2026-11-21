"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Cpu,
  Database,
  ArrowUpRight,
  CheckCircle2,
  BookmarkCheck,
  Search,
  Zap,
  ShieldCheck,
  RotateCcw,
  Layers,
  Network,
} from "lucide-react";

/* ==========================================================================
   SIMULATOR 1: CHROME MV3 WEB CLIPPER SANDBOX
   ========================================================================== */
interface ArticleHighlight {
  id: string;
  source: string;
  title: string;
  quote: string;
  tags: string[];
  nanoInsight: string;
}

const PRESET_HIGHLIGHTS: ArticleHighlight[] = [
  {
    id: "arxiv-attn",
    source: "arxiv.org/abs/1706.03762",
    title: "Attention Is All You Need (Vaswani et al.)",
    quote:
      "We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.",
    tags: ["#transformer", "#attention", "#deeplearning"],
    nanoInsight: "Replaces sequential recurrence with parallel self-attention dot products across all tokens.",
  },
  {
    id: "chrome-ai",
    source: "developer.chrome.com/docs/ai/built-in",
    title: "Chrome Built-in AI with Gemini Nano",
    quote:
      "Built-in AI provides web applications access to on-device Gemini Nano without deploying custom models or exposing sensitive user prompts to cloud endpoints.",
    tags: ["#window-ai", "#on-device", "#privacy"],
    nanoInsight: "Client-side NPU inference ensures zero external data packet transmission for raw thoughts.",
  },
  {
    id: "ebbinghaus",
    source: "nature.com/articles/memory-consolidation",
    title: "Synaptic Plasticity & Spaced Memory Consolidation",
    quote:
      "The spacing effect demonstrates that learning is substantially more robust when study sessions are spaced out over expanding intervals rather than massed in one cramming session.",
    tags: ["#leitner", "#active-recall", "#neuroscience"],
    nanoInsight: "Inverts standard forgetting curves by scheduling flashcards at peak synaptic vulnerability.",
  },
];

export function ClipperSimulator() {
  const [selectedHighlight, setSelectedHighlight] = useState<ArticleHighlight>(PRESET_HIGHLIGHTS[0]);
  const [clipState, setClipState] = useState<"idle" | "processing" | "clipped">("idle");
  const [latencyMs, setLatencyMs] = useState(48);

  const handleSimulateClip = () => {
    if (clipState === "processing") return;
    setClipState("processing");

    // Randomize micro-latency around ~38ms - 52ms
    const generatedLatency = Math.floor(Math.random() * 15) + 38;
    setLatencyMs(generatedLatency);

    setTimeout(() => {
      setClipState("clipped");
    }, 650);
  };

  const handleReset = () => {
    setClipState("idle");
  };

  return (
    <div className="simulator-card clipper-simulator-card">
      {/* Top Header */}
      <div className="simulator-header">
        <div className="flex items-center gap-2">
          <BookmarkCheck size={16} className="text-[var(--spatial-cyan)]" />
          <span className="simulator-title">Chrome MV3 Web Clipper Sandbox</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--spatial-emerald)] animate-pulse" />
          <span className="text-[10.5px] font-mono text-[var(--spatial-emerald)]">LOCAL NPU ACTIVE</span>
        </div>
      </div>

      <div className="simulator-body p-5 space-y-4">
        {/* Preset Selector */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--spatial-text-muted)]">
            Select Reading Environment:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_HIGHLIGHTS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  setSelectedHighlight(h);
                  setClipState("idle");
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all border ${
                  selectedHighlight.id === h.id
                    ? "bg-[var(--spatial-cyan)] text-[#0b1116] border-[var(--spatial-cyan)] font-semibold shadow-sm"
                    : "bg-[var(--spatial-surface)] text-[var(--spatial-text-secondary)] border-[var(--spatial-border)] hover:border-[var(--spatial-border-hover)]"
                }`}
              >
                {h.title.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Mock Browser Window */}
        <div className="rounded-xl border border-[var(--spatial-border)] bg-[var(--spatial-surface)]/60 p-4 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-[var(--spatial-border)] pb-2 text-[var(--spatial-text-muted)]">
            <span className="truncate max-w-[260px] text-[var(--spatial-cyan)]">
              https://{selectedHighlight.source}
            </span>
            <span className="hidden sm:inline text-[var(--spatial-text-muted)]">Shortcut: ⌘ + ⇧ + K</span>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-[var(--spatial-text-main)] leading-relaxed select-none">
            &ldquo;{selectedHighlight.quote}&rdquo;
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--spatial-text-muted)]">
              <ShieldCheck size={13} className="text-[var(--spatial-emerald)]" />
              <span>Zero Data Packets to Cloud</span>
            </div>

            <div className="flex items-center gap-2">
              {clipState === "clipped" && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded text-[var(--spatial-text-muted)] hover:text-[var(--spatial-text-main)] hover:bg-[var(--spatial-border)] transition-colors"
                  title="Reset Simulation"
                >
                  <RotateCcw size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={handleSimulateClip}
                disabled={clipState === "processing"}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  clipState === "clipped"
                    ? "bg-[var(--spatial-emerald)] text-[#0b1116]"
                    : "bg-[var(--spatial-cyan)] text-[#0b1116] hover:brightness-110 active:scale-95"
                }`}
              >
                {clipState === "processing" ? (
                  <>
                    <Cpu size={13} className="animate-spin" />
                    <span>Parsing on NPU...</span>
                  </>
                ) : clipState === "clipped" ? (
                  <>
                    <CheckCircle2 size={13} />
                    <span>Saved to Vault ({latencyMs}ms)</span>
                  </>
                ) : (
                  <>
                    <Zap size={13} />
                    <span>Simulate Clip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Local Vault Note Preview */}
        {clipState === "clipped" && (
          <div className="rounded-xl border border-[var(--spatial-emerald)]/40 bg-[var(--spatial-surface)] p-3.5 space-y-2 animate-fade-in shadow-lg">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--spatial-emerald)] font-semibold flex items-center gap-1">
                <Sparkles size={12} />
                <span>ATOMIC NOTE CREATED · ~{latencyMs}MS</span>
              </span>
              <span className="text-[var(--spatial-text-muted)]">INDEXEDDB EMBEDDED</span>
            </div>
            <div className="text-xs text-[var(--spatial-text-main)] font-medium">
              {selectedHighlight.nanoInsight}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedHighlight.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--spatial-border)] text-[var(--spatial-cyan)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   SIMULATOR 2: REAL-TIME VECTOR SIMILARITY & SEMANTIC TOPOLOGY EXPLORER
   ========================================================================== */
interface VectorConcept {
  id: string;
  name: string;
  category: string;
  similarNotes: { title: string; score: number; relation: string }[];
}

const VECTOR_PRESETS: VectorConcept[] = [
  {
    id: "transformer",
    name: "Transformer Attention",
    category: "Neural Architectures",
    similarNotes: [
      { title: "Self-Attention Query-Key Matrix", score: 0.95, relation: "Mathematical Primitive" },
      { title: "Contextual Sequence Modeling", score: 0.91, relation: "Direct Predecessor" },
      { title: "Gemini 3.8 Flash Context Window", score: 0.86, relation: "Scaling Architecture" },
      { title: "Active Recall Study Cards", score: 0.42, relation: "Peripheral Affinity" },
    ],
  },
  {
    id: "nano",
    name: "On-Device Gemini Nano",
    category: "Edge Computing",
    similarNotes: [
      { title: "Chrome Built-in AI window.ai", score: 0.96, relation: "Core Runtime Host" },
      { title: "Local NPU Hardware Acceleration", score: 0.92, relation: "Execution Target" },
      { title: "Client PII Sanitization Shield", score: 0.88, relation: "Privacy Dependency" },
      { title: "Force-Directed Graph Vectors", score: 0.54, relation: "Peripheral Affinity" },
    ],
  },
  {
    id: "ebbinghaus",
    name: "Ebbinghaus Active Recall",
    category: "Cognitive Science",
    similarNotes: [
      { title: "Leitner Box Expanding Schedule", score: 0.97, relation: "Mathematical Decay Inversion" },
      { title: "Retrieval Practice Testing Effect", score: 0.93, relation: "Pedagogical Sister" },
      { title: "Desirable Difficulty in Memorization", score: 0.87, relation: "Theoretical Basis" },
      { title: "Transformer Self-Attention", score: 0.38, relation: "Peripheral Affinity" },
    ],
  },
  {
    id: "privacy",
    name: "Zero-Leakage Privacy",
    category: "Security Architecture",
    similarNotes: [
      { title: "Cryptographic Firebase App Check", score: 0.94, relation: "Attestation Layer" },
      { title: "Local IndexedDB Vector Store", score: 0.91, relation: "Data Enclave" },
      { title: "Air-Gapped Note Parsing", score: 0.89, relation: "Failure State Guard" },
      { title: "Study Flashcard Repetition", score: 0.44, relation: "Peripheral Affinity" },
    ],
  },
];

export function VectorSimilaritySimulator() {
  const [selectedConcept, setSelectedConcept] = useState<VectorConcept>(VECTOR_PRESETS[0]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSelectConcept = (concept: VectorConcept) => {
    setIsCalculating(true);
    setSelectedConcept(concept);
    setTimeout(() => {
      setIsCalculating(false);
    }, 280);
  };

  return (
    <div className="simulator-card vector-simulator-card">
      {/* Top Header */}
      <div className="simulator-header">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-[var(--spatial-cyan)]" />
          <span className="simulator-title">Real-Time Vector Similarity Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--spatial-cyan)] animate-pulse" />
          <span className="text-[10.5px] font-mono text-[var(--spatial-cyan)]">1536-D COSINE SIMILARITY</span>
        </div>
      </div>

      <div className="simulator-body p-5 space-y-4">
        {/* Preset Concept Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--spatial-text-muted)]">
            Explore Concept Embedding Vector:
          </span>
          <div className="flex flex-wrap gap-2">
            {VECTOR_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectConcept(item)}
                className={`px-3 py-1 text-xs rounded-md font-mono transition-all border flex items-center gap-1.5 ${
                  selectedConcept.id === item.id
                    ? "bg-[var(--spatial-cyan)] text-[#0b1116] border-[var(--spatial-cyan)] font-semibold shadow-sm"
                    : "bg-[var(--spatial-surface)] text-[var(--spatial-text-secondary)] border-[var(--spatial-border)] hover:border-[var(--spatial-border-hover)]"
                }`}
              >
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Vector Match Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--spatial-text-muted)]">
            <span>NEURAL PROXIMITY CLUSTER</span>
            <span>INDEXEDDB LATENCY: ~12MS</span>
          </div>

          <div className="space-y-2">
            {selectedConcept.similarNotes.map((note) => {
              const pct = Math.round(note.score * 100);
              const isHigh = note.score >= 0.85;

              return (
                <div
                  key={note.title}
                  className="rounded-lg border border-[var(--spatial-border)] bg-[var(--spatial-surface)]/70 p-3 transition-all hover:border-[var(--spatial-border-hover)]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isHigh ? "bg-[var(--spatial-emerald)]" : "bg-[var(--spatial-text-muted)]"
                        }`}
                      />
                      <span className="text-xs font-semibold text-[var(--spatial-text-main)] truncate max-w-[240px] sm:max-w-[340px]">
                        {note.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isHigh ? "text-[var(--spatial-emerald)]" : "text-[var(--spatial-text-muted)]"
                      }`}
                    >
                      {isCalculating ? "..." : `${(note.score).toFixed(2)} (${pct}%)`}
                    </span>
                  </div>

                  {/* Dot Product Bar */}
                  <div className="w-full bg-[var(--spatial-border)] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh ? "bg-[var(--spatial-cyan)]" : "bg-[var(--spatial-text-muted)] opacity-60"
                      }`}
                      style={{ width: isCalculating ? "0%" : `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1.5 text-[10.5px] font-mono text-[var(--spatial-text-muted)]">
                    <span>{note.relation}</span>
                    <span className="text-[10px] opacity-75">
                      {isHigh ? "Autonomous Synapse Formed" : "Weak Correlation"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN PLAYGROUND CONTAINER
   ========================================================================== */
export function InteractiveSimulators() {
  return (
    <section
      id="simulators-playground"
      className="interactive-playground-section"
      aria-labelledby="playground-title"
    >
      <div className="interactive-playground-container">
        {/* Section Header */}
        <div className="playground-heading-wrap text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--spatial-border)] bg-[var(--spatial-surface)] text-[11px] font-mono text-[var(--spatial-cyan)]">
            <Sparkles size={12} />
            <span>INTERACTIVE INTELLIGENCE PLAYGROUND</span>
          </div>

          <h2 id="playground-title" className="text-3xl sm:text-4xl font-serif text-[var(--spatial-text-main)] tracking-tight">
            Try the engine. <br />
            <em className="text-[var(--spatial-cyan)] italic">Feel the latency.</em>
          </h2>

          <p className="text-sm text-[var(--spatial-text-muted)] leading-relaxed">
            Test on-device web clipping and real-time semantic topology formation right in your browser.
            No server calls required.
          </p>
        </div>

        {/* Dual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <ClipperSimulator />
          <VectorSimilaritySimulator />
        </div>
      </div>
    </section>
  );
}
