"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, Cloud, ShieldCheck, Download, FolderX, Network, Sparkles, CheckCircle2 } from "lucide-react";

export function EditorialTrilogy() {
  const [activeStream, setActiveStream] = useState<"nano" | "flash">("nano");
  const [clipStatus, setClipStatus] = useState<"idle" | "clipped">("idle");

  return (
    <div className="editorial-trilogy-root">
      {/* ====================================================================
          SYNAPSE TRANSITION BRIDGE (Descending from Spatial Canvas)
          ==================================================================== */}
      <div className="synapse-bridge" aria-hidden="true">
        <div className="synapse-bridge-line" />
        <div className="synapse-bridge-glow-pulse" />
      </div>

      {/* ====================================================================
          PART I: THE DEATH OF FOLDERS
          ==================================================================== */}
      <section className="editorial-chapter" id="manifesto-folders" aria-labelledby="chapter-1-title">
        <div className="editorial-container">
          <div className="editorial-grid">
            {/* Left Column: Essay Narrative */}
            <div className="editorial-prose">
              <h2 id="chapter-1-title" className="editorial-headline">
                The death of <br />
                <em>folders & tags.</em>
              </h2>
              <div className="editorial-body">
                <p>
                  Every knowledge system begins with noble intent: an immaculate tree of folders, 
                  nested taxonomies, and precise color-coded tags. Within three weeks, it collapses 
                  under its own cognitive friction.
                </p>
                <p>
                  You pause before saving an insight, paralyzed by a taxonomy question: 
                  <em> Does this research paper belong under &ldquo;/AI/LLMs&rdquo; or &ldquo;/Neuroscience/Memory&rdquo;?</em> 
                  The moment you force a thought into a single folder, you sever its invisible synapses 
                  to every other domain.
                </p>
                <p>
                  Human memory is not a hierarchical file system. It is an associative, high-dimensional 
                  manifold. BrainDrop AI eliminates file trees entirely. Thoughts land raw, and 
                  autonomous vector embeddings calculate semantic affinities in the background. 
                  Your knowledge topology self-assembles without a single folder created.
                </p>
              </div>
            </div>

            {/* Right Column: Comparative Schematic (Rigid Tree vs Neural Graph) */}
            <div className="editorial-schematic-wrap">
              <div className="schematic-panel">
                <div className="schematic-header">
                  <div className="flex items-center gap-2">
                    <FolderX size={14} className="text-[var(--spatial-text-muted)]" />
                    <span>Traditional Hierarchy</span>
                  </div>
                  <span className="text-[rgba(255,255,255,0.3)]">Rigid Folders</span>
                </div>
                <div className="schematic-tree-view">
                  <div className="tree-line is-muted">
                    <span className="tree-icon">📁</span>
                    <span>/Archive</span>
                  </div>
                  <div className="tree-line is-muted pl-5">
                    <span className="tree-icon">📁</span>
                    <span>/2024-Research</span>
                  </div>
                  <div className="tree-line is-dead pl-10">
                    <span className="tree-icon">📄</span>
                    <span>sparse-notes-never-opened.md</span>
                    <span className="tree-badge">ORPHANED</span>
                  </div>
                  <div className="tree-line is-dead pl-10">
                    <span className="tree-icon">📄</span>
                    <span>unfiled-draft-final-v2.md</span>
                    <span className="tree-badge">LOST</span>
                  </div>
                </div>

                <div className="schematic-divider" />

                <div className="schematic-header">
                  <div className="flex items-center gap-2">
                    <Network size={14} className="text-[var(--accent-emerald)]" />
                    <span className="text-[var(--accent-emerald)]">Semantic Topology</span>
                  </div>
                  <span className="text-[var(--accent-emerald)]">Autonomous</span>
                </div>
                <div className="schematic-vector-view">
                  <div className="vector-node">
                    <span className="vector-dot pulse" />
                    <span className="vector-text">&ldquo;Built-in browser AI changes everything...&rdquo;</span>
                    <span className="vector-dist">cosine: 0.94</span>
                  </div>
                  <div className="vector-synapse" />
                  <div className="vector-node">
                    <span className="vector-dot" />
                    <span className="vector-text">&ldquo;Client NPU privacy enables unredacted personal journals.&rdquo;</span>
                    <span className="vector-dist">cosine: 0.91</span>
                  </div>
                  <div className="vector-synapse" />
                  <div className="vector-node">
                    <span className="vector-dot" />
                    <span className="vector-text">&ldquo;Spaced retrieval curves lock fleeting readings into long-term recall.&rdquo;</span>
                    <span className="vector-dist">cosine: 0.88</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HAIRLINE SEPARATOR
          ==================================================================== */}
      <div className="editorial-divider" aria-hidden="true" />

      {/* ====================================================================
          PART II: HYBRID PRIVACY ARCHITECTURE
          ==================================================================== */}
      <section className="editorial-chapter" id="manifesto-privacy" aria-labelledby="chapter-2-title">
        <div className="editorial-container">
          <div className="editorial-grid reversed">
            {/* Left Column: Interactive Stream Controller */}
            <div className="editorial-schematic-wrap">
              <div className="schematic-panel">
                <div className="stream-selector-tabs">
                  <button
                    type="button"
                    onClick={() => setActiveStream("nano")}
                    className={`stream-tab ${activeStream === "nano" ? "is-active" : ""}`}
                  >
                    <Cpu size={14} />
                    <span>Client NPU (Nano)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStream("flash")}
                    className={`stream-tab ${activeStream === "flash" ? "is-active" : ""}`}
                  >
                    <Cloud size={14} />
                    <span>Cloud Reasoning (Flash)</span>
                  </button>
                </div>

                <div className="stream-display-area">
                  {activeStream === "nano" ? (
                    <div className="stream-details animate-fade-in">
                      <div className="stream-badge-row">
                        <span className="stream-status-badge is-local">
                          <ShieldCheck size={13} />
                          ON-DEVICE GEMINI NANO
                        </span>
                        <span className="font-mono text-xs text-[var(--spatial-amber)]">~48MS INFERENCE</span>
                      </div>
                      <h4 className="stream-title">Zero Network Footprint for Private Thoughts</h4>
                      <p className="stream-desc">
                        Personal journal entries, spontaneous voice memos, and internal company hypotheses 
                        are parsed locally on your machine&apos;s NPU. Embeddings are indexed into local IndexedDB. 
                        Zero bytes ever leave your device without explicit intent.
                      </p>
                      <div className="stream-specs-table">
                        <div className="spec-item">
                          <span className="spec-label">Execution Target</span>
                          <span className="spec-val">Local Chrome Built-in AI</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Roundtrip Latency</span>
                          <span className="spec-val text-[var(--spatial-amber)]">~35ms - 48ms</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Offline Capability</span>
                          <span className="spec-val">100% Air-Gapped Capable</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">PII Shield</span>
                          <span className="spec-val">Client Sanitization Layer</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="stream-details animate-fade-in">
                      <div className="stream-badge-row">
                        <span className="stream-status-badge is-cloud">
                          <Sparkles size={13} />
                          CLOUD GEMINI 3.8 FLASH
                        </span>
                        <span className="font-mono text-xs text-[#77b6ff]">1M TOKEN CONTEXT</span>
                      </div>
                      <h4 className="stream-title">Macroscopic Multi-Document Synthesis</h4>
                      <p className="stream-desc">
                        When you request cross-paper literature reviews or deep thematic summaries across 
                        hundreds of research notes, Firebase AI Logic streams your sanitized query through 
                        Gemini 3.8 Flash with Firebase App Check attestation.
                      </p>
                      <div className="stream-specs-table">
                        <div className="spec-item">
                          <span className="spec-label">Execution Target</span>
                          <span className="spec-val">Google Cloud Firebase AI Logic</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Attestation</span>
                          <span className="spec-val text-[#77b6ff]">Firebase App Check</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Context Window</span>
                          <span className="spec-val">1,000,000+ Tokens</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">Synthesis Task</span>
                          <span className="spec-val">Cross-Doc Correlation & Chat</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Essay Narrative */}
            <div className="editorial-prose">
              <h2 id="chapter-2-title" className="editorial-headline">
                Privacy by architecture, <br />
                <em>not by policy.</em>
              </h2>
              <div className="editorial-body">
                <p>
                  Most modern AI software operates on a Faustian bargain: in exchange for intelligence, 
                  you must upload every raw keystroke, private thought, and sensitive memo to a remote server.
                </p>
                <p>
                  BrainDrop AI was built under the strict mandate of 
                  <strong> Google #BuildHybridAI 2026</strong>: 
                  intelligent software must respect the sanctity of client hardware. By pairing 
                  Chrome Built-in AI (Gemini Nano) with Firebase AI Logic, we created a tiered routing 
                  engine that guarantees local privacy without sacrificing cloud reasoning power.
                </p>
                <p>
                  Your daily stream of consciousness never touches a remote server. When complex synthesis 
                  is requested, client-side PII sanitizers strip sensitive identifiers before routing through 
                  cryptographically attested Firebase App Check endpoints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HAIRLINE SEPARATOR
          ==================================================================== */}
      <div className="editorial-divider" aria-hidden="true" />

      {/* ====================================================================
          PART III: THE CHROME WEB CLIPPER
          ==================================================================== */}
      <section className="editorial-chapter" id="manifesto-clipper" aria-labelledby="chapter-3-title">
        <div className="editorial-container">
          <div className="editorial-grid">
            {/* Left Column: Essay Narrative */}
            <div className="editorial-prose">
              <h2 id="chapter-3-title" className="editorial-headline">
                Capture without <br />
                <em>breaking state.</em>
              </h2>
              <div className="editorial-body">
                <p>
                  Research is not a destination you travel to; it happens continuously while reading 
                  documentation, skimming ArXiv preprints, and evaluating codebases.
                </p>
                <p>
                  The moment you switch tabs to paste a quote into a secondary notebook, your cognitive 
                  working memory drops by 40%. The flow state evaporates.
                </p>
                <p>
                  The <strong>BrainDrop AI Web Clipper (Chrome MV3)</strong> operates directly inside 
                  your reading environment. Highlight any passage, strike <code>Cmd + Shift + K</code>, 
                  and the on-device Gemini Nano model extracts core thesis points and routes them directly 
                  to your workspace vault with original source attribution.
                </p>
              </div>
            </div>

            {/* Right Column: Simulated Clipper Window */}
            <div className="editorial-schematic-wrap">
              <div className="schematic-panel">
                <div className="schematic-header">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
                    <span>Chrome Web Clipper (MV3)</span>
                  </div>
                  <span className="font-mono text-xs text-[var(--accent-cyan)]">SHORTCUT: ⌘+⇧+K</span>
                </div>

                <div className="clipper-mock-body">
                  <div className="clipper-target-site">
                    <span className="text-[11px] font-mono text-[rgba(255,255,255,0.4)]">ORIGIN URL:</span>
                    <span className="text-[12px] font-mono text-[var(--spatial-amber)] truncate">
                      https://developer.chrome.com/docs/ai/built-in
                    </span>
                  </div>

                  <div className="clipper-quote-box">
                    <p className="text-sm font-serif italic text-[var(--spatial-text-main)]">
                      &ldquo;Built-in AI in Chrome allows web applications to run Gemini Nano on-device 
                      directly from the browser window object with zero configuration.&rdquo;
                    </p>
                  </div>

                  <div className="clipper-meta-row">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--spatial-text-muted)]">
                      <span>NPU EXECUTOR: ACTIVE</span>
                      <span>·</span>
                      <span className="text-[var(--spatial-amber)]">0 NETWORK PAYLOAD</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setClipStatus("clipped");
                        setTimeout(() => setClipStatus("idle"), 2500);
                      }}
                      className="clipper-action-btn"
                    >
                      {clipStatus === "clipped" ? (
                        <>
                          <CheckCircle2 size={13} className="text-[#6edbb3]" />
                          <span>Saved to Vault</span>
                        </>
                      ) : (
                        <>
                          <span>Save to Second Brain</span>
                          <ArrowUpRight size={13} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="schematic-footer-bar">
                  <a
                    href="https://github.com/tinonurcahya/braindrop-ai"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-[var(--spatial-text-muted)] hover:text-[var(--spatial-text-main)] transition-colors"
                  >
                    <Download size={13} />
                    <span>Download Extension Package (apps/extension/dist)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HAIRLINE SEPARATOR
          ==================================================================== */}
      <div className="editorial-divider" aria-hidden="true" />

      {/* ====================================================================
          GRAND EDITORIAL FINALE & FOOTER
          ==================================================================== */}
      <footer className="editorial-finale" aria-labelledby="finale-title">
        <div className="editorial-container">
          <div className="finale-content">
            <h2 id="finale-title" className="finale-headline">
              Your mind, <br />
              <em>unbroken.</em>
            </h2>
            <p className="finale-subtext">
              The privacy-first hybrid second brain. Process private notes on-device with Gemini Nano, 
              synthesize complex research with Gemini 3.8 Flash, and keep fleeting ideas forever.
            </p>

            <div className="finale-actions">
              <Link href="/notes" className="finale-cta-primary">
                <span>Enter Workspace</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link href="/capture" className="finale-cta-secondary">
                <span>Quick Capture Note</span>
              </Link>
            </div>
          </div>

          <div className="finale-bottom-bar">
            <div className="finale-brand-col">
              <span className="font-serif text-lg tracking-tight text-[var(--spatial-text-main)]">
                braindrop <em className="text-[var(--spatial-amber)] italic">/ ai</em>
              </span>
              <p className="text-xs font-mono text-[var(--spatial-text-muted)] mt-1">
                Official Submission for Google #BuildHybridAI 2026 Hackathon
              </p>
              <p className="text-xs text-[rgba(255,255,255,0.3)] mt-0.5">
                Released under the open-source Apache 2.0 License.
              </p>
            </div>

            <div className="finale-nav-col">
              <div className="nav-group">
                <span className="nav-group-title">WORKSPACE</span>
                <Link href="/notes">Notes</Link>
                <Link href="/graph">Topology Graph</Link>
                <Link href="/flashcards">Study Cards</Link>
                <Link href="/dashboard">Telemetry Dashboard</Link>
              </div>

              <div className="nav-group">
                <span className="nav-group-title">DEVELOPER</span>
                <a href="https://github.com/tinonurcahya/braindrop-ai" target="_blank" rel="noreferrer">
                  GitHub Repository
                </a>
                <a href="https://devpost.com/software/braindrop-ai" target="_blank" rel="noreferrer">
                  Devpost Submission
                </a>
                <Link href="/api/clips">API Endpoints</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
