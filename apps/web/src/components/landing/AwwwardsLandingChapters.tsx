"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/layout/LocaleProvider";
import { useMagnetic } from "@/hooks/useMagnetic";
import { RollingText } from "@/components/ui/RollingText";
import { ScrollWordReveal } from "@/components/ui/ScrollWordReveal";
import { scrollToTarget } from "@/lib/smooth-scroll";
import type { PlaygroundNodeCopy } from "@/lib/landing-i18n";
import { WebGLAmbientField } from "./WebGLAmbientField";
import { WebGLNeuralGraphStage } from "./WebGLNeuralGraphStage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
   STAGE 01: PINNED EXPLODED PIPELINE VIEW + CUBIC BEZIER DATA CONDUITS
   ========================================================================== */
const TENSOR_BARS = [
  0.42, 0.88, 0.31, 0.74, 0.95, 0.56, 0.28, 0.84, 0.67, 0.49, 0.92, 0.61, 0.36,
  0.79, 0.85, 0.53,
];

export function ExplodedPipelineStage() {
  const { copy } = useLocale();
  const data = copy.explodedPipeline;
  const stageRef = useRef<HTMLElement>(null);
  const [focusedLayer, setFocusedLayer] = useState<"dom" | "vector" | "graph" | null>(
    null
  );

  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const plane0 = stageEl.querySelector<HTMLElement>("[data-plane='dom']");
          const plane1 = stageEl.querySelector<HTMLElement>("[data-plane='vector']");
          const plane2 = stageEl.querySelector<HTMLElement>("[data-plane='graph']");
          const path = stageEl.querySelector<SVGPathElement>("[data-conduit-path]");

          if (!plane0 || !plane1 || !plane2) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stageEl,
              start: "top 72%",
              end: "bottom 58%",
              scrub: 1.1,
            },
          });

          tl.fromTo(
            plane0,
            { y: 42, scale: 0.96 },
            { y: 0, scale: 1, ease: "none" },
            0
          )
            .fromTo(
              plane1,
              { y: 0, scale: 0.98 },
              { y: 0, scale: 1, ease: "none" },
              0
            )
            .fromTo(
              plane2,
              { y: -42, scale: 0.96 },
              { y: 0, scale: 1, ease: "none" },
              0
            );

          if (path) {
            const len = path.getTotalLength();
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);
          }
        }, stageEl);

        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="exploded-pipeline"
      ref={stageRef}
      className="bd-stage bd-exploded-stage"
      aria-labelledby="bd-exploded-title"
    >
      <div className="aw-container">
        <header className="bd-stage-header">
          <span className="bd-stage-index" data-fade>
            {data.stageIndex}
          </span>
          <div className="bd-stage-heading-row">
            <h2 id="bd-exploded-title" className="aw-title bd-stage-title" data-reveal>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  {data.titleLine1}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  {data.titleLine2}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  <em>{data.titleAccent}</em>
                </span>
              </span>
            </h2>
            <p className="aw-copy" data-fade>
              {data.subtitle}
            </p>
          </div>
        </header>

        <div className="bd-exploded-grid">
          {/* Left Architectural Selector Axis */}
          <div className="bd-exploded-controls">
            <div className="bd-exploded-toolbar">
              <button
                type="button"
                onClick={() => setFocusedLayer(null)}
                className={`bd-cluster-btn ${focusedLayer === null ? "is-active" : ""}`}
              >
                {data.focusAllLabel}
              </button>
            </div>

            <ol className="bd-exploded-layer-list">
              {data.layers.map((layer) => {
                const isSelected = focusedLayer === layer.id;
                const isDimmed = focusedLayer !== null && !isSelected;
                return (
                  <li
                    key={layer.id}
                    className={`bd-exploded-layer-item ${isSelected ? "is-active" : ""} ${isDimmed ? "is-dimmed" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setFocusedLayer((prev) => (prev === layer.id ? null : layer.id))
                      }
                      className="bd-exploded-layer-trigger"
                      aria-pressed={isSelected}
                    >
                      <div className="bd-exploded-layer-top">
                        <span className="bd-meta-mono">{layer.index}</span>
                        <span className="bd-meta-mono bd-text-cyan">{layer.latency}</span>
                      </div>
                      <h3 className="bd-exploded-layer-title">{layer.title}</h3>
                      <p className="bd-exploded-layer-desc">{layer.description}</p>
                      <div className="bd-exploded-metrics">
                        {layer.metrics.map((metric) => (
                          <span key={metric}>{metric}</span>
                        ))}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right Exploded Plane Stack + Cubic Bezier Conduit */}
          <div className="bd-exploded-viewport">
            <svg
              className="bd-bezier-conduit"
              viewBox="0 0 420 560"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="bd-conduit-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--spatial-cyan)" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="var(--spatial-emerald)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--spatial-amber)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                className="bd-conduit-base"
                d="M 210 36 C 325 125, 95 205, 210 280 C 325 355, 95 435, 210 524"
              />
              <path
                data-conduit-path
                className="bd-conduit-active"
                stroke="url(#bd-conduit-grad)"
                d="M 210 36 C 325 125, 95 205, 210 280 C 325 355, 95 435, 210 524"
              />
              <circle cx="210" cy="36" r="5" fill="var(--spatial-cyan)" />
              <circle cx="210" cy="280" r="5" fill="var(--spatial-emerald)" />
              <circle cx="210" cy="524" r="5" fill="var(--spatial-amber)" />
            </svg>

            {data.layers.map((layer, idx) => {
              const isSelected = focusedLayer === layer.id;
              const isDimmed = focusedLayer !== null && !isSelected;
              return (
                <div
                  key={layer.id}
                  data-plane={layer.id}
                  onClick={() =>
                    setFocusedLayer((prev) => (prev === layer.id ? null : layer.id))
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFocusedLayer((prev) => (prev === layer.id ? null : layer.id));
                    }
                  }}
                  aria-label={`${layer.index}: ${layer.name}`}
                  className={`bd-exploded-plane ${isSelected ? "is-focused" : ""} ${isDimmed ? "is-dimmed" : ""}`}
                >
                  <div className="spatial-node-header">
                    <div className="spatial-node-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span>{layer.name}</span>
                    <span className="bd-text-cyan">{layer.latency}</span>
                  </div>

                  <div className="bd-plane-body">
                    <span className="bd-meta-mono bd-plane-tag">{layer.snippetTag}</span>
                    <p className="bd-plane-snippet">{layer.snippetText}</p>

                    {idx === 1 && (
                      <div className="bd-tensor-bars" aria-hidden="true">
                        {TENSOR_BARS.map((val, bIdx) => (
                          <span
                            key={bIdx}
                            className="bd-tensor-bar"
                            style={{ height: `${Math.round(val * 100)}%` }}
                          />
                        ))}
                      </div>
                    )}

                    {idx === 2 && (
                      <svg
                        className="bd-plane-mini-graph"
                        viewBox="0 0 360 56"
                        aria-hidden="true"
                      >
                        <path
                          d="M 24 44 C 100 10, 140 48, 190 22 C 240 -2, 290 42, 336 16"
                          fill="none"
                          stroke="var(--spatial-emerald)"
                          strokeWidth="1.8"
                        />
                        <circle cx="24" cy="44" r="4" fill="var(--spatial-cyan)" />
                        <circle cx="190" cy="22" r="4.5" fill="var(--spatial-emerald)" />
                        <circle cx="336" cy="16" r="4" fill="var(--spatial-amber)" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   STAGE 02: LIVE SPATIAL THOUGHT-DROP PLAYGROUND (CUBIC BEZIER SYNAPSES)
   ========================================================================== */
interface DroppedThought {
  id: string;
  title: string;
  tag: string;
  coords: string;
  content: string;
  targetIds: string[];
  similarity: string;
  x: number;
  y: number;
}

function inferSemanticTargets(text: string): {
  targets: string[];
  similarity: string;
  tag: string;
} {
  const lower = text.toLowerCase();
  if (/webgl|shader|graph|visual|spatial|canvas|ui|link/.test(lower)) {
    return {
      targets: ["node-vector", "node-neuro"],
      similarity: "0.93 Cosine Match",
      tag: "SPATIAL GRAPH // LIVE",
    };
  }
  if (/sleep|memory|recall|learn|flashcard|sm-2|review|hippocamp/.test(lower)) {
    return {
      targets: ["node-sm2", "node-neuro"],
      similarity: "0.95 Cosine Match",
      tag: "RETRIEVAL LOOP // LIVE",
    };
  }
  if (/privacy|local|nano|npu|offline|chrome|browser|latency/.test(lower)) {
    return {
      targets: ["node-nano", "node-vector"],
      similarity: "0.92 Cosine Match",
      tag: "LOCAL NPU // 48MS",
    };
  }
  return {
    targets: ["node-nano", "node-sm2"],
    similarity: "0.91 Cosine Match",
    tag: "HYBRID SYNTHESIS // LIVE",
  };
}

function buildCubicBezierSvg(
  ax: number,
  ay: number,
  bx: number,
  by: number
): string {
  const dx = (bx - ax) * 0.48;
  return `M ${ax} ${ay} C ${ax + dx} ${ay}, ${bx - dx} ${by}, ${bx} ${by}`;
}

export function SpatialThoughtPlaygroundStage() {
  const { copy } = useLocale();
  const data = copy.playground;
  const reducedMotion = useReducedMotion();

  const [draftText, setDraftText] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-nano");
  const [droppedThoughts, setDroppedThoughts] = useState<DroppedThought[]>([]);

  const handleDropPreset = (presetIndex: number) => {
    const preset = data.presets[presetIndex];
    if (!preset) return;

    const slotOffset = droppedThoughts.length % 3;
    const newId = `dropped-${Date.now()}-${presetIndex}`;
    const newThought: DroppedThought = {
      id: newId,
      title: preset.label,
      tag: `${preset.category} // ${preset.vectorPreview}`,
      coords: `X:${390 + slotOffset * 48} · Y:${250 + slotOffset * 32}`,
      content: preset.content,
      targetIds: preset.targetIds,
      similarity: preset.similarity,
      x: 34 + slotOffset * 4,
      y: 33 + slotOffset * 4,
    };

    setDroppedThoughts((prev) => [...prev.slice(-2), newThought]);
    setSelectedNodeId(newId);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = draftText.trim();
    if (!trimmed) {
      handleDropPreset(0);
      return;
    }

    const inferred = inferSemanticTargets(trimmed);
    const slotOffset = droppedThoughts.length % 3;
    const newId = `dropped-${Date.now()}`;
    const newThought: DroppedThought = {
      id: newId,
      title: trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed,
      tag: inferred.tag,
      coords: `X:${410 + slotOffset * 45} · Y:${260 + slotOffset * 28}`,
      content: trimmed,
      targetIds: inferred.targets,
      similarity: inferred.similarity,
      x: 35 + slotOffset * 3.5,
      y: 34 + slotOffset * 3.5,
    };

    setDroppedThoughts((prev) => [...prev.slice(-2), newThought]);
    setSelectedNodeId(newId);
    setDraftText("");
  };

  const latestDropped = droppedThoughts[droppedThoughts.length - 1] ?? null;

  // Compute node center percentages for SVG Bezier edges
  const baseCenters: Record<string, { cx: number; cy: number }> = {};
  data.initialNodes.forEach((n: PlaygroundNodeCopy) => {
    baseCenters[n.id] = { cx: n.x + 15, cy: n.y + 13 };
  });

  const activeTargets = latestDropped
    ? latestDropped.targetIds
    : selectedNodeId === "node-nano"
      ? ["node-vector", "node-sm2"]
      : selectedNodeId === "node-vector"
        ? ["node-nano", "node-neuro"]
        : selectedNodeId === "node-neuro"
          ? ["node-vector", "node-sm2"]
          : ["node-nano", "node-neuro"];

  const activeOrigin = latestDropped
    ? { cx: latestDropped.x + 15, cy: latestDropped.y + 13 }
    : baseCenters[selectedNodeId] ?? { cx: 21, cy: 23 };

  return (
    <section
      id="spatial-playground"
      className="bd-stage bd-playground-stage"
      aria-labelledby="bd-playground-title"
    >
      <div className="aw-container">
        <header className="bd-stage-header">
          <span className="bd-stage-index" data-fade>
            {data.stageIndex}
          </span>
          <div className="bd-stage-heading-row">
            <h2 id="bd-playground-title" className="aw-title bd-stage-title" data-reveal>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  {data.titleLine1}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  <em>{data.titleAccent}</em>
                </span>
              </span>
            </h2>
            <p className="aw-copy" data-fade>
              {data.subtitle}
            </p>
          </div>
        </header>

        {/* Command Bar + Preset Triggers */}
        <div className="bd-playground-command" data-fade>
          <form onSubmit={handleSubmit} className="bd-command-form">
            <label htmlFor="bd-thought-input" className="sr-only">
              {data.inputPlaceholder}
            </label>
            <input
              id="bd-thought-input"
              type="text"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder={data.inputPlaceholder}
              className="bd-command-input"
              maxLength={180}
            />
            <button type="submit" className="aw-closing-primary bd-command-submit">
              <span>{data.dropButtonLabel}</span>
            </button>
            {droppedThoughts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setDroppedThoughts([]);
                  setSelectedNodeId("node-nano");
                }}
                className="bd-cluster-btn"
              >
                {data.resetButtonLabel}
              </button>
            )}
          </form>

          <div className="bd-preset-bar">
            <span className="bd-meta-mono">{data.presetsLabel}</span>
            <div className="bd-preset-list">
              {data.presets.map((preset, idx) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleDropPreset(idx)}
                  className="bd-preset-btn"
                >
                  <span>0{idx + 1}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Spatial Canvas Coordinate Desk */}
        <div className="bd-playground-board">
          <div className="bd-board-grid" aria-hidden="true" />

          {/* Live Board Status Bar */}
          <div className="bd-board-hud">
            <span>
              {data.vectorStatusLabel} //{" "}
              <strong className="bd-text-cyan">
                {latestDropped ? latestDropped.similarity : data.activeMatchLabel}
              </strong>
            </span>
            <span className="bd-meta-mono">
              NODES: {data.initialNodes.length + droppedThoughts.length} · CUBIC BÉZIER SVG
            </span>
          </div>

          {/* Desktop SVG Cubic Bezier Synapse Overlay */}
          <svg
            className="bd-board-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Persistent Ambient Structural Edges */}
            <path
              className="bd-board-edge-base"
              d={buildCubicBezierSvg(21, 23, 76, 21)}
            />
            <path
              className="bd-board-edge-base"
              d={buildCubicBezierSvg(21, 23, 23, 70)}
            />
            <path
              className="bd-board-edge-base"
              d={buildCubicBezierSvg(76, 21, 75, 69)}
            />
            <path
              className="bd-board-edge-base"
              d={buildCubicBezierSvg(23, 70, 75, 69)}
            />

            {/* Active Semantic Synapse Edges */}
            {activeTargets.map((targetId) => {
              const target = baseCenters[targetId];
              if (!target) return null;
              return (
                <path
                  key={`${selectedNodeId}-${targetId}`}
                  className="bd-board-edge-active"
                  d={buildCubicBezierSvg(
                    activeOrigin.cx,
                    activeOrigin.cy,
                    target.cx,
                    target.cy
                  )}
                />
              );
            })}
          </svg>

          {/* 4 Base Spatial Canvas Nodes */}
          {data.initialNodes.map((node) => {
            const isTarget = activeTargets.includes(node.id);
            const isSelected = selectedNodeId === node.id && !latestDropped;
            return (
              <div
                key={node.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setDroppedThoughts([]);
                  setSelectedNodeId(node.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDroppedThoughts([]);
                    setSelectedNodeId(node.id);
                  }
                }}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`bd-spatial-note bd-tone-${node.tone} ${isTarget || isSelected ? "is-connected" : ""}`}
              >
                <div className="bd-note-header">
                  <span className="bd-meta-mono">{node.tag}</span>
                  <span className="bd-meta-mono">{node.coords}</span>
                </div>
                <h3 className="bd-note-title">{node.title}</h3>
                <p className="bd-note-body">{node.snippet}</p>
              </div>
            );
          })}

          {/* Dynamically Dropped Thoughts */}
          <AnimatePresence>
            {droppedThoughts.map((thought) => (
              <motion.div
                key={thought.id}
                initial={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.86, y: -28 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                style={{ left: `${thought.x}%`, top: `${thought.y}%` }}
                className="bd-spatial-note bd-note-dropped is-connected"
              >
                <div className="bd-note-header">
                  <span className="bd-meta-mono bd-text-cyan">{thought.similarity}</span>
                  <span className="bd-meta-mono">{thought.coords}</span>
                </div>
                <h3 className="bd-note-title">{thought.title}</h3>
                <p className="bd-note-body">{thought.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   STAGE 03: HORIZONTAL SCROLL SPATIAL GALLERY (4 CONTINUOUS STATIONS)
   ========================================================================== */
export function HorizontalSpatialGalleryStage() {
  const { copy } = useLocale();
  const data = copy.horizontalGallery;
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;
    if (!section || !pinWrap || !track) return;

    let raf1 = 0;
    let raf2 = 0;
    const mm = gsap.matchMedia();

    // Wait two frames so SpatialCanvasJourney's requestAnimationFrame pin is registered first
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        mm.add(
          "(min-width: 960px) and (prefers-reduced-motion: no-preference)",
          () => {
            const ctx = gsap.context(() => {
              const getDistance = () =>
                Math.max(0, track.scrollWidth - window.innerWidth + 96);

              gsap.to(track, {
                x: () => -getDistance(),
                ease: "none",
                scrollTrigger: {
                  trigger: pinWrap,
                  pin: pinWrap,
                  pinSpacing: true,
                  scrub: 1,
                  start: "top top",
                  end: () => `+=${Math.max(1400, getDistance() * 1.1)}`,
                  invalidateOnRefresh: true,
                  anticipatePin: 1,
                  refreshPriority: -1,
                },
              });
            }, section);

            ScrollTrigger.sort();
            ScrollTrigger.refresh();

            return () => ctx.revert();
          }
        );
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      mm.revert();
    };
  }, []);

  const handleFrameMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-rx", `${(-ny * 6.5).toFixed(2)}deg`);
    el.style.setProperty("--tilt-ry", `${(nx * 8.5).toFixed(2)}deg`);
  };

  const handleFrameLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  };

  return (
    <section
      id="horizontal-gallery"
      ref={sectionRef}
      className="bd-stage bd-hscroll-section"
      aria-labelledby="bd-hscroll-title"
    >
      <div className="aw-container bd-hscroll-intro">
        <div className="bd-stage-header">
          <span className="bd-stage-index" data-fade>
            {data.stageIndex}
          </span>
          <div className="bd-stage-heading-row">
            <h2 id="bd-hscroll-title" className="aw-title bd-stage-title" data-reveal>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  {data.titleLine1}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  <em>{data.titleAccent}</em>
                </span>
              </span>
            </h2>
            <span className="bd-meta-mono bd-hscroll-cue">{data.scrollHint}</span>
          </div>
        </div>
      </div>

      <div ref={pinWrapRef} className="bd-hscroll-pin-wrap">
        <div className="aw-container bd-hscroll-pin-bar" aria-hidden="true">
          <span className="bd-meta-mono bd-text-cyan">{data.stageIndex}</span>
          <span className="bd-meta-mono">{data.scrollHint}</span>
        </div>

        <div className="bd-hscroll-viewport">
          <div ref={trackRef} className="bd-hscroll-track">
          {/* Continuous Horizontal Cubic Bezier Wave Connecting All 4 Stations */}
          <svg
            className="bd-hscroll-wave"
            viewBox="0 0 1600 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 40 60 C 220 12, 340 108, 520 60 C 700 12, 860 108, 1040 60 C 1220 12, 1380 108, 1560 60"
              fill="none"
              stroke="var(--spatial-cyan)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.45"
            />
          </svg>

          {data.stations.map((station) => (
            <article key={station.id} className="bd-hscroll-panel">
              <div className="bd-station-layout">
                <div className="bd-station-copy">
                  <span className="bd-meta-mono bd-text-cyan">{station.code}</span>
                  <h3 className="bd-station-title">
                    {station.title} <br />
                    <em>{station.accent}</em>
                  </h3>
                  <p className="aw-copy">{station.description}</p>

                  <div className="bd-exploded-metrics">
                    {station.telemetry.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>

                  <div className="bd-station-action">
                    <Link href={station.href} className="aw-text-link group">
                      <RollingText text={station.cta} />{" "}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>

                <div
                  className="bd-station-frame"
                  onPointerMove={handleFrameMove}
                  onPointerLeave={handleFrameLeave}
                >
                  <div className="spatial-node-header">
                    <div className="spatial-node-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span>{station.imageAlt}</span>
                    <span className="bd-text-cyan">{station.overlayMetric}</span>
                  </div>

                  <div className="bd-station-media" data-image-reveal>
                    <Image
                      src={station.fallbackImage}
                      alt={station.imageAlt}
                      width={1280}
                      height={760}
                      className="bd-station-img"
                    />
                    <video
                      className="bd-station-video"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    >
                      <source src={station.videoSrc} type="video/mp4" />
                    </video>
                  </div>

                  <div className="bd-station-overlay-note">
                    <span className="bd-meta-mono bd-text-cyan">
                      {station.overlayTag}
                    </span>
                    <p>{station.overlayNote}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   STAGE 05: KINETIC TYPOGRAPHY & SPATIAL WORKSPACE PORTAL FOOTER
   ========================================================================== */
export function SpatialPortalFooterStage() {
  const { copy } = useLocale();
  const data = copy.portalFooter;
  const primaryRef = useMagnetic<HTMLAnchorElement>(0.22);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const marqueeEl = marqueeRef.current;
    if (!marqueeEl) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          marqueeEl,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: marqueeEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }, marqueeEl);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <footer
      id="spatial-portal"
      className="bd-stage bd-portal-footer"
      aria-labelledby="bd-portal-title"
    >
      <div className="aw-container">
        <span className="bd-stage-index" data-fade>
          {data.stageIndex}
        </span>

        {/* Scroll-Scrubbed Word Reveal Manifesto */}
        <div className="bd-portal-manifesto">
          <ScrollWordReveal as="p" className="bd-manifesto-quote">
            {data.manifestoQuote}
          </ScrollWordReveal>
        </div>
      </div>

      {/* Scroll-Velocity Kinetic Typography Band */}
      <div className="bd-kinetic-band" aria-hidden="true">
        <div ref={marqueeRef} className="bd-kinetic-track">
          <span>BRAINDROP / AI</span>
          <span>·</span>
          <em>LOCAL NPU 48MS</em>
          <span>·</span>
          <span>1536-D TOPOLOGY</span>
          <span>·</span>
          <em>CLOUD FLASH SYNTHESIS</em>
          <span>·</span>
          <span>SPATIAL SECOND BRAIN</span>
        </div>
      </div>

      <div className="aw-container">
        <div className="bd-portal-cta-block">
          <h2 id="bd-portal-title" className="aw-title bd-portal-title" data-reveal>
            <span className="block overflow-hidden">
              <span className="inline-block" data-reveal-line>
                {data.titleLine1}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block" data-reveal-line>
                <em>{data.titleAccent}</em>
              </span>
            </span>
          </h2>

          <div className="bd-portal-actions">
            <Link
              ref={primaryRef}
              href="/notes"
              className="aw-closing-primary group"
            >
              <RollingText text={data.primaryCta} />{" "}
              <span aria-hidden="true">↗</span>
            </Link>

            <a
              href="/braindrop-extension.zip"
              download
              className="aw-text-link group"
            >
              <RollingText text={data.extensionCta} />{" "}
              <span aria-hidden="true">↓</span>
            </a>

            <Link href="/capture" className="aw-text-link group">
              <RollingText text={data.secondaryCta} />{" "}
              <span aria-hidden="true">↗</span>
            </Link>

            <Link href="/graph" className="aw-text-link group">
              <RollingText text={data.graphCta} />{" "}
              <span aria-hidden="true">↗</span>
            </Link>

            <Link href="/flashcards" className="aw-text-link group">
              <RollingText text={data.cardsCta} />{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="bd-colophon">
          <button
            type="button"
            onClick={() => scrollToTarget("#canvas-journey")}
            className="bd-colophon-brand"
          >
            <span aria-hidden="true">✳</span>
            <span>
              braindrop <em>/ ai</em>
            </span>
          </button>

          <span className="bd-meta-mono">{data.colophon}</span>

          <button
            type="button"
            onClick={() => scrollToTarget("#canvas-journey")}
            className="aw-text-link group"
          >
            <RollingText text={data.backToTop} />{" "}
            <span aria-hidden="true">↑</span>
          </button>
        </div>

        <p className="bd-portal-disclosure">{data.disclosure}</p>
      </div>
    </footer>
  );
}

/* ==========================================================================
   MASTER ORCHESTRATOR (LENIS + GSAP SCROLLTRIGGER + WEBGL 3D STAGES)
   ========================================================================== */
export function AwwwardsLandingChapters() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = gsap.context(() => {
      // Staggered line mask reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>("[data-reveal-line]");
        if (!lines.length) return;
        gsap.from(lines, {
          yPercent: 108,
          duration: 1.05,
          stagger: 0.1,
          ease: "power4.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

      // Soft fades for subtitles & coordinate indices
      gsap.utils.toArray<HTMLElement>("[data-fade]", root).forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });

      // Clip-path visual frame reveals
      gsap.utils.toArray<HTMLElement>("[data-image-reveal]", root).forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(10% 6% 10% 6%)",
          duration: 1.15,
          ease: "power3.out",
          clearProps: "clipPath",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        });
      });
    }, root);

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="aw-chapters-root">
      <WebGLAmbientField />
      <ExplodedPipelineStage />
      <SpatialThoughtPlaygroundStage />
      <HorizontalSpatialGalleryStage />
      <WebGLNeuralGraphStage />
      <SpatialPortalFooterStage />
    </div>
  );
}
