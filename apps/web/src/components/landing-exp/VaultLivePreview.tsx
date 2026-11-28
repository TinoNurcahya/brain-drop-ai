"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LANDING_COPY } from "@/lib/landing-copy";
import type { Locale } from "@/lib/landing-i18n";
import type { VaultRoomItem } from "@/lib/landing-walton-copy";

interface VaultLivePreviewProps {
  roomId: VaultRoomItem["id"];
  locale: Locale;
}

const TICKS = [
  1, 2, 0, 3, 2, 1, 4, 3, 2, 1, 3, 4, 2, 1, 2, 3, 4, 3, 1, 2, 4, 3, 3, 2, 4, 4, 2, 3, 4, 4,
];
const WAVE = [28, 66, 44, 88, 52, 76, 38, 84, 60, 46, 72, 34, 58, 80, 42, 50, 68, 36, 62, 40];

/** Uniform 200x100 SVG coordinate helper so circles remain mathematically round. */
function curvedEdgePath(ax: number, ay: number, bx: number, by: number, idx: number): string {
  const sx = ax * 2;
  const sy = ay;
  const tx = bx * 2;
  const ty = by;
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy) || 1;
  const bend = (idx % 2 === 0 ? 1 : -1) * Math.min(9, len * 0.14);
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return `M ${sx} ${sy} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${tx} ${ty}`;
}

