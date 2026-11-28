"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { LandingCopy } from "@/lib/landing-copy";

interface Props {
  activeIndex: number;
  direction?: 1 | -1;
  seq?: number;
  copy: LandingCopy["product"];
}

const TAB_IMAGES: Record<string, string> = {
  capture: "/images/preview-capture.jpg",
  notes: "/images/preview-notes.jpg",
  graph: "/images/preview-graph.jpg",
  flashcards: "/images/preview-flashcards.jpg",
  telemetry: "/images/preview-dashboard.jpg",
};

const TICKS = [
  1, 2, 0, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 1, 2, 3, 4, 3, 1, 2, 4, 3, 3, 2, 4, 4, 2, 3, 4, 4,
];
const WAVE = [32, 68, 45, 90, 54, 78, 40, 85, 62, 48, 74, 36, 60, 82, 44, 52, 70, 38, 64, 42];

/** Gentle quadratic Bézier curve between two graph coordinates in a 0..100 SVG box. */
function curvedEdgePath(ax: number, ay: number, bx: number, by: number, idx: number): string {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const bend = (idx % 2 === 0 ? 1 : -1) * Math.min(7, len * 0.14);
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return `M ${ax} ${ay} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${bx} ${by}`;
}

/** Five tactile, frameless editorial instruments representing the BrainDrop workspace. */
export function WorkspaceScenes({ activeIndex, direction = 1, seq = 0, copy }: Props) {
  const reducedMotion = useReducedMotion();
  const safeIdx = Math.max(0, Math.min(copy.tabs.length - 1, activeIndex));
  const tab = copy.tabs[safeIdx];
  const { scenes } = copy;

  const [captureMode, setCaptureMode] = useState(0);
  const [noteIdx, setNoteIdx] = useState(0);
  const [nodeId, setNodeId] = useState("router");
  const [nodePull, setNodePull] = useState<Record<string, { x: number; y: number }>>({});
  const [flipped, setFlipped] = useState(false);
  const [box, setBox] = useState(1);
  const [hoveredDay, setHoveredDay] = useState<number>(TICKS.length - 1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const node = useMemo(
    () => scenes.graph.nodes.find((n) => n.id === nodeId) ?? scenes.graph.nodes[1],
    [nodeId, scenes.graph.nodes]
  );
  const neighbors = useMemo(() => {
    const s = new Set<string>([node.id]);
    scenes.graph.edges.forEach(([a, b]) => {
      if (a === node.id) s.add(b);
      if (b === node.id) s.add(a);
    });
    return s;
  }, [node.id, scenes.graph.edges]);

  const retention = box === 0 ? 74 : box === 1 ? 88 : 96;

  // Pointer-proximity micro-magnetism on graph nodes
  const handleGraphMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    const nextPull: Record<string, { x: number; y: number }> = {};
    for (const n of scenes.graph.nodes) {
      const dx = px - n.x;
      const dy = py - n.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 26 && dist > 0.1) {
        const strength = (1 - dist / 26) * 5.5;
        nextPull[n.id] = { x: (dx / dist) * strength, y: (dy / dist) * strength };
      } else {
        nextPull[n.id] = { x: 0, y: 0 };
      }
    }
    setNodePull(nextPull);
  };

  const handleGraphLeave = () => {
    setNodePull({});
  };

  const activeDayLvl = TICKS[hoveredDay] ?? 3;
  const activeDayOps = activeDayLvl === 0 ? 1 : activeDayLvl * 3 + ((hoveredDay % 2) + 1);
  const activeDayKb = (activeDayOps * 1.6).toFixed(1);

  const activeAction = scenes.notes.actions[noteIdx] ?? scenes.notes.actions[0];
  const wipeClass =
    seq > 0 && !reducedMotion ? (direction >= 0 ? "is-wipe-down" : "is-wipe-up") : "";
  const activeImgSrc = TAB_IMAGES[tab.id] ?? "/images/preview-notes.jpg";

  return (
    <div className="lp-sx" role="region" aria-label={tab.name}>
      <div className="lp-sx-photo-band">
        <img
          key={`${tab.id}-${seq}`}
          src={activeImgSrc}
          alt={tab.name}
          decoding="async"
          className={`lp-sx-photo-img ${
            seq > 0 && !reducedMotion ? (direction >= 0 ? "wipe-down" : "wipe-up") : ""
          }`}
        />
        <span className="lp-sx-photo-index" aria-hidden="true">
          0{safeIdx + 1} / 0{copy.tabs.length}
        </span>
      </div>

      <div className="lp-sx-inner">
        <div className="lp-sx-bar">
          <span className="lp-sx-route">{tab.routeLabel}</span>
          <Link href={tab.href} className="group lp-sx-open">
            <RollingText text={tab.ctaLabel} />
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <div key={tab.id} className={`lp-sx-stage ${wipeClass}`}>
          {tab.id === "capture" && (
            <div className="lp-sx-capture">
              <div className="lp-sx-links" role="tablist">
                {scenes.capture.modes.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={captureMode === i}
                    onClick={() => setCaptureMode(i)}
                    className={`lp-tlink ${captureMode === i ? "is-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p key={captureMode} className="lp-sx-quote lp-sx-quote-sweep">
                {captureMode === 0
                  ? `“${scenes.capture.excerpt}”`
                  : captureMode === 1
                    ? `“${scenes.capture.quickDraft}”`
                    : scenes.capture.voiceTranscript}
              </p>

              {captureMode === 2 && (
                <div className="lp-sx-wave" aria-hidden="true">
                  {WAVE.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: `${h}%`,
                        ["--wave-idx" as string]: i,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="lp-sx-meta">
                <span>
                  {captureMode === 0
                    ? scenes.capture.sourceDomain
                    : captureMode === 1
                      ? "quick-thought.md"
                      : "voice-memo.webm"}
                </span>
                <span>{scenes.capture.modeStats[captureMode]}</span>
                <span className="lp-sx-ok">{scenes.capture.savedLabel}</span>
                <span>{scenes.capture.tags.map((t) => `#${t}`).join("  ")}</span>
              </div>
            </div>
          )}

          {tab.id === "notes" && (
            <div className="lp-sx-notes">
              <div className="lp-sx-doc">
                <span className="lp-sx-small">{scenes.notes.docMeta}</span>
                <h3 className="lp-sx-title">{scenes.notes.docTitle}</h3>
                <div className="lp-sx-manuscript">
                  <p className="lp-sx-body">
                    <span className="lp-sx-para" aria-hidden="true">§ 01</span>
                    {scenes.notes.docBody}
                  </p>
                  <p className="lp-sx-body">
                    <span className="lp-sx-para" aria-hidden="true">§ 02</span>
                    <mark className="lp-sx-mark">{scenes.notes.docQuote}</mark>
                  </p>
                </div>
              </div>

              <aside className="lp-sx-margin">
                <span className="lp-sx-small">{scenes.notes.copilotTitle}</span>
                <ul>
                  {scenes.notes.actions.map((a, i) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setNoteIdx(i)}
                        className={`lp-tlink ${noteIdx === i ? "is-active" : ""}`}
                      >
                        {a.label}
                      </button>
                      <span className="lp-sx-latency">{a.latency}</span>
                    </li>
                  ))}
                </ul>

                <motion.div
                  key={activeAction.id}
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="lp-sx-copilot-out"
                >
                  <p className="lp-sx-note">{activeAction.output}</p>
                  <span className="lp-sx-saved-bytes">{activeAction.savedNote}</span>
                </motion.div>
              </aside>
            </div>
          )}

          {tab.id === "graph" && (
            <div className="lp-sx-graph">
              <span className="lp-sx-small">{scenes.graph.inspectorLabel}</span>
              <div
                ref={canvasRef}
                className="lp-sx-canvas"
                onPointerMove={handleGraphMove}
                onPointerLeave={handleGraphLeave}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="lp-graph-beam" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="0.9" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {scenes.graph.edges.map(([aId, bId, dashed], edgeIdx) => {
                    const a = scenes.graph.nodes.find((n) => n.id === aId);
                    const b = scenes.graph.nodes.find((n) => n.id === bId);
                    if (!a || !b) return null;
                    const lit = a.id === node.id || b.id === node.id;
                    const d = curvedEdgePath(a.x, a.y, b.x, b.y, edgeIdx);
                    const from = b.id === node.id ? b : a;
                    const to = b.id === node.id ? a : b;
                    const pulsePath = curvedEdgePath(from.x, from.y, to.x, to.y, edgeIdx);
                    return (
                      <g key={`${aId}-${bId}`}>
                        <path
                          d={d}
                          fill="none"
                          className={`lp-sx-edge ${dashed ? "is-dashed" : ""} ${lit ? "is-lit" : ""}`}
                        />
                        {lit && !reducedMotion && (
                          <circle
                            r="1.15"
                            className="lp-sx-beam-dot"
                            filter="url(#lp-graph-beam)"
                          >
                            <animateMotion
                              dur={`${1.9 + (edgeIdx % 3) * 0.45}s`}
                              repeatCount="indefinite"
                              path={pulsePath}
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>
                {scenes.graph.nodes.map((n) => {
                  const pull = nodePull[n.id] ?? { x: 0, y: 0 };
                  return (
                    <button
                      key={n.id}
                      type="button"
                      style={{
                        left: `${n.x}%`,
                        top: `${n.y}%`,
                        transform: `translate(calc(-50% + ${pull.x.toFixed(1)}px), calc(-50% + ${pull.y.toFixed(1)}px))`,
                      }}
                      onMouseEnter={() => setNodeId(n.id)}
                      onFocus={() => setNodeId(n.id)}
                      onClick={() => setNodeId(n.id)}
                      className={`lp-sx-node is-${n.cluster} ${
                        n.id === node.id ? "is-selected" : neighbors.has(n.id) ? "is-near" : ""
                      }`}
                    >
                      <i aria-hidden="true" />
                      {n.id === node.id && <em className="lp-sx-bloom" aria-hidden="true" />}
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="lp-sx-graph-inspector">
                <p className="lp-sx-note">
                  <strong>{node.label}</strong> · {node.summary}
                </p>
                <div className="lp-sx-graph-stats">
                  <span>{scenes.graph.clusterLabels[node.cluster]}</span>
                  <span>
                    {scenes.graph.degreeLabel}: {node.connections}
                  </span>
                  <span>
                    {scenes.graph.affinityLabel}: {node.affinity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {tab.id === "flashcards" && (
            <div className="lp-sx-cards">
              <div className="lp-sx-steps">
                {scenes.flashcards.boxLabels.map((l, i) => (
                  <span key={l} className={box === i ? "is-active" : ""}>
                    {l}
                  </span>
                ))}
                <span className="lp-sx-ret-group">
                  <em>
                    {scenes.flashcards.masteryLabel} {retention}%
                  </em>
                  <span className="lp-sx-ret-track" aria-hidden="true">
                    <i style={{ ["--p" as string]: (retention / 100).toFixed(2) }} />
                  </span>
                </span>
              </div>

              <div className="lp-sx-flipwrap">
                <button
                  type="button"
                  aria-pressed={flipped}
                  onClick={() => setFlipped((f) => !f)}
                  className={`lp-sx-flip ${flipped ? "is-flipped" : ""}`}
                  aria-label={scenes.flashcards.flipHint}
                >
                  {/* Front Archival Sheet */}
                  <span className="lp-sx-face lp-sx-card-sheet">
                    <i className="lp-reg-tick is-tl" aria-hidden="true" />
                    <i className="lp-reg-tick is-tr" aria-hidden="true" />
                    <i className="lp-reg-tick is-bl" aria-hidden="true" />
                    <i className="lp-reg-tick is-br" aria-hidden="true" />
                    <span className="lp-sx-card-head">
                      <span>{scenes.flashcards.frontLabel}</span>
                      <span>{scenes.flashcards.deckMeta}</span>
                    </span>
                    <span className="lp-sx-q">{scenes.flashcards.question}</span>
                    <span className="lp-sx-small">{scenes.flashcards.flipHint}</span>
                  </span>

                  {/* Back Archival Sheet */}
                  <span className="lp-sx-face lp-sx-back lp-sx-card-sheet">
                    <i className="lp-reg-tick is-tl" aria-hidden="true" />
                    <i className="lp-reg-tick is-tr" aria-hidden="true" />
                    <i className="lp-reg-tick is-bl" aria-hidden="true" />
                    <i className="lp-reg-tick is-br" aria-hidden="true" />
                    <span className="lp-sx-card-head">
                      <span className="lp-sx-ok">{scenes.flashcards.backLabel}</span>
                      <span>{scenes.flashcards.deckMeta}</span>
                    </span>
                    <span className="lp-sx-body">{scenes.flashcards.answer}</span>
                    <code className="lp-sx-code">{scenes.flashcards.code}</code>
                  </span>
                </button>
              </div>

              <div className="lp-sx-links">
                {scenes.flashcards.ratings.map((r, i) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setBox(i);
                      setFlipped(false);
                    }}
                    className={`lp-tlink ${box === i ? "is-active" : ""}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab.id === "telemetry" && (
            <div className="lp-sx-tele">
              <div className="lp-sx-big">
                <strong>{scenes.telemetry.ratioValue}</strong>
                <span>
                  {scenes.telemetry.ratioTitle}
                  <br />
                  <small>{scenes.telemetry.ratioSub}</small>
                </span>
              </div>

              <div className="lp-sx-stats">
                <div>
                  <small>{scenes.telemetry.localBytesLabel}</small>
                  <b>{scenes.telemetry.localBytesValue}</b>
                  <small>{scenes.telemetry.localBytesSub}</small>
                </div>
                <div>
                  <small>{scenes.telemetry.piiStatusLabel}</small>
                  <b>{scenes.telemetry.piiStatusValue}</b>
                  <small>{scenes.telemetry.piiStatusSub}</small>
                </div>
              </div>

              <div className="lp-sx-lat">
                <span className="lp-sx-small">{scenes.telemetry.latencyTitle}</span>
                <div>
                  <span>{scenes.telemetry.nanoBarLabel}</span>
                  <span className="lp-sx-lat-track">
                    <i style={{ ["--s" as string]: 0.08 }} className="is-fast" />
                  </span>
                </div>
                <div>
                  <span>{scenes.telemetry.cloudBarLabel}</span>
                  <span className="lp-sx-lat-track">
                    <i style={{ ["--s" as string]: 0.86 }} />
                  </span>
                </div>
              </div>

              <div className="lp-sx-ticks-wrap">
                <div className="lp-sx-ticks-head">
                  <span className="lp-sx-small">{scenes.telemetry.heatmapTitle}</span>
                  <span className="lp-sx-tick-readout">
                    {scenes.telemetry.dayPrefix} {String(hoveredDay + 1).padStart(2, "0")} ·{" "}
                    {activeDayOps} {scenes.telemetry.opsSuffix} · {activeDayKb}{" "}
                    {scenes.telemetry.keptSuffix}
                  </span>
                </div>
                <div className="lp-sx-ticks" role="group" aria-label={scenes.telemetry.heatmapTitle}>
                  {TICKS.map((lvl, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`${scenes.telemetry.dayPrefix} ${i + 1}`}
                      onMouseEnter={() => setHoveredDay(i)}
                      onFocus={() => setHoveredDay(i)}
                      onClick={() => setHoveredDay(i)}
                      className={`lp-sx-tick-btn lvl-${lvl} ${hoveredDay === i ? "is-hovered" : ""}`}
                    >
                      <span style={{ height: `${18 + lvl * 20}%` }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
