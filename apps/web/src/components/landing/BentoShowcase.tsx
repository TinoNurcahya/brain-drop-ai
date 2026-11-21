"use client";

import { useState, useRef, useEffect } from "react";
import {
  Cpu,
  Cloud,
  ShieldCheck,
  Network,
  RotateCcw,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTextReveal } from "@/hooks/useTextReveal";

/* ---------- Mini Interactive Graph for Bento Card ---------- */
function MiniBentoGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // Initial nodes
    const nodes = [
      { id: "1", label: "Gemini Nano", x: width * 0.3, y: height * 0.45, vx: 0, vy: 0, r: 16, color: "#10b981" },
      { id: "2", label: "Local Notes", x: width * 0.2, y: height * 0.75, vx: 0, vy: 0, r: 12, color: "#6edbb3" },
      { id: "3", label: "Hybrid Router", x: width * 0.52, y: height * 0.35, vx: 0, vy: 0, r: 15, color: "#79d9de" },
      { id: "4", label: "Cloud Flash", x: width * 0.75, y: height * 0.5, vx: 0, vy: 0, r: 16, color: "#38bdf8" },
      { id: "5", label: "Synthesis", x: width * 0.82, y: height * 0.8, vx: 0, vy: 0, r: 12, color: "#c3a0ef" },
      { id: "6", label: "PII Sandbox", x: width * 0.45, y: height * 0.78, vx: 0, vy: 0, r: 13, color: "#a855f7" },
    ];

    const edges = [
      [0, 1],
      [0, 2],
      [2, 3],
      [3, 4],
      [2, 5],
      [0, 5],
    ];

    let draggedNode: (typeof nodes)[0] | null = null;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      return { x: cx - rect.left, y: cy - rect.top };
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPos(e);
      for (const node of nodes) {
        const d = Math.hypot(node.x - x, node.y - y);
        if (d <= node.r + 8) {
          draggedNode = node;
          break;
        }
      }
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggedNode) return;
      const { x, y } = getPos(e);
      draggedNode.x = Math.max(nodeRadius(draggedNode), Math.min(width - nodeRadius(draggedNode), x));
      draggedNode.y = Math.max(nodeRadius(draggedNode), Math.min(height - nodeRadius(draggedNode), y));
    };

    const onUp = () => {
      draggedNode = null;
    };

    function nodeRadius(n: (typeof nodes)[0]) {
      return n.r;
    }

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    canvas.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Draw edges with subtle glowing gradient
      for (const [fromIdx, toIdx] of edges) {
        const n1 = nodes[fromIdx];
        const n2 = nodes[toIdx];
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = "rgba(121, 217, 222, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        // Outer glow
        const grad = ctx.createRadialGradient(node.x, node.y, node.r * 0.4, node.x, node.y, node.r * 1.6);
        grad.addColorStop(0, `${node.color}55`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = "#edf3f5";
        ctx.font = "10px ui-monospace, SFMono-Regular, monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.r + 14);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div className="mini-graph-wrap">
      <canvas ref={canvasRef} className="mini-graph-canvas" />
      <span className="mini-graph-hint">Interactive: Drag nodes to explore connections</span>
    </div>
  );
}