export function VaultLivePreview({ roomId, locale }: VaultLivePreviewProps) {
  const reducedMotion = useReducedMotion();
  const scenes = LANDING_COPY[locale].product.scenes;

  const [captureMode, setCaptureMode] = useState(0);
  const [noteIdx, setNoteIdx] = useState(0);
  const [nodeId, setNodeId] = useState("router");
  const [nodePull, setNodePull] = useState<Record<string, { x: number; y: number }>>({});
  const graphCanvasRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [box, setBox] = useState(1);
  const [hoveredDay, setHoveredDay] = useState<number>(TICKS.length - 1);

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

  const handleGraphMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !graphCanvasRef.current) return;
    const rect = graphCanvasRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    const nextPull: Record<string, { x: number; y: number }> = {};
    for (const n of scenes.graph.nodes) {
      const dx = px - n.x;
      const dy = py - n.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 26 && dist > 0.1) {
        const strength = (1 - dist / 26) * 5;
        nextPull[n.id] = { x: (dx / dist) * strength, y: (dy / dist) * strength };
      } else {
        nextPull[n.id] = { x: 0, y: 0 };
      }
    }
    setNodePull(nextPull);
  };

  const activeAction = scenes.notes.actions[noteIdx] ?? scenes.notes.actions[0];
  const retention = box === 0 ? 74 : box === 1 ? 88 : 96;
  const activeDayLvl = TICKS[hoveredDay] ?? 3;
  const activeDayOps = activeDayLvl === 0 ? 1 : activeDayLvl * 3 + ((hoveredDay % 2) + 1);
  const activeDayKb = (activeDayOps * 1.6).toFixed(1);

  return (
    <div className="wf-live-stage">
      {roomId === "capture" && (
        <div className="wf-live-capture">
          <div className="wf-live-subtabs" role="tablist" aria-label="Capture input modes">
            {scenes.capture.modes.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={captureMode === i}
                onClick={() => setCaptureMode(i)}
                className={`wf-live-tab ${captureMode === i ? "is-active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <blockquote className="wf-live-quote">
            {captureMode === 0
              ? `“${scenes.capture.excerpt}”`
              : captureMode === 1
                ? `“${scenes.capture.quickDraft}”`
                : scenes.capture.voiceTranscript}
          </blockquote>

          {captureMode === 2 && (
            <div className="wf-live-wave" aria-hidden="true">
              {WAVE.map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          )}

          <div className="wf-live-meta-wrap">
            <span className="wf-mono">
              {captureMode === 0
                ? scenes.capture.sourceDomain
                : captureMode === 1
                  ? "quick-thought.md"
                  : "voice-memo.webm"}
            </span>
            <span className="wf-mono">{scenes.capture.modeStats[captureMode]}</span>
            <span className="wf-lime-chip">{scenes.capture.savedLabel}</span>
            <span className="wf-mono">{scenes.capture.tags.map((t) => `#${t}`).join("  ")}</span>
          </div>
        </div>
      )}

      {roomId === "notes" && (
        <div className="wf-live-notes">
          <div className="wf-live-doc">
            <span className="wf-mono wf-muted">{scenes.notes.docMeta}</span>
            <h4 className="wf-live-doc-title">{scenes.notes.docTitle}</h4>
            <p className="wf-live-doc-p">
              <span className="wf-mono wf-muted" aria-hidden="true">
                01
              </span>
              <span>{scenes.notes.docBody}</span>
            </p>
            <p className="wf-live-doc-p">
              <span className="wf-mono wf-muted" aria-hidden="true">
                02
              </span>
              <mark className="wf-live-mark">{scenes.notes.docQuote}</mark>
            </p>
          </div>

          <div className="wf-live-copilot">
            <span className="wf-caption">{scenes.notes.copilotTitle}</span>
            <div className="wf-live-action-list">
              {scenes.notes.actions.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setNoteIdx(i)}
                  className={`wf-live-action-btn ${noteIdx === i ? "is-active" : ""}`}
                >
                  <span>{a.label}</span>
                  <span className="wf-mono">{a.latency}</span>
                </button>
              ))}
            </div>

            <motion.div
              key={activeAction.id}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="wf-live-copilot-out"
            >
              <p>{activeAction.output}</p>
              <span className="wf-lime-chip">{activeAction.savedNote}</span>
            </motion.div>
          </div>
        </div>
      )}

      {roomId === "graph" && (
        <div className="wf-live-graph">
          <span className="wf-caption">{scenes.graph.inspectorLabel}</span>
          <div
            ref={graphCanvasRef}
            className="wf-live-graph-canvas"
            onPointerMove={handleGraphMove}
            onPointerLeave={() => setNodePull({})}
          >
            {/* Uniform 200x100 viewBox matching 2:1 aspect-ratio prevents oval distortion */}
            <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
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
                      className={`wf-graph-edge ${dashed ? "is-dashed" : ""} ${lit ? "is-lit" : ""}`}
                    />
                    {lit && !reducedMotion && (
                      <circle r="2.2" className="wf-graph-pulse">
                        <animateMotion
                          dur={`${1.8 + (edgeIdx % 3) * 0.45}s`}
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
              const isSelected = n.id === node.id;
              const isNear = neighbors.has(n.id);
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
                  className={`wf-graph-node ${isSelected ? "is-selected" : isNear ? "is-near" : ""}`}
                >
                  <i aria-hidden="true" />
                  <span>{n.label}</span>
                </button>
              );
            })}
          </div>

          <div className="wf-live-graph-foot">
            <p>
              <strong>{node.label}</strong> — {node.summary}
            </p>
            <span className="wf-lime-chip">
              {scenes.graph.degreeLabel} {node.connections} · {scenes.graph.affinityLabel}{" "}
              {node.affinity}
            </span>
          </div>
        </div>
      )}

      {roomId === "flashcards" && (
        <div className="wf-live-cards">
          <div className="wf-live-boxes">
            {scenes.flashcards.boxLabels.map((l, i) => (
              <span key={l} className={box === i ? "is-active" : ""}>
                {l}
              </span>
            ))}
            <span className="wf-lime-chip">
              {scenes.flashcards.masteryLabel} {retention}%
            </span>
          </div>

          <div className="wf-live-flip-wrap">
            <button
              type="button"
              aria-pressed={flipped}
              onClick={() => setFlipped((f) => !f)}
              className={`wf-live-flip ${flipped ? "is-flipped" : ""}`}
            >
              <span className="wf-live-face">
                <span className="wf-live-face-top">
                  <span className="wf-caption">{scenes.flashcards.frontLabel}</span>
                  <span className="wf-mono wf-muted">{scenes.flashcards.deckMeta}</span>
                </span>
                <span className="wf-live-face-q">{scenes.flashcards.question}</span>
                <span className="wf-caption">{scenes.flashcards.flipHint}</span>
              </span>

              <span className="wf-live-face is-back">
                <span className="wf-live-face-top">
                  <span className="wf-lime-chip">{scenes.flashcards.backLabel}</span>
                  <span className="wf-mono wf-muted">{scenes.flashcards.deckMeta}</span>
                </span>
                <span className="wf-live-face-a">{scenes.flashcards.answer}</span>
                <code className="wf-live-code">{scenes.flashcards.code}</code>
              </span>
            </button>
          </div>

          <div className="wf-live-subtabs">
            {scenes.flashcards.ratings.map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setBox(i);
                  setFlipped(false);
                }}
                className={`wf-live-tab ${box === i ? "is-active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {roomId === "dashboard" && (
        <div className="wf-live-tele">
          <div className="wf-live-tele-top">
            <div>
              <strong className="wf-live-tele-ratio">{scenes.telemetry.ratioValue}</strong>
              <span className="wf-caption">{scenes.telemetry.ratioTitle}</span>
            </div>
            <div className="wf-live-tele-pair">
              <div>
                <span className="wf-caption">{scenes.telemetry.localBytesLabel}</span>
                <b className="wf-mono">{scenes.telemetry.localBytesValue}</b>
              </div>
              <div>
                <span className="wf-caption">{scenes.telemetry.piiStatusLabel}</span>
                <b className="wf-lime-chip">{scenes.telemetry.piiStatusValue}</b>
              </div>
            </div>
          </div>

          <div className="wf-live-lat">
            <div className="wf-live-lat-row">
              <span className="wf-mono">{scenes.telemetry.nanoBarLabel}</span>
              <span className="wf-live-lat-track">
                <i className="is-fast" style={{ width: "8%" }} />
              </span>
            </div>
            <div className="wf-live-lat-row">
              <span className="wf-mono wf-muted">{scenes.telemetry.cloudBarLabel}</span>
              <span className="wf-live-lat-track">
                <i style={{ width: "86%" }} />
              </span>
            </div>
          </div>

          <div className="wf-live-heat">
            <div className="wf-live-heat-head">
              <span className="wf-caption">{scenes.telemetry.heatmapTitle}</span>
              <span className="wf-mono">
                {scenes.telemetry.dayPrefix} {String(hoveredDay + 1).padStart(2, "0")} ·{" "}
                {activeDayOps} ops · {activeDayKb} KB
              </span>
            </div>
            <div className="wf-live-bars" role="group" aria-label={scenes.telemetry.heatmapTitle}>
              {TICKS.map((lvl, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${scenes.telemetry.dayPrefix} ${i + 1}`}
                  onMouseEnter={() => setHoveredDay(i)}
                  onFocus={() => setHoveredDay(i)}
                  onClick={() => setHoveredDay(i)}
                  className={`wf-live-bar lvl-${lvl} ${hoveredDay === i ? "is-hovered" : ""}`}
                >
                  <span style={{ height: `${20 + lvl * 20}%` }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
