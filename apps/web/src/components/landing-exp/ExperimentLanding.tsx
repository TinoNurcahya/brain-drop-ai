"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUp, Maximize2, Minus, Plus, X } from "lucide-react";
import { sanitize } from "@braindrop/core";
import { useLocale } from "@/components/layout/LocaleProvider";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { scrollToTarget, scrollToY } from "@/lib/smooth-scroll";
import { WALTON_COPY } from "@/lib/landing-walton-copy";
import type { VaultRoomItem } from "@/lib/landing-walton-copy";
import { CarveText } from "./CarveText";
import { ConjoinedLink } from "./ConjoinedControl";
import {
  CardSchematicDiagram,
  PortalSchematicDiagram,
  SplitPortraitDiagram,
} from "./WaltonDiagrams";
import { WaltonHud } from "./WaltonHud";
import { VaultLivePreview } from "./VaultLivePreview";
import "@/styles/exp/landing-exp.css";

gsap.registerPlugin(ScrollTrigger);

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function invLerp(a: number, b: number, v: number): number {
  return clamp01((v - a) / (b - a));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function renderSanitized(text: string) {
  const parts = text.split(/(\[REDACTED_[A-Z_]+\])/g).filter(Boolean);
  if (parts.length === 0) return <span>…</span>;
  return parts.map((part, idx) =>
    part.startsWith("[REDACTED_") ? (
      <mark key={idx} className="wf-redacted-mark">
        {part}
      </mark>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

const CHAPTER_IDS = [
  "ch-hero",
  "ch-portal",
  "ch-split",
  "ch-proof",
  "ch-vault",
  "ch-hybrid",
  "ch-manifesto",
  "ch-faq",
] as const;

// Clockwise elliptical ring around Chapter [02] (ordered 12 o'clock -> clockwise!)
const CLOCKWISE_ORBIT = [
  { kind: "photo", src: "/images/preview-notes.jpg", w: 124, h: 90, left: "48%", top: "14%" },
  { kind: "chip", color: "#e7e72b", w: 36, h: 24, left: "64%", top: "18%" },
  { kind: "photo", src: "/images/preview-capture.jpg", w: 112, h: 128, left: "76%", top: "33%" },
  { kind: "chip", color: "#9b8b73", w: 34, h: 24, left: "79%", top: "55%" },
  { kind: "photo", src: "/images/preview-flashcards.jpg", w: 132, h: 94, left: "69%", top: "76%" },
  { kind: "chip", color: "#12110e", w: 30, h: 38, left: "51%", top: "84%" },
  { kind: "photo", src: "/images/preview-dashboard.jpg", w: 126, h: 90, left: "30%", top: "75%" },
  { kind: "chip", color: "#56544d", w: 38, h: 26, left: "21%", top: "53%" },
  { kind: "photo", src: "/images/hybrid-overview.jpg", w: 122, h: 88, left: "26%", top: "28%" },
] as const;

export function ExperimentLanding() {
  useSmoothScroll();
  const { locale, toggleLocale } = useLocale();
  const c = WALTON_COPY[locale];

  const rootRef = useRef<HTMLDivElement>(null);
  const orbitalSecRef = useRef<HTMLDivElement>(null);
  const cinePortalRef = useRef<HTMLDivElement>(null);
  const splitSecRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // HUD & Hero state
  const [heroReady, setHeroReady] = useState(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isDarkSurface, setIsDarkSurface] = useState(false);
  const [showBottomHud, setShowBottomHud] = useState(false);

  // Chapter [05] Interactive Five-Room Vault state
  const [selectedRoomId, setSelectedRoomId] = useState<VaultRoomItem["id"]>("capture");
  const [vaultMode, setVaultMode] = useState<"live" | "study">("live");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Chapter [06] Obsidian Hybrid Stage + Live Redaction state
  const [activePillarIdx, setActivePillarIdx] = useState(0);
  const [presetIdx, setPresetIdx] = useState(0);
  const [draftByLocale, setDraftByLocale] = useState<Record<string, string>>({});
  const pillarRefs = useRef<(HTMLElement | null)[]>([]);

  // Chapter [08] FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeRoomIdx = useMemo(() => {
    const idx = c.vault.rooms.findIndex((r) => r.id === selectedRoomId);
    return idx >= 0 ? idx : 0;
  }, [c.vault.rooms, selectedRoomId]);
  const activeRoom = c.vault.rooms[activeRoomIdx] ?? c.vault.rooms[0];

  const presetKey = `${locale}-${presetIdx}`;
  const activePreset = c.hybrid.presets[presetIdx] ?? c.hybrid.presets[0];
  const currentDraft = draftByLocale[presetKey] ?? activePreset.text;
  const liveRedaction = useMemo(() => sanitize(currentDraft), [currentDraft]);

  useEffect(() => {
    const t = window.setTimeout(() => setHeroReady(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowRight") {
        const next = (activeRoomIdx + 1) % c.vault.rooms.length;
        setSelectedRoomId(c.vault.rooms[next].id);
      } else if (e.key === "ArrowLeft") {
        const prev = (activeRoomIdx - 1 + c.vault.rooms.length) % c.vault.rooms.length;
        setSelectedRoomId(c.vault.rooms[prev].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, activeRoomIdx, c.vault.rooms]);

  // Scrollspy: active chapter (01..08), dark surface HUD inversion, bottom HUD visibility
  useEffect(() => {
    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const vh = window.innerHeight;
      const probeY = vh * 0.42;

      let currentIdx = 0;
      CHAPTER_IDS.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probeY) {
          currentIdx = idx;
        }
      });
      setActiveChapterIdx((prev) => (prev === currentIdx ? prev : currentIdx));

      // Invert HUD when Slide 1 expands fullscreen inside cinePortal, over ch-hybrid, or over Footer
      let overDark = false;
      const cineEl = cinePortalRef.current;
      const hybridSec = document.getElementById("ch-hybrid");
      const mainCurtain = curtainRef.current;

      if (cineEl) {
        const cr = cineEl.getBoundingClientRect();
        const scrollable = Math.max(1, cr.height - vh);
        const cineProg = -cr.top / scrollable;
        // Once Slide 1 clip-path expands past ~80% (progress >= 0.20) through end of Slide 3
        if (cineProg >= 0.2 && cr.bottom >= 64) {
          overDark = true;
        }
      }

      if (hybridSec) {
        const hr = hybridSec.getBoundingClientRect();
        if (hr.top <= 72 && hr.bottom >= 48) {
          overDark = true;
        }
      }

      if (mainCurtain && mainCurtain.getBoundingClientRect().bottom <= 72) {
        overDark = true;
      }

      setIsDarkSurface((prev) => (prev === overDark ? prev : overDark));

      const heroEl = document.getElementById("ch-hero");
      const pastHero = heroEl ? heroEl.getBoundingClientRect().bottom < vh * 0.45 : false;
      const footerExposed = mainCurtain
        ? mainCurtain.getBoundingClientRect().bottom < vh - 80
        : false;
      const shouldShow = pastHero && !footerExposed;
      setShowBottomHud((prev) => (prev === shouldShow ? prev : shouldShow));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(evaluate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    evaluate();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Observe Obsidian Hybrid filmstrip frames to highlight corresponding pillar
  useEffect(() => {
    const els = pillarRefs.current.filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-film-idx"));
            if (!Number.isNaN(idx)) {
              setActivePillarIdx(Math.min(2, idx));
            }
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [locale]);

  // =========================================================================
  // DETERMINISTIC WALTON SCROLL CHOREOGRAPHY (Pure CSS Custom Properties!)
  // Immune to browser shorthand serialization & mid-scroll locale toggles.
  // =========================================================================
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // 1. Z-Depth Hero + Bridge + Manifesto floating parallax layers
      root.querySelectorAll<HTMLElement>("[data-speed-y]").forEach((el) => {
        const speed = Number(el.dataset.speedY || -40);
        gsap.fromTo(
          el,
          { y: -speed * 0.35 },
          {
            y: speed,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section, .wf-portal-bridge") || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // 2. Botanical / Synaptic Plumb-Line Stem SVG draw
      root.querySelectorAll<SVGLineElement>(".wf-stem-line").forEach((line) => {
        const len = 160;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 82%",
            end: "bottom 48%",
            scrub: true,
          },
        });
      });

      // 3A. Chapter [02] Section A: Clockwise Orbital Ring Pop-In -> Gentle Fade Out
      const orbitalSec = orbitalSecRef.current;
      if (orbitalSec) {
        const items = Array.from(orbitalSec.querySelectorAll<HTMLElement>(".wf-orbit-item"));
        const inner = orbitalSec.querySelector<HTMLElement>(".wf-orbital-stage");

        const applyOrbital = (p: number) => {
          const fadeOut = 1 - easeInOutCubic(invLerp(0.74, 0.98, p));
          if (inner) {
            inner.style.opacity = fadeOut.toFixed(3);
          }
          items.forEach((item, idx) => {
            const start = 0.04 + (idx / items.length) * 0.46;
            const localP = easeOutCubic(invLerp(start, start + 0.14, p));
            item.style.opacity = localP.toFixed(3);
            const scale = 0.72 + 0.28 * localP;
            item.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
          });
        };

        applyOrbital(0);
        ScrollTrigger.create({
          trigger: orbitalSec,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => applyOrbital(self.progress),
        });
      }

      // 3B. Chapter [02] Section B: Authentic Walton Single-Sticky Fullscreen Portal
      // - EVERY slide expands symmetrically from the center via clip-path: inset(var(--cy) var(--cx) var(--cy) var(--cx))!
      // - Zero horizontal/vertical wipe cuts ("bukan malah di timpa di belakang").
      // - Outgoing diagram & text fade out BEFORE incoming slide expands; incoming diagram & text
      //   appear ONLY after 100% fullscreen!
      const cineEl = cinePortalRef.current;
      if (cineEl) {
        const s1 = cineEl.querySelector<HTMLElement>(".wf-cine-slide.is-s1");
        const s2 = cineEl.querySelector<HTMLElement>(".wf-cine-slide.is-s2");
        const s3 = cineEl.querySelector<HTMLElement>(".wf-cine-slide.is-s3");

        const applyCine = (p: number) => {
          const isMobile = window.innerWidth < 768;
          const startCy = isMobile ? 25.0 : 31.3;
          const startCx = isMobile ? 16.5 : 40.5;

          // -----------------------------------------------------------------
          // SLIDE 1: Expand from Center Portrait Frame -> Fullscreen Hold
          // -----------------------------------------------------------------
          // 0.00 -> 0.20: Expand from center card to fullscreen
          const s1ExpandP = easeInOutCubic(invLerp(0.0, 0.2, p));
          const s1Cy = startCy * (1 - s1ExpandP);
          const s1Cx = startCx * (1 - s1ExpandP);

          // 0.20 -> 0.32: UI & SVG draw enter after 100% fullscreen
          const s1UiIn = easeOutCubic(invLerp(0.2, 0.31, p));
          // 0.38 -> 0.44: UI gracefully fades out before Slide 2 expands
          const s1UiOut = 1 - easeInOutCubic(invLerp(0.38, 0.44, p));
          const s1UiAlpha = Math.min(s1UiIn, s1UiOut);

          // 0.44 -> 0.62: Slide 1 recedes slightly (1.0 -> 0.95) as Slide 2 expands over it
          const s1Scale = 1 - 0.05 * easeInOutCubic(invLerp(0.44, 0.62, p));

          if (s1) {
            s1.style.setProperty("--cy", `${s1Cy.toFixed(3)}%`);
            s1.style.setProperty("--cx", `${s1Cx.toFixed(3)}%`);
            s1.style.setProperty("--ui-alpha", s1UiAlpha.toFixed(3));
            s1.style.setProperty("--ui-y", `${((1 - s1UiIn) * 26).toFixed(1)}px`);
            s1.style.setProperty("--draw", s1UiIn.toFixed(3));
            s1.style.setProperty("--scale", s1Scale.toFixed(3));
          }

          // -----------------------------------------------------------------
          // SLIDE 2: Symmetric Clip-Path Expand from Center -> Fullscreen
          // -----------------------------------------------------------------
          const s2Active = p >= 0.42;
          const s2ExpandP = easeInOutCubic(invLerp(0.44, 0.62, p));
          const s2Cy = startCy * (1 - s2ExpandP);
          const s2Cx = startCx * (1 - s2ExpandP);

          // 0.62 -> 0.72: Slide 2 UI & SVG draw enter after 100% fullscreen
          const s2UiIn = easeOutCubic(invLerp(0.62, 0.71, p));
          // 0.76 -> 0.82: Slide 2 UI gracefully fades out before Slide 3 expands
          const s2UiOut = 1 - easeInOutCubic(invLerp(0.76, 0.82, p));
          const s2UiAlpha = Math.min(s2UiIn, s2UiOut);

          // 0.82 -> 0.94: Slide 2 recedes slightly (1.0 -> 0.95) as Slide 3 expands over it
          const s2Scale = 1 - 0.05 * easeInOutCubic(invLerp(0.82, 0.94, p));

          if (s2) {
            s2.style.opacity = s2Active ? "1" : "0";
            s2.style.setProperty("--cy", `${s2Cy.toFixed(3)}%`);
            s2.style.setProperty("--cx", `${s2Cx.toFixed(3)}%`);
            s2.style.setProperty("--ui-alpha", s2UiAlpha.toFixed(3));
            s2.style.setProperty("--ui-y", `${((1 - s2UiIn) * 26).toFixed(1)}px`);
            s2.style.setProperty("--draw", s2UiIn.toFixed(3));
            s2.style.setProperty("--scale", s2Scale.toFixed(3));
          }

          // -----------------------------------------------------------------
          // SLIDE 3: Symmetric Clip-Path Expand from Center -> Fullscreen
          // -----------------------------------------------------------------
          const s3Active = p >= 0.8;
          const s3ExpandP = easeInOutCubic(invLerp(0.82, 0.94, p));
          const s3Cy = startCy * (1 - s3ExpandP);
          const s3Cx = startCx * (1 - s3ExpandP);

          // 0.94 -> 1.00: Slide 3 UI & SVG draw enter after 100% fullscreen
          const s3UiIn = easeOutCubic(invLerp(0.94, 0.99, p));

          if (s3) {
            s3.style.opacity = s3Active ? "1" : "0";
            s3.style.setProperty("--cy", `${s3Cy.toFixed(3)}%`);
            s3.style.setProperty("--cx", `${s3Cx.toFixed(3)}%`);
            s3.style.setProperty("--ui-alpha", s3UiIn.toFixed(3));
            s3.style.setProperty("--ui-y", `${((1 - s3UiIn) * 26).toFixed(1)}px`);
            s3.style.setProperty("--draw", s3UiIn.toFixed(3));
          }
        };

        applyCine(0);
        ScrollTrigger.create({
          trigger: cineEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => applyCine(self.progress),
        });
      }

      // 4. Chapter [03] Pinned 3-Column Center Portrait Stationary Split-Wipe
      const splitEl = splitSecRef.current;
      if (splitEl) {
        const layer1 = splitEl.querySelector<HTMLElement>(".wf-split-layer.is-a");
        const layer2 = splitEl.querySelector<HTMLElement>(".wf-split-layer.is-b");
        const colLeft = splitEl.querySelector<HTMLElement>(".wf-split-col.is-left");
        const colRight = splitEl.querySelector<HTMLElement>(".wf-split-col.is-right");

        const applySplit = (p: number) => {
          const draw1 = easeOutCubic(invLerp(0.0, 0.22, p));
          const wipeP = easeInOutCubic(invLerp(0.24, 0.76, p));
          const draw2 = easeOutCubic(invLerp(0.38, 0.82, p));

          const leftFade = 1 - 0.72 * easeInOutCubic(invLerp(0.45, 0.66, p));
          const rightIn = easeOutCubic(invLerp(0.48, 0.74, p));

          if (layer1) {
            layer1.style.setProperty("--draw", Math.max(0.25, draw1).toFixed(3));
          }
          if (layer2) {
            layer2.style.setProperty("--split-wipe", `${((1 - wipeP) * 100).toFixed(3)}%`);
            layer2.style.setProperty("--draw", draw2.toFixed(3));
          }
          if (colLeft) {
            colLeft.style.opacity = leftFade.toFixed(3);
          }
          if (colRight) {
            colRight.style.opacity = rightIn.toFixed(3);
            colRight.style.transform = `translateY(${((1 - rightIn) * 20).toFixed(1)}px)`;
          }
        };

        applySplit(0);
        ScrollTrigger.create({
          trigger: splitEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => applySplit(self.progress),
        });
      }

      // 5. Chapter [04] Staggered 1:1 Square Data Cards — Live SVG Stroke-Draw on Scroll
      root.querySelectorAll<HTMLElement>(".wf-square-card").forEach((card) => {
        card.style.setProperty("--draw", "0");
        ScrollTrigger.create({
          trigger: card,
          start: "top 82%",
          end: "top 32%",
          scrub: 0.4,
          onUpdate: (self) => {
            card.style.setProperty("--draw", easeOutCubic(self.progress).toFixed(3));
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [locale]);

  const jumpToChapter = (chapterId: string) => {
    scrollToTarget(`#${chapterId}`);
  };

  return (
    <div ref={rootRef} className="wf-page -mt-20 sm:-mt-24">
      <a className="wf-skip" href="#wf-content">
        {c.hud.skip}
      </a>

      {/* Tactile Paper / Film Grain Overlay */}
      <div className="wf-grain-overlay" aria-hidden="true" />

      {/* Walton Signature HUD (01 / 08) */}
      <WaltonHud
        copy={c.hud}
        locale={locale}
        onToggleLocale={toggleLocale}
        activeChapterIdx={activeChapterIdx}
        isDarkSurface={isDarkSurface}
        showBottomHud={showBottomHud}
        onSelectChapter={jumpToChapter}
      />

      {/* =====================================================================
          MAIN PARCHMENT CURTAIN (--z-main: 20) — Lifts at end to unveil Footer
          ===================================================================== */}
      <div id="wf-content" ref={curtainRef} className="wf-main-curtain">
        {/* CHAPTER 01 — MULTI-PLANE Z-DEPTH TYPOGRAPHY SANDWICH HERO */}
        <section id="ch-hero" className="wf-hero" aria-labelledby="wf-hero-h1">
          <div className="wf-hero-stage">
            <div className="wf-hero-plane is-back" aria-hidden="true">
              <figure className="wf-float-frame hb-1" data-speed-y="-55">
                <img src="/images/preview-notes.jpg" alt="" width={360} height={260} decoding="async" />
              </figure>
              <figure className="wf-float-frame hb-2" data-speed-y="-38">
                <img src="/images/hybrid-overview.jpg" alt="" width={320} height={220} decoding="async" />
              </figure>
              <figure className="wf-float-frame hb-3" data-speed-y="-65">
                <img src="/images/preview-dashboard.jpg" alt="" width={280} height={200} decoding="async" />
              </figure>
              <span className="wf-swatch-chip hc-1" data-speed-y="-30" />
              <span className="wf-swatch-chip hc-2" data-speed-y="-48" />
            </div>

            <h1 id="wf-hero-h1" className="wf-hero-h1">
              {c.hero.lines.map((line, i) => (
                <span key={`${line}-${i}`} className="wf-hero-line">
                  <CarveText
                    text={line}
                    active={heroReady}
                    delayMs={50 + i * 95}
                    stepMs={26}
                    durationMs={820}
                    slidePx={-80}
                  />
                  {i < c.hero.lines.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>

            <div className="wf-hero-plane is-front" aria-hidden="true">
              <figure className="wf-float-frame hf-1" data-speed-y="-115">
                <img
                  src="/images/preview-capture.jpg"
                  alt=""
                  width={480}
                  height={340}
                  fetchPriority="high"
                  decoding="async"
                />
              </figure>
              <figure className="wf-float-frame hf-2" data-speed-y="-90">
                <img src="/images/preview-graph.jpg" alt="" width={340} height={240} decoding="async" />
              </figure>
              <figure className="wf-float-frame hf-3" data-speed-y="-130">
                <img src="/images/preview-flashcards.jpg" alt="" width={310} height={225} decoding="async" />
              </figure>
            </div>
          </div>

          <div className="wf-container wf-hero-foot">
            <p className="wf-serif-lead">{c.hero.lead}</p>
            <div className="wf-hero-cta-wrap">
              <ConjoinedLink href="/notes" label={c.hero.cta} variant="ink" />
            </div>
            <span className="wf-scroll-caption">{c.hero.scrollNote}</span>

            <div className="wf-stem-wrap" aria-hidden="true">
              <svg width="16" height="176" viewBox="0 0 16 176" fill="none">
                <path d="M 4 2 L 12 2 L 8 8 Z" fill="currentColor" />
                <line
                  x1="8"
                  y1="10"
                  x2="8"
                  y2="168"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  className="wf-stem-line"
                />
                <circle cx="8" cy="170" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </section>

        {/* EDITORIAL THESIS BRIDGE [ 01 ] */}
        <section className="wf-thesis-sec" aria-label="Editorial thesis">
          <div className="wf-container wf-thesis-inner">
            <span className="wf-coord">{c.thesis.index}</span>
            <h2 className="wf-serif-h2 wf-thesis-h2">
              {c.thesis.leadA}
              <em>{c.thesis.leadItalic}</em>
              {c.thesis.leadB}
            </h2>
            <p className="wf-body-max">{c.thesis.sub}</p>
          </div>
        </section>

        {/* =================================================================
            CHAPTER 02 — SEPARATED CLOCKWISE ORBITAL RING + BRIDGE +
            SINGLE-STAGE SYMMETRIC CENTER CLIP-PATH PORTAL & STATIONARY WIPES
            ================================================================= */}
        <section id="ch-portal" className="wf-portal-chapter" aria-label="Browser memory portal">
          {/* Section A: Pinned Clockwise Orbital Ring -> Gentle Fade-Out */}
          <div ref={orbitalSecRef} className="wf-orbital-sec">
            <div className="wf-orbital-sticky">
              <div className="wf-orbital-stage">
                <div className="wf-orbit-ring" aria-hidden="true">
                  {CLOCKWISE_ORBIT.map((item, idx) => (
                    <div
                      key={idx}
                      className={`wf-orbit-item is-${item.kind}`}
                      style={{
                        left: item.left,
                        top: item.top,
                        width: `${item.w}px`,
                        height: `${item.h}px`,
                        backgroundColor: item.kind === "chip" ? item.color : undefined,
                      }}
                    >
                      {item.kind === "photo" && (
                        <img
                          src={item.src}
                          alt=""
                          width={item.w * 2}
                          height={item.h * 2}
                          decoding="async"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="wf-orbital-question">
                  <span className="wf-coord">{c.portal.index}</span>
                  <h2 className="wf-serif-h2">
                    {c.portal.questionPre}
                    <em>{c.portal.questionItalic}</em>
                    {c.portal.questionPost}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Bridge Paragraph + Floating Scatter Chips */}
          <div className="wf-portal-bridge">
            <span className="wf-bridge-chip is-left" data-speed-y="-36" aria-hidden="true" />
            <div className="wf-container wf-portal-bridge-inner">
              <p className="wf-serif-bridge">
                {c.portal.bridgeLead}
                <span className="wf-bridge-pill">{c.portal.bridgeHighlight}</span>
                {c.portal.bridgeTail}
              </p>
            </div>
            <span className="wf-bridge-chip is-right" data-speed-y="-52" aria-hidden="true" />
          </div>

          {/* Section B: ONE Single Sticky 100svh Stage Containing All 3 Stationary Slides */}
          <div ref={cinePortalRef} className="wf-cine-portal">
            <div className="wf-cine-sticky">
              {c.portal.curtains.map((slide, idx) => {
                const roleClass = idx === 0 ? "is-s1" : idx === 1 ? "is-s2" : "is-s3";
                return (
                  <article key={slide.id} className={`wf-cine-slide ${roleClass}`}>
                    {/* 100% Opaque Full-Bleed Photo (zero scale distortion, sharp 0px corners) */}
                    <img
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      className="wf-cine-photo"
                      width={1600}
                      height={1000}
                      decoding="async"
                    />
                    <div className="wf-cine-scrim" aria-hidden="true" />

                    {/* Center 1px White Schematic Vector + Electric Acid-Lime Node */}
                    <div className="wf-cine-diagram-wrap">
                      <PortalSchematicDiagram kind={slide.id} badge={slide.badge} />
                    </div>

                    {/* Bottom-Left Walton Stat Lockup */}
                    <div className="wf-container wf-cine-foot">
                      <div className="wf-cine-copy">
                        <h3 className="wf-stat-display is-lime">
                          {slide.statPre} <i>{slide.statItalic}</i> {slide.statPost}
                        </h3>
                        <p className="wf-curtain-body">{slide.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHISPER BREATHING INTERLUDE */}
        <div className="wf-whisper" aria-hidden="true">
          <div className="wf-container wf-whisper-inner">
            <p className="wf-serif-whisper">{c.whisper.line}</p>
            <svg width="16" height="110" viewBox="0 0 16 110" fill="none">
              <line
                x1="8"
                y1="0"
                x2="8"
                y2="102"
                stroke="currentColor"
                strokeWidth="1.1"
                className="wf-stem-line"
              />
              <circle cx="8" cy="105" r="2.8" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* =================================================================
            CHAPTER 03 — PINNED 3-COLUMN CENTER PORTRAIT STATIONARY SPLIT-WIPE
            ================================================================= */}
        <section
          id="ch-split"
          ref={splitSecRef}
          className="wf-split-sec"
          aria-labelledby="wf-split-h2"
        >
          <div className="wf-split-sticky">
            <div className="wf-container wf-split-inner">
              <div className="wf-split-head">
                <span className="wf-coord">{c.splitPortrait.index}</span>
                <h2 id="wf-split-h2" className="wf-serif-h2">
                  {c.splitPortrait.headingPre}
                  <em>{c.splitPortrait.headingItalic}</em>{" "}
                  {c.splitPortrait.headingPost}
                </h2>
              </div>

              <div className="wf-split-grid">
                {/* Column 1 (Left): Stat A */}
                <div className="wf-split-col is-left">
                  <h3 className="wf-split-stat">
                    {c.splitPortrait.left.statPre}{" "}
                    <i>{c.splitPortrait.left.statItalic}</i>{" "}
                    {c.splitPortrait.left.statPost}
                  </h3>
                  <p className="wf-split-body">{c.splitPortrait.left.body}</p>
                </div>

                {/* Column 2 (Center): 392x556px Portrait Frame with Stationary clip-path Split-Wipe */}
                <div className="wf-split-frame">
                  <div className="wf-split-layer is-a">
                    <img
                      src={c.splitPortrait.firstImg}
                      alt={c.splitPortrait.firstAlt}
                      width={784}
                      height={1112}
                      decoding="async"
                    />
                    <div className="wf-split-scrim" aria-hidden="true" />
                    <SplitPortraitDiagram variant="single" />
                  </div>

                  <div className="wf-split-layer is-b">
                    <img
                      src={c.splitPortrait.secondImg}
                      alt={c.splitPortrait.secondAlt}
                      width={784}
                      height={1112}
                      decoding="async"
                    />
                    <div className="wf-split-scrim" aria-hidden="true" />
                    <SplitPortraitDiagram variant="double" />
                  </div>
                </div>

                {/* Column 3 (Right): Stat B (fades in as split-wipe crosses 50%) */}
                <div className="wf-split-col is-right">
                  <h3 className="wf-split-stat">
                    {c.splitPortrait.right.statPre}{" "}
                    <i>{c.splitPortrait.right.statItalic}</i>{" "}
                    {c.splitPortrait.right.statPost}
                  </h3>
                  <p className="wf-split-body">{c.splitPortrait.right.body}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 04 — STAGGERED CHESSBOARD 1:1 SQUARE DATA CARDS */}
        <section id="ch-proof" className="wf-cards-sec" aria-labelledby="wf-cards-h2">
          <div className="wf-container">
            <div className="wf-sec-header is-centered">
              <span className="wf-coord">{c.cards.index}</span>
              <h2 id="wf-cards-h2" className="wf-serif-h2">
                {c.cards.headingPre}
                <em>{c.cards.headingItalic}</em>
                {c.cards.headingPost}
              </h2>
            </div>

            <div className="wf-square-stack">
              {c.cards.items.map((card) => (
                <div key={card.id} className={`wf-square-row is-${card.align}`}>
                  <article className="wf-square-card">
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      className="wf-square-bg"
                      width={960}
                      height={960}
                      decoding="async"
                    />
                    <div className="wf-square-scrim" aria-hidden="true" />

                    <CardSchematicDiagram kind={card.id} badge={card.badge} />

                    <div className="wf-square-copy">
                      <h3 className="wf-square-stat">
                        {card.statPre} <i>{card.statItalic}</i> {card.statPost}
                      </h3>
                      <p className="wf-square-body">{card.body}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER 05 — INTERACTIVE FIVE-ROOM VAULT ATELIER */}
        <section id="ch-vault" className="wf-vault-sec" aria-labelledby="wf-vault-h2">
          <div className="wf-container">
            <div className="wf-sec-header">
              <span className="wf-coord">{c.vault.index}</span>
              <h2 id="wf-vault-h2" className="wf-serif-h2">
                {c.vault.headingPre}
                <em>{c.vault.headingItalic}</em>
                {c.vault.headingPost}
              </h2>
              <p className="wf-body-max">{c.vault.sub}</p>
            </div>

            <div className="wf-room-tabs" role="tablist" aria-label="BrainDrop rooms">
              {c.vault.rooms.map((rm) => {
                const isSelected = rm.id === activeRoom.id;
                return (
                  <button
                    key={rm.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`wf-room-tab ${isSelected ? "is-active" : ""}`}
                    onClick={() => setSelectedRoomId(rm.id)}
                  >
                    <span className="wf-mono">{rm.index}</span>
                    <span>{rm.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="wf-vault-workbench">
              <div className="wf-vault-stage-col">
                <div className="wf-vault-toolbar">
                  <div className="wf-mode-pills" role="tablist" aria-label="Preview mode">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={vaultMode === "live"}
                      className={`wf-mode-pill ${vaultMode === "live" ? "is-active" : ""}`}
                      onClick={() => setVaultMode("live")}
                    >
                      {c.vault.liveMode}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={vaultMode === "study"}
                      className={`wf-mode-pill ${vaultMode === "study" ? "is-active" : ""}`}
                      onClick={() => setVaultMode("study")}
                    >
                      {c.vault.studyMode}
                    </button>
                  </div>

                  {vaultMode === "study" && (
                    <button
                      type="button"
                      className="wf-expand-btn"
                      onClick={() => setLightboxOpen(true)}
                      aria-label={`${c.vault.expandLabel} ${activeRoom.title}`}
                    >
                      <Maximize2 size={13} aria-hidden="true" />
                      <span>{c.vault.expandLabel}</span>
                    </button>
                  )}
                </div>

                {vaultMode === "live" ? (
                  <VaultLivePreview roomId={activeRoom.id} locale={locale} />
                ) : (
                  <div className="wf-study-frame">
                    <button
                      type="button"
                      className="wf-study-img-btn"
                      onClick={() => setLightboxOpen(true)}
                      aria-label={`${activeRoom.studyCaption} — ${c.vault.expandLabel}`}
                    >
                      <img
                        src={activeRoom.imageSrc}
                        alt={activeRoom.imageAlt}
                        width={1200}
                        height={800}
                        decoding="async"
                      />
                    </button>
                    <div className="wf-study-cap">
                      <span className="wf-caption">{activeRoom.studyCaption}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="wf-vault-dossier">
                <div className="wf-dossier-top">
                  <span className="wf-mono">
                    {activeRoom.index} / 0{c.vault.rooms.length}
                  </span>
                  <span className="wf-lime-chip">{activeRoom.tierLabel}</span>
                </div>

                <div className="wf-dossier-main">
                  <h3 className="wf-serif-h3">{activeRoom.title}</h3>
                  <span className="wf-mono wf-muted">{activeRoom.locationLine}</span>
                  <p className="wf-dossier-body">{activeRoom.synopsis}</p>
                </div>

                <dl className="wf-dossier-specs">
                  <div>
                    <dt className="wf-caption">{activeRoom.specALabel}</dt>
                    <dd>{activeRoom.specAValue}</dd>
                  </div>
                  <div>
                    <dt className="wf-caption">{activeRoom.specBLabel}</dt>
                    <dd>{activeRoom.specBValue}</dd>
                  </div>
                </dl>

                <div className="wf-dossier-foot">
                  <ConjoinedLink
                    href={activeRoom.route}
                    label={activeRoom.cta}
                    variant="ink"
                    size="sm"
                  />

                  <div className="wf-steppers">
                    <button
                      type="button"
                      className="wf-step-btn"
                      aria-label={c.vault.prevLabel}
                      onClick={() => {
                        const prev =
                          (activeRoomIdx - 1 + c.vault.rooms.length) % c.vault.rooms.length;
                        setSelectedRoomId(c.vault.rooms[prev].id);
                      }}
                    >
                      <ArrowLeft size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="wf-step-btn"
                      aria-label={c.vault.nextLabel}
                      onClick={() => {
                        const next = (activeRoomIdx + 1) % c.vault.rooms.length;
                        setSelectedRoomId(c.vault.rooms[next].id);
                      }}
                    >
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 06 — HARD HORIZONTAL CUT TO #12110E GRAINED OBSIDIAN */}
        <section id="ch-hybrid" className="wf-obsidian-sec" aria-labelledby="wf-hybrid-h2">
          <div className="wf-container">
            <div className="wf-obsidian-split">
              <div className="wf-obsidian-sticky">
                <span className="wf-coord is-light">{c.hybrid.index}</span>
                <h2 id="wf-hybrid-h2" className="wf-serif-h2 is-light">
                  {c.hybrid.lead}
                </h2>

                <div className="wf-obsidian-pillars">
                  {c.hybrid.pillars.map((p, idx) => {
                    const isLit = activePillarIdx === idx;
                    return (
                      <div
                        key={p.title}
                        className={`wf-obsidian-pillar ${isLit ? "is-lit" : ""}`}
                      >
                        <h3>{p.title}</h3>
                        <p>{p.body}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="wf-obsidian-cta">
                  <ConjoinedLink
                    href="/notes"
                    label={c.hybrid.cta}
                    variant="lime"
                  />
                </div>
              </div>

              <div className="wf-filmstrip">
                {[
                  { src: "/images/preview-capture.jpg", ratio: "is-portrait" },
                  { src: "/images/preview-notes.jpg", ratio: "is-landscape" },
                  { src: "/images/preview-graph.jpg", ratio: "is-portrait" },
                  { src: "/images/hybrid-overview.jpg", ratio: "is-landscape" },
                ].map((frame, idx) => (
                  <figure
                    key={frame.src}
                    ref={(el) => {
                      pillarRefs.current[idx] = el;
                    }}
                    data-film-idx={idx}
                    className={`wf-film-frame ${frame.ratio}`}
                  >
                    <div className="wf-film-img-wrap">
                      <img
                        src={frame.src}
                        alt={c.hybrid.filmCaptions[idx]}
                        width={900}
                        height={900}
                        decoding="async"
                      />
                    </div>
                    <figcaption className="wf-mono is-light">
                      {c.hybrid.filmCaptions[idx]}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="wf-privacy-band">
              <div className="wf-privacy-head">
                <h3 className="wf-serif-h2 is-light">{c.hybrid.privacyHeading}</h3>
                <p className="wf-light-body">{c.hybrid.privacySub}</p>
              </div>

              <div className="wf-preset-tabs" role="tablist" aria-label="Redaction presets">
                {c.hybrid.presets.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={presetIdx === idx}
                    className={`wf-preset-tab ${presetIdx === idx ? "is-active" : ""}`}
                    onClick={() => setPresetIdx(idx)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="wf-privacy-grid">
                <div className="wf-dark-box">
                  <div className="wf-dark-box-head">
                    <label htmlFor="wf-pii-textarea" className="wf-caption is-light">
                      {c.hybrid.beforeLabel}
                    </label>
                    <span className="wf-mono is-light">{currentDraft.length} chars</span>
                  </div>
                  <textarea
                    id="wf-pii-textarea"
                    className="wf-dark-textarea"
                    value={currentDraft}
                    maxLength={320}
                    rows={4}
                    aria-label={c.hybrid.textareaLabel}
                    onChange={(e) =>
                      setDraftByLocale((prev) => ({
                        ...prev,
                        [presetKey]: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="wf-dark-box" aria-live="polite">
                  <div className="wf-dark-box-head">
                    <span className="wf-caption is-light">{c.hybrid.afterLabel}</span>
                    <span className="wf-lime-chip">
                      {liveRedaction.redactions.length > 0
                        ? `${liveRedaction.redactions.length} ${c.hybrid.maskedSuffix}`
                        : c.hybrid.clearLabel}
                    </span>
                  </div>
                  <div className="wf-dark-output">
                    {renderSanitized(liveRedaction.sanitized)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 07 — MONUMENTAL MANIFESTO PULL-QUOTE */}
        <section id="ch-manifesto" className="wf-manifesto-sec" aria-label="Retention manifesto">
          <div className="wf-container wf-manifesto-grid">
            <div className="wf-manifesto-quote-col">
              <span className="wf-coord">{c.manifesto.index}</span>
              <span className="wf-quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote className="wf-monument-quote">
                {c.manifesto.quoteLines.map((ln, idx) => {
                  const trailing = idx < c.manifesto.quoteLines.length - 1 ? " " : "";
                  if (!ln.italicWord) {
                    return (
                      <span key={idx}>
                        {ln.text}
                        {trailing}
                      </span>
                    );
                  }
                  const parts = ln.text.split(ln.italicWord);
                  return (
                    <span key={idx}>
                      {parts[0]}
                      <em>{ln.italicWord}</em>
                      {parts[1]}
                      {trailing}
                    </span>
                  );
                })}
              </blockquote>
              <p className="wf-caption">{c.manifesto.attribution}</p>
            </div>

            <div className="wf-manifesto-trail" aria-hidden="true">
              <figure className="wf-trail-photo is-a" data-speed-y="-50">
                <img src="/images/preview-flashcards.jpg" alt="" width={680} height={500} decoding="async" />
              </figure>
              <span className="wf-swatch-chip is-trail-lime" data-speed-y="-30" />
              <figure className="wf-trail-photo is-b" data-speed-y="-85">
                <img src="/images/preview-notes.jpg" alt="" width={460} height={340} decoding="async" />
              </figure>
            </div>
          </div>
        </section>

        {/* CHAPTER 08 — QUIET EDITORIAL FAQ */}
        <section id="ch-faq" className="wf-faq-sec" aria-labelledby="wf-faq-h2">
          <div className="wf-container wf-faq-grid">
            <div className="wf-faq-aside">
              <span className="wf-coord">{c.manifesto.faqIndex}</span>
              <h2 id="wf-faq-h2" className="wf-serif-h2">
                {c.manifesto.faqHeading}
              </h2>
              <ConjoinedLink
                href="/braindrop-extension.zip"
                download
                label={c.manifesto.extensionCta}
                variant="ink"
                icon="download"
                size="sm"
              />
            </div>

            <div className="wf-faq-list">
              {c.manifesto.faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className="wf-faq-item">
                    <button
                      type="button"
                      className="wf-faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <span>{item.q}</span>
                      <span className="wf-faq-icon" aria-hidden="true">
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="wf-faq-a-wrap"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p className="wf-faq-a">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* THEATER CURTAIN-REVEAL STICKY OBSIDIAN FOOTER */}
      <footer id="wf-footer" className="wf-footer">
        <div className="wf-container">
          <div className="wf-footer-top">
            <div className="wf-footer-cta-block">
              <h2 className="wf-serif-h2 is-light">{c.footer.heading}</h2>
              <p className="wf-light-body">{c.footer.sub}</p>
              <div className="wf-footer-actions">
                <ConjoinedLink
                  href="/notes"
                  label={c.footer.primaryCta}
                  variant="lime"
                />
                <ConjoinedLink
                  href="/braindrop-extension.zip"
                  download
                  label={c.footer.secondaryCta}
                  variant="outline-light"
                  icon="download"
                />
              </div>
            </div>

            <div className="wf-footer-cols">
              <div className="wf-footer-col">
                <span className="wf-caption is-light">{c.footer.colWorkspace}</span>
                <ul>
                  {c.hud.workspaceLinks.map((lnk) => (
                    <li key={lnk.href}>
                      <a href={lnk.href}>{lnk.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="wf-footer-col">
                <span className="wf-caption is-light">{c.footer.colChapters}</span>
                <ul>
                  {c.hud.chapters.slice(0, 6).map((ch) => (
                    <li key={ch.id}>
                      <a
                        href={`#${ch.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          jumpToChapter(ch.id);
                        }}
                      >
                        {ch.num} · {ch.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="wf-footer-meta">
            <span className="wf-caption is-light">{c.footer.copyright}</span>
            <button type="button" className="wf-back-top" onClick={() => scrollToY(0)}>
              <span>{c.footer.backToTop}</span>
              <ArrowUp size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="wf-footer-monument" aria-hidden="true">
          <span>BRAINDROP</span>
          <i className="wf-footer-dot" />
        </div>
      </footer>

      {/* Vault Atelier Study Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && activeRoom && (
          <motion.div
            className="wf-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activeRoom.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="wf-lightbox-shell"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="wf-lightbox-bar">
                <span className="wf-mono is-light">
                  {activeRoom.index} / 0{c.vault.rooms.length} · {activeRoom.title}
                </span>
                <div className="wf-steppers">
                  <button
                    type="button"
                    className="wf-lightbox-btn"
                    aria-label={c.vault.prevLabel}
                    onClick={() => {
                      const prev =
                        (activeRoomIdx - 1 + c.vault.rooms.length) % c.vault.rooms.length;
                      setSelectedRoomId(c.vault.rooms[prev].id);
                    }}
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="wf-lightbox-btn"
                    aria-label={c.vault.nextLabel}
                    onClick={() => {
                      const next = (activeRoomIdx + 1) % c.vault.rooms.length;
                      setSelectedRoomId(c.vault.rooms[next].id);
                    }}
                  >
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="wf-lightbox-btn"
                    aria-label={c.vault.closeLabel}
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="wf-lightbox-media">
                <img
                  src={activeRoom.imageSrc}
                  alt={activeRoom.imageAlt}
                  width={1280}
                  height={820}
                />
              </div>

              <div className="wf-lightbox-foot">
                <p className="wf-light-body">{activeRoom.studyCaption}</p>
                <ConjoinedLink
                  href={activeRoom.route}
                  label={activeRoom.cta}
                  variant="lime"
                  size="sm"
                  onClick={() => setLightboxOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
