"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ArrowUpRight } from "lucide-react";
import { RollingText } from "@/components/ui/RollingText";
import type { ChaptersCopy } from "@/lib/landing-v2-chapters";
import { scrollToY } from "@/lib/smooth-scroll";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

interface Clip {
  text: string;
  sentenceIdx: 0 | 1;
  n: number;
  time: string;
}

// Four diagonal stations across a 3900×1560 editorial sheet.
const PINS = [
  { x: 420, y: 420, cx: 725, cy: 550 },
  { x: 1420, y: 860, cx: 1715, cy: 985 },
  { x: 2380, y: 390, cx: 2670, cy: 520 },
  { x: 3260, y: 830, cx: 3540, cy: 960 },
] as const;

// Continuous Cubic Bézier thread arching cleanly from station to station.
const THREAD_PATH =
  "M 420 420 C 780 280, 1140 860, 1420 860 C 1760 725, 2060 390, 2380 390 C 2730 255, 2970 830, 3260 830";

// Subtle long-range cross-reference filament linking initial web clip (01) to local graph (03).
const CROSS_REF_PATH = "M 420 420 C 1020 140, 1780 140, 2380 390";

const trunc = (s: string, max = 92) => (s.length > max ? `${s.slice(0, max).trimEnd()}…` : s);

