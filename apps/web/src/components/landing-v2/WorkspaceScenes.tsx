"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { V2Copy } from "@/lib/landing-v2-copy";

interface Props {
  activeIndex: number;
  copy: V2Copy["product"];
}

const TICKS = [
  1, 2, 0, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 1, 2, 3, 4, 3, 1, 2, 4, 3, 3, 2, 4, 4, 2, 3, 4, 4,
];
const WAVE = [32, 68, 45, 90, 54, 78, 40, 85, 62, 48, 74, 36, 60, 82, 44, 52, 70, 38];

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

/** The five modules as typography on canvas: no frames, only hairlines. */
export function WorkspaceScenes({ activeIndex, copy }: Props) {
  const safeIdx = Math.max(0, Math.min(copy.tabs.length - 1, activeIndex));
  const tab = copy.tabs[safeIdx];
  const { scenes } = copy;

  const [captureMode, setCaptureMode] = useState(0);
  const [noteIdx, setNoteIdx] = useState(0);
  const [nodeId, setNodeId] = useState("router");
  const [flipped, setFlipped] = useState(false);
  const [box, setBox] = useState(1);

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

  return (
    <div className="v2-sx" role="region" aria-label={tab.name}>
      <div className="v2-sx-bar">
        <span className="v2-sx-route">{tab.routeLabel}</span>
        <Link href={tab.href} className="group v2-sx-open">
          <RollingText text={tab.ctaLabel} />
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="v2-sx-stage"
        >
          {tab.id === "capture" && (
            <div className="v2-sx-capture">
              <div className="v2-sx-links" role="tablist">
                {scenes.capture.modes.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={captureMode === i}
                    onClick={() => setCaptureMode(i)}
                    className={`v2-tlink ${captureMode === i ? "is-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p className="v2-sx-quote">
                {captureMode === 0
                  ? `“${scenes.capture.excerpt}”`
                  : captureMode === 1
                    ? `“${scenes.capture.quickDraft}”`
                    : scenes.capture.voiceTranscript}
              </p>

              {captureMode === 2 && (
                <div className="v2-sx-wave" aria-hidden="true">
                  {WAVE.map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              )}

              <div className="v2-sx-meta">
                <span>
                  {captureMode === 0
                    ? scenes.capture.sourceDomain
                    : captureMode === 1
                      ? "quick-thought.md"
                      : "voice-memo"}
                </span>
                <span className="v2-sx-ok">{scenes.capture.savedLabel}</span>
                <span>{scenes.capture.tags.map((t) => `#${t}`).join("  ")}</span>
              </div>
            </div>
          )}

          {tab.id === "notes" && (
            <div className="v2-sx-notes">
              <div className="v2-sx-doc">
                <span className="v2-sx-small">{scenes.notes.docMeta}</span>
                <h3 className="v2-sx-title">{scenes.notes.docTitle}</h3>
                <p className="v2-sx-body">{scenes.notes.docBody}</p>
                <p className="v2-sx-body">
                  <mark className="v2-sx-mark">{scenes.notes.docQuote}</mark>
                </p>
              </div>
              <aside className="v2-sx-margin">
                <span className="v2-sx-small">{scenes.notes.copilotTitle}</span>
                <ul>
                  {scenes.notes.actions.map((a, i) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setNoteIdx(i)}
                        className={`v2-tlink ${noteIdx === i ? "is-active" : ""}`}
                      >
                        {a.label}
                      </button>
                      <span className="v2-sx-latency">{a.latency}</span>
                    </li>
                  ))}
                </ul>
                <p className="v2-sx-note">{scenes.notes.actions[noteIdx]?.output}</p>
              </aside>
            </div>
          )}

          {tab.id === "graph" && (
            <div className="v2-sx-graph">
              <span className="v2-sx-small">{scenes.graph.inspectorLabel}</span>
              <div className="v2-sx-canvas">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="v2-graph-beam" x="-40%" y="-40%" width="180%" height="180%">
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
                          className={`v2-sx-edge ${dashed ? "is-dashed" : ""} ${lit ? "is-lit" : ""}`}
                        />
                        {lit && (
                          <circle
                            r="1.15"
                            className="v2-sx-beam-dot"
                            filter="url(#v2-graph-beam)"
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
                {scenes.graph.nodes.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    onMouseEnter={() => setNodeId(n.id)}
                    onClick={() => setNodeId(n.id)}
                    className={`v2-sx-node is-${n.cluster} ${
                      n.id === node.id ? "is-selected" : neighbors.has(n.id) ? "is-near" : ""
                    }`}
                  >
                    <i aria-hidden="true" />
                    {n.id === node.id && <em className="v2-sx-bloom" aria-hidden="true" />}
                    <span>{n.label}</span>
                  </button>
                ))}
              </div>
              <p className="v2-sx-note">
                <strong>{node.label}</strong> — {node.summary}
              </p>
            </div>
          )}

          {tab.id === "flashcards" && (
            <div className="v2-sx-cards">
              <div className="v2-sx-steps">
                {scenes.flashcards.boxLabels.map((l, i) => (
                  <span key={l} className={box === i ? "is-active" : ""}>
                    {l}
                  </span>
                ))}
                <em>
                  {scenes.flashcards.masteryLabel} {retention}%
                </em>
              </div>

              <div className="v2-sx-flipwrap">
                <button
                  type="button"
                  onClick={() => setFlipped((f) => !f)}
                  className={`v2-sx-flip ${flipped ? "is-flipped" : ""}`}
                  aria-label={scenes.flashcards.flipHint}
                >
                  <span className="v2-sx-face">
                    <span className="v2-sx-small">{scenes.flashcards.flipHint}</span>
                    <span className="v2-sx-q">{scenes.flashcards.question}</span>
                  </span>
                  <span className="v2-sx-face v2-sx-back">
                    <span className="v2-sx-body">{scenes.flashcards.answer}</span>
                    <code className="v2-sx-code">{scenes.flashcards.code}</code>
                  </span>
                </button>
              </div>

              <div className="v2-sx-links">
                {scenes.flashcards.ratings.map((r, i) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setBox(i);
                      setFlipped(false);
                    }}
                    className={`v2-tlink ${box === i ? "is-active" : ""}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab.id === "telemetry" && (
            <div className="v2-sx-tele">
              <div className="v2-sx-big">
                <strong>{scenes.telemetry.ratioValue}</strong>
                <span>
                  {scenes.telemetry.ratioTitle}
                  <br />
                  <small>{scenes.telemetry.ratioSub}</small>
                </span>
              </div>

              <div className="v2-sx-stats">
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

              <div className="v2-sx-lat">
                <span className="v2-sx-small">{scenes.telemetry.latencyTitle}</span>
                <div>
                  <span>{scenes.telemetry.nanoBarLabel}</span>
                  <i style={{ ["--w" as string]: "8%" }} className="is-fast" />
                </div>
                <div>
                  <span>{scenes.telemetry.cloudBarLabel}</span>
                  <i style={{ ["--w" as string]: "86%" }} />
                </div>
              </div>

              <div className="v2-sx-ticks-wrap">
                <span className="v2-sx-small">{scenes.telemetry.heatmapTitle}</span>
                <div className="v2-sx-ticks" aria-hidden="true">
                  {TICKS.map((lvl, i) => (
                    <span key={i} style={{ height: `${14 + lvl * 20}%` }} className={`lvl-${lvl}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