/* ---------- Bento Grid Showcase Component ---------- */
export function BentoShowcase() {
  const headingRef = useTextReveal<HTMLHeadingElement>({ trigger: "scroll", stagger: 0.04 });
  const [activeTier, setActiveTier] = useState<"nano" | "flash">("nano");
  const [piiSanitized, setPiiSanitized] = useState(true);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [flashcardBox, setFlashcardBox] = useState<1 | 2 | 3>(2);

  // Mouse Spotlight Effect for all bento cards
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = containerRef.current?.querySelectorAll(".bento-spotlight-card");
    if (!cards) return;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    });
  };

  return (
    <section className="bento-showcase-section landing-container" aria-labelledby="bento-heading">
      <div className="bento-heading-wrap">
        <p className="eyebrow">HIGH-DENSITY ENGINEERING SUITE</p>
        <h2 id="bento-heading" ref={headingRef}>
          Architected for intelligence.
          <br />
          <span>Engineered for complete privacy.</span>
        </h2>
        <p className="section-intro">
          Four interconnected pillars working seamlessly to transform how you capture, connect, and master knowledge.
        </p>
      </div>

      <div ref={containerRef} onMouseMove={onMouseMove} className="bento-grid-container">
        {/* CARD 1: Hybrid AI Router Sandbox (2 Cols) */}
        <div className="bento-spotlight-card bento-card-large">
          <div className="bento-card-inner">
            <div className="bento-card-header">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
                <span className="bento-tag">CORE ARCHITECTURE</span>
              </div>
              <span className="bento-chip">Dual-Model Pipeline</span>
            </div>

            <div className="bento-hero-interactive">
              <h3>Hybrid Inference Engine</h3>
              <p>
                Dynamic runtime routing powered by Firebase AI Logic. Trivial summaries remain local; complex multi-source
                syntheses route securely to Gemini Flash.
              </p>

              {/* Interactive Tier Switcher */}
              <div className="bento-tier-toggle-bar">
                <button
                  type="button"
                  className={`tier-btn ${activeTier === "nano" ? "active-nano" : ""}`}
                  onClick={() => setActiveTier("nano")}
                >
                  <Cpu size={16} />
                  <span>On-Device Nano 4</span>
                </button>
                <button
                  type="button"
                  className={`tier-btn ${activeTier === "flash" ? "active-flash" : ""}`}
                  onClick={() => setActiveTier("flash")}
                >
                  <Cloud size={16} />
                  <span>Cloud Gemini Flash</span>
                </button>
              </div>

              {/* Dynamic Telemetry Panel */}
              <div className="bento-telemetry-box">
                {activeTier === "nano" ? (
                  <div className="telemetry-stat-row">
                    <div className="stat-pill">
                      <span className="stat-val text-[var(--accent-emerald)]">~42ms</span>
                      <span className="stat-lbl">Execution Latency</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-val text-[var(--accent-emerald)]">100%</span>
                      <span className="stat-lbl">Data Kept In-Browser</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-val text-[var(--accent-emerald)]">$0.00</span>
                      <span className="stat-lbl">API Ingestion Cost</span>
                    </div>
                  </div>
                ) : (
                  <div className="telemetry-stat-row">
                    <div className="stat-pill">
                      <span className="stat-val text-[var(--accent-cyan)]">~780ms</span>
                      <span className="stat-lbl">Deep Cloud Reasoning</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-val text-[var(--accent-cyan)]">PII Masked</span>
                      <span className="stat-lbl">Zero Identity Egress</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-val text-[var(--accent-cyan)]">1M Tokens</span>
                      <span className="stat-lbl">Context Window Capacity</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Mini Interactive Knowledge Graph */}
        <div className="bento-spotlight-card bento-card-medium">
          <div className="bento-card-inner">
            <div className="bento-card-header">
              <div className="flex items-center gap-2">
                <Network size={16} className="text-[var(--accent-purple)]" />
                <span className="bento-tag">TOPOLOGY ENGINE</span>
              </div>
              <span className="bento-chip">60fps Physics</span>
            </div>

            <div className="bento-card-content">
              <h3>Interactive Knowledge Graph</h3>
              <p>Force-directed harmonic nodes automatically clustering shared ideas and semantic links.</p>
              <MiniBentoGraph />
            </div>
          </div>
        </div>

        {/* CARD 3: Client PII Redaction Sandbox */}
        <div className="bento-spotlight-card bento-card-medium">
          <div className="bento-card-inner">
            <div className="bento-card-header">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--accent-emerald)]" />
                <span className="bento-tag">SECURITY SANDBOX</span>
              </div>
              <button
                type="button"
                className="pii-toggle-btn"
                onClick={() => setPiiSanitized(!piiSanitized)}
                title="Toggle PII Masking"
              >
                {piiSanitized ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{piiSanitized ? "Sanitized" : "Raw Data"}</span>
              </button>
            </div>

            <div className="bento-card-content">
              <h3>Client PII Redaction Scrubber</h3>
              <p>Sensitive data is deterministically masked inside your browser before cloud transit.</p>

              <div className="pii-demo-terminal">
                <div className="terminal-header">
                  <span>INPUT PAYLOAD INSPECTOR</span>
                  <span className="terminal-status">{piiSanitized ? "🟢 MASKED" : "🔴 EXPOSED"}</span>
                </div>
                <div className="terminal-body">
                  <p>
                    Research Interview for candidate{" "}
                    {piiSanitized ? (
                      <mark className="redacted">[REDACTED_NAME]</mark>
                    ) : (
                      <span className="exposed">Arya Pratama</span>
                    )}{" "}
                    contacting via{" "}
                    {piiSanitized ? (
                      <mark className="redacted">[REDACTED_EMAIL]</mark>
                    ) : (
                      <span className="exposed">arya@seriesb.io</span>
                    )}{" "}
                    regarding proprietary patent architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Leitner Spaced Repetition SRS Card */}
        <div className="bento-spotlight-card bento-card-medium">
          <div className="bento-card-inner">
            <div className="bento-card-header">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[var(--accent-amber)]" />
                <span className="bento-tag">SPACED RECALL</span>
              </div>
              <span className="bento-chip">Leitner 3-Box SRS</span>
            </div>

            <div className="bento-card-content">
              <h3>Spaced Practice Flashcard</h3>
              <p>Turn raw notes into self-assessment cards calibrated with tiered retention intervals.</p>

              {/* 3D Flipping Flashcard */}
              <div
                className={`bento-flip-card ${cardFlipped ? "is-flipped" : ""}`}
                onClick={() => setCardFlipped(!cardFlipped)}
                role="button"
                tabIndex={0}
                aria-label="Flip study flashcard"
              >
                <div className="bento-flip-front">
                  <span className="card-q-tag">QUESTION</span>
                  <p className="card-q-text">What distinguishes on-device inference from cloud AI?</p>
                  <span className="card-flip-prompt">
                    <RotateCcw size={13} /> Click to reveal answer
                  </span>
                </div>
                <div className="bento-flip-back">
                  <span className="card-a-tag">ANSWER</span>
                  <p className="card-a-text">
                    On-device executes locally in the browser engine (Gemini Nano) with sub-50ms latency and 0% cloud data egress.
                  </p>
                  <span className="card-flip-prompt">
                    <RotateCcw size={13} /> Click to flip back
                  </span>
                </div>
              </div>

              {/* Box Progress Stepper */}
              <div className="leitner-stepper">
                <span className="stepper-label">Retention Level:</span>
                <div className="stepper-boxes">
                  <button
                    type="button"
                    className={`sbox ${flashcardBox === 1 ? "active-box" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setFlashcardBox(1); }}
                  >
                    Box 1 (Daily)
                  </button>
                  <button
                    type="button"
                    className={`sbox ${flashcardBox === 2 ? "active-box" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setFlashcardBox(2); }}
                  >
                    Box 2 (3 Days)
                  </button>
                  <button
                    type="button"
                    className={`sbox ${flashcardBox === 3 ? "active-box" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setFlashcardBox(3); }}
                  >
                    Box 3 (Weekly)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