/** Editorial 2D Camera-Pan Thread Canvas: Chrome MV3 Web Clipper -> Local Nano Triage -> Graph -> Recall. */
export function ClipperChapter({ copy }: { copy: ChaptersCopy["clipper"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const crossRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const selectedRef = useRef(false);
  const autoDone = useRef(false);
  const countRef = useRef(0);

  const [activeStation, setActiveStation] = useState(0);
  const [litCount, setLitCount] = useState(1);
  const [clip, setClip] = useState<Clip | null>(null);
  const [answerOpen, setAnswerOpen] = useState(false);

  const saveClip = useCallback((text: string, idx: 0 | 1 = 1) => {
    const clean = text.trim();
    if (!clean) return;
    const n = ++countRef.current;
    setClip({
      text: clean,
      sentenceIdx: idx,
      n,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  }, []);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const rig = rigRef.current;
    if (!el || !rig) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    if (reduce || narrow) {
      setLitCount(copy.sentences.length);
      return;
    }

    const computeWaypoints = () => {
      const vp = viewportRef.current;
      const vw = vp?.clientWidth || window.innerWidth;
      const vh = vp?.clientHeight || window.innerHeight * 0.65;
      const scale = vw < 1260 ? 0.9 : 1;
      const focusX = vw * 0.47;
      const focusY = vh * 0.48;
      return PINS.map((p) => ({
        x: Math.round(focusX - p.cx * scale),
        y: Math.round(focusY - p.cy * scale),
        scale,
      }));
    };

    const ctx = gsap.context(() => {
      const wps = computeWaypoints();
      gsap.set(rig, {
        transformOrigin: "0 0",
        x: wps[0].x,
        y: wps[0].y,
        scale: wps[0].scale,
      });

      const thread = threadRef.current;
      const cross = crossRef.current;
      const bead = beadRef.current;
      const halo = haloRef.current;

      if (thread) gsap.set(thread, { drawSVG: "0% 0%" });
      if (cross) gsap.set(cross, { drawSVG: "0% 0%", opacity: 0 });

      const syncThread = (p: number) => {
        const idx = p < 0.24 ? 0 : p < 0.54 ? 1 : p < 0.82 ? 2 : 3;
        setActiveStation((prev) => (prev === idx ? prev : idx));
        setLitCount(p > 0.06 ? copy.sentences.length : 1);

        if (p > 0.14 && !autoDone.current) {
          autoDone.current = true;
          const autoIdx: 0 | 1 = copy.autoIndex === 0 ? 0 : 1;
          const s = sentenceRefs.current[autoIdx];
          if (s?.textContent) saveClip(s.textContent, autoIdx);
        }

        const drawFrac = Math.min(1, Math.max(0, (p - 0.04) / 0.88));
        if (thread) {
          gsap.set(thread, { drawSVG: `0% ${(drawFrac * 100).toFixed(2)}%` });
          const len = thread.getTotalLength();
          const pt = thread.getPointAtLength(drawFrac * len);
          if (bead) {
            bead.setAttribute("cx", pt.x.toFixed(1));
            bead.setAttribute("cy", pt.y.toFixed(1));
          }
          if (halo) {
            halo.setAttribute("cx", pt.x.toFixed(1));
            halo.setAttribute("cy", pt.y.toFixed(1));
          }
          if (coordRef.current) {
            coordRef.current.textContent = `x ${String(Math.round(pt.x)).padStart(4, "0")} · y ${String(
              Math.round(pt.y)
            ).padStart(4, "0")}`;
          }
        }

        if (cross) {
          const cf = Math.min(1, Math.max(0, (p - 0.56) / 0.28));
          gsap.set(cross, { drawSVG: `0% ${(cf * 100).toFixed(1)}%`, opacity: cf * 0.45 });
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=1850",
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => syncThread(self.progress),
        },
      });

      triggerRef.current = tl.scrollTrigger ?? null;

      tl.to({}, { duration: 0.12 })
        .to(rig, {
          x: () => computeWaypoints()[1].x,
          y: () => computeWaypoints()[1].y,
          scale: () => computeWaypoints()[1].scale,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(rig, {
          x: () => computeWaypoints()[2].x,
          y: () => computeWaypoints()[2].y,
          scale: () => computeWaypoints()[2].scale,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(rig, {
          x: () => computeWaypoints()[3].x,
          y: () => computeWaypoints()[3].y,
          scale: () => computeWaypoints()[3].scale,
          duration: 1,
          ease: "power2.inOut",
        })
        .to({}, { duration: 0.16 });

      syncThread(0);
    }, el);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [copy.autoIndex, copy.sentences.length, saveClip]);

  const jumpStation = (idx: number) => {
    const st = triggerRef.current;
    if (!st) {
      setActiveStation(idx);
      return;
    }
    const stops = [0.02, 0.36, 0.68, 0.96];
    scrollToY(st.start + stops[idx] * (st.end - st.start));
  };

  const handleSelectClip = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (text.length < 12) return;
    selectedRef.current = true;
    window.setTimeout(() => (selectedRef.current = false), 80);
    const matchedIdx: 0 | 1 = copy.sentences[0] && text.includes(copy.sentences[0].slice(0, 18)) ? 0 : 1;
    saveClip(text, matchedIdx);
    sel.removeAllRanges();
  };

  const clipSentence = (i: number) => {
    if (selectedRef.current) return;
    const s = sentenceRefs.current[i];
    if (s?.textContent) saveClip(s.textContent, i === 0 ? 0 : 1);
  };

  const activeClipIdx: 0 | 1 = clip ? clip.sentenceIdx : 1;
  const activeSummary = copy.triage.summaries[activeClipIdx];
  const activeTags = copy.triage.tagSets[activeClipIdx];

  return (
    <section
      id="v2-clipper"
      ref={sectionRef}
      data-v2-surface="paper"
      className="v2-board v2-paper"
      aria-label={copy.title}
    >
      {/* Top minimal editorial chrome */}
      <header className="v2-board-head">
        <div>
          <h2 className="v2-board-title">{copy.title}</h2>
          <p className="v2-board-hint">{copy.hint}</p>
        </div>

        <div className="v2-board-controls">
          <div className="v2-board-stops" role="tablist" aria-label="Research thread stations">
            {copy.stations.map((st, idx) => (
              <button
                key={st.step}
                type="button"
                role="tab"
                aria-selected={activeStation === idx}
                className={`v2-board-stop ${activeStation === idx ? "is-active" : ""}`}
                onClick={() => jumpStation(idx)}
              >
                <span>{st.step}</span>
              </button>
            ))}
          </div>
          <span ref={coordRef} className="v2-board-coord" aria-hidden="true">
            x 0420 · y 0420
          </span>
        </div>
      </header>

      {/* Desktop: 2D Spatial Camera-Pan Editorial Sheet */}
      <div ref={viewportRef} className="v2-board-viewport">
        <div ref={rigRef} className="v2-board-rig">
          <div className="v2-board-dots" aria-hidden="true" />

          {/* Sweeping Single-Accent Cubic Bézier Thread */}
          <svg
            className="v2-board-svg"
            viewBox="0 0 3900 1560"
            width="3900"
            height="1560"
            aria-hidden="true"
          >
            <path d={THREAD_PATH} className="v2-thread-ghost" />
            <path ref={crossRef} d={CROSS_REF_PATH} className="v2-thread-cross" />
            <path ref={threadRef} d={THREAD_PATH} className="v2-thread-live" />

            {PINS.map((pin, idx) => (
              <g
                key={idx}
                transform={`translate(${pin.x}, ${pin.y})`}
                className={`v2-pin-node ${activeStation === idx ? "is-active" : activeStation > idx ? "is-done" : ""}`}
              >
                <circle r="16" className="v2-pin-ring" />
                <line x1="-22" y1="0" x2="-10" y2="0" className="v2-pin-tick" />
                <line x1="10" y1="0" x2="22" y2="0" className="v2-pin-tick" />
                <line x1="0" y1="-22" x2="0" y2="-10" className="v2-pin-tick" />
                <line x1="0" y1="10" x2="0" y2="22" className="v2-pin-tick" />
                <circle r="4" className="v2-pin-core" />
              </g>
            ))}

            <circle ref={haloRef} cx={PINS[0].x} cy={PINS[0].y} r="13" className="v2-thread-halo" />
            <circle ref={beadRef} cx={PINS[0].x} cy={PINS[0].y} r="4.5" className="v2-thread-bead" />
          </svg>

          {/* STATION 01: Highlight / Clip from page */}
          <article
            className={`v2-station ${activeStation === 0 ? "is-active" : ""}`}
            style={{ left: PINS[0].x + 34, top: PINS[0].y + 18, width: 610 }}
          >
            <span className="v2-station-meta">
              <b>{copy.stations[0].step}</b> {copy.stations[0].label}
            </span>
            <p className="v2-station-quote" onMouseUp={handleSelectClip} onTouchEnd={handleSelectClip}>
              {copy.sentences.map((s, i) => (
                <span
                  key={i}
                  ref={(node) => {
                    sentenceRefs.current[i] = node;
                  }}
                  role="button"
                  tabIndex={0}
                  className={`v2-clip-s ${i < litCount ? "is-lit" : ""}`}
                  onClick={() => clipSentence(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      clipSentence(i);
                    }
                  }}
                >
                  {s}{" "}
                </span>
              ))}
            </p>
            <span className="v2-station-foot">{copy.sourceUrl}</span>
          </article>

          {/* STATION 02: Instant On-Device Nano Auto-Tag & Summary (~38ms) */}
          <article
            className={`v2-station ${activeStation === 1 ? "is-active" : ""}`}
            style={{ left: PINS[1].x + 34, top: PINS[1].y + 18, width: 590 }}
          >
            <span className="v2-station-meta">
              <b>{copy.stations[1].step}</b> {copy.stations[1].label}
            </span>
            <h3 className="v2-station-heading">{copy.triage.heading}</h3>
            <p className="v2-station-summary">{activeSummary}</p>
            <div className="v2-station-tags">
              {activeTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <span className="v2-station-foot">{copy.triage.runtime}</span>
          </article>

          {/* STATION 03: Local semantic links in browser memory */}
          <article
            className={`v2-station ${activeStation === 2 ? "is-active" : ""}`}
            style={{ left: PINS[2].x + 34, top: PINS[2].y + 18, width: 580 }}
          >
            <span className="v2-station-meta">
              <b>{copy.stations[2].step}</b> {copy.stations[2].label}
            </span>
            <h3 className="v2-station-heading">{copy.connect.anchor}</h3>
            <ul className="v2-station-links">
              {copy.connect.links.map((lnk) => (
                <li key={lnk.title}>
                  <span>{lnk.title}</span>
                  <em>{lnk.score}</em>
                </li>
              ))}
            </ul>
            <span className="v2-station-foot">{copy.connect.runtime}</span>
          </article>

          {/* STATION 04: Spaced recall before it fades */}
          <article
            className={`v2-station ${activeStation === 3 ? "is-active" : ""}`}
            style={{ left: PINS[3].x + 34, top: PINS[3].y + 18, width: 560 }}
          >
            <span className="v2-station-meta">
              <b>{copy.stations[3].step}</b> {copy.stations[3].label}
            </span>
            <h3 className="v2-station-heading">{copy.recall.question}</h3>
            <div className="v2-station-recall-actions">
              <button
                type="button"
                className="v2-tlink is-active"
                onClick={() => setAnswerOpen((v) => !v)}
              >
                {answerOpen ? copy.recall.hideLabel : copy.recall.revealLabel}
              </button>
              <Link href="/capture" className="group v2-sx-open">
                <RollingText text={copy.recall.openCapture} />
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>
            {answerOpen && <p className="v2-station-answer">{copy.recall.answer}</p>}
            <span className="v2-station-foot">{copy.recall.cadence}</span>
          </article>
        </div>
      </div>

      {/* Mobile / Reduced-motion clean vertical thread stack */}
      <div className="v2-board-mobile">
        <div className="v2-m-thread-item">
          <span className="v2-m-pin" aria-hidden="true" />
          <span className="v2-station-meta">
            <b>{copy.stations[0].step}</b> {copy.stations[0].label}
          </span>
          <p className="v2-station-quote" onMouseUp={handleSelectClip} onTouchEnd={handleSelectClip}>
            {copy.sentences.map((s, i) => (
              <span
                key={i}
                role="button"
                tabIndex={0}
                className="v2-clip-s is-lit"
                onClick={() => saveClip(s, i === 0 ? 0 : 1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    saveClip(s, i === 0 ? 0 : 1);
                  }
                }}
              >
                {s}{" "}
              </span>
            ))}
          </p>
        </div>

        <div className="v2-m-thread-item">
          <span className="v2-m-pin" aria-hidden="true" />
          <span className="v2-station-meta">
            <b>{copy.stations[1].step}</b> {copy.stations[1].label}
          </span>
          <h3 className="v2-station-heading">{copy.triage.heading}</h3>
          <p className="v2-station-summary">{activeSummary}</p>
          <div className="v2-station-tags">
            {activeTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className="v2-station-foot">{copy.triage.runtime}</span>
        </div>

        <div className="v2-m-thread-item">
          <span className="v2-m-pin" aria-hidden="true" />
          <span className="v2-station-meta">
            <b>{copy.stations[2].step}</b> {copy.stations[2].label}
          </span>
          <h3 className="v2-station-heading">{copy.connect.anchor}</h3>
          <ul className="v2-station-links">
            {copy.connect.links.map((lnk) => (
              <li key={lnk.title}>
                <span>{lnk.title}</span>
                <em>{lnk.score}</em>
              </li>
            ))}
          </ul>
        </div>

        <div className="v2-m-thread-item">
          <span className="v2-m-pin" aria-hidden="true" />
          <span className="v2-station-meta">
            <b>{copy.stations[3].step}</b> {copy.stations[3].label}
          </span>
          <h3 className="v2-station-heading">{copy.recall.question}</h3>
          <p className="v2-station-answer">{copy.recall.answer}</p>
          <span className="v2-station-foot">{copy.recall.cadence}</span>
        </div>
      </div>

      {/* Persistent bottom vault receipt + Chrome extension download */}
      <div className="v2-clip-foot">
        <div className="v2-vault" aria-live="polite">
          {clip ? (
            <p key={clip.n} className="v2-vault-line">
              <span className="v2-vault-label">
                {String(clip.n).padStart(2, "0")} · {copy.vaultSaved}
              </span>
              <span className="v2-vault-quote">“{trunc(clip.text)}”</span>
              <span className="v2-vault-meta">
                {copy.source} · {clip.time} · {copy.tags.map((t) => `#${t}`).join(" ")}
              </span>
            </p>
          ) : (
            <p className="v2-vault-empty">{copy.vaultEmpty}</p>
          )}
        </div>
        <a href="/braindrop-extension.zip" download className="group v2-ulink">
          <RollingText text={copy.download} />
        </a>
      </div>
    </section>
  );
}
