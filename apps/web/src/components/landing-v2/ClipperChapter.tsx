"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollingText } from "@/components/ui/RollingText";
import type { ChaptersCopy } from "@/lib/landing-v2-chapters";
gsap.registerPlugin(ScrollTrigger);

interface Clip {
  text: string;
  n: number;
  time: string;
}

const trunc = (s: string, max = 96) => (s.length > max ? `${s.slice(0, max).trimEnd()}…` : s);

/** The page is the article: sentences light up with scroll, and a clip falls into the vault line. */
export function ClipperChapter({ copy }: { copy: ChaptersCopy["clipper"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const selectedRef = useRef(false);
  const autoDone = useRef(false);
  const countRef = useRef(0);
  const total = copy.sentences.length;
  const [lit, setLit] = useState(0);
  const [clip, setClip] = useState<Clip | null>(null);

  const burst = useCallback((rects: DOMRect[]) => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const vault = vaultRef.current;
    if (!canvas || !section || !vault || !rects.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = section.clientWidth);
    const h = (canvas.height = section.clientHeight);
    const sr = section.getBoundingClientRect();
    const vr = vault.getBoundingClientRect();
    const color = getComputedStyle(section).getPropertyValue("--v2-acc").trim() || "#79d9de";

    const parts = Array.from({ length: 170 }, () => {
      const r = rects[Math.floor(Math.random() * rects.length)];
      return {
        x0: r.left - sr.left + Math.random() * r.width,
        y0: r.top - sr.top + Math.random() * r.height,
        x1: vr.left - sr.left + Math.random() * Math.min(vr.width, 520),
        y1: vr.top - sr.top + vr.height * 0.5 + (Math.random() - 0.5) * 6,
        d: Math.random() * 0.35,
        wob: (Math.random() - 0.5) * 70,
        s: 0.8 + Math.random() * 1.6,
      };
    });

    const state = { t: 0 };
    gsap.to(state, {
      t: 1.4,
      duration: 1.4,
      ease: "none",
      onUpdate: () => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color;
        for (const p of parts) {
          const k = Math.min(1, Math.max(0, (state.t - p.d) / 1.0));
          const ex = k * k * (3 - 2 * k);
          const ey = k * k;
          const x = p.x0 + (p.x1 - p.x0) * ex + Math.sin(k * Math.PI) * p.wob;
          const y = p.y0 + (p.y1 - p.y0) * ey;
          ctx.globalAlpha = 1 - k * 0.25;
          ctx.beginPath();
          ctx.arc(x, y, p.s, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      onComplete: () => ctx.clearRect(0, 0, w, h),
    });
  }, []);

  const save = useCallback(
    (text: string, rects: DOMRect[]) => {
      const clean = text.trim();
      if (!clean) return;
      burst(rects);
      const n = ++countRef.current;
      window.setTimeout(
        () =>
          setClip({
            text: clean,
            n,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }),
        550
      );
    },
    [burst]
  );

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    if (reduce || narrow) {
      setLit(total);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=1500",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setLit(Math.min(total, Math.ceil(p * total * 1.15)));
          if (p > 0.72 && !autoDone.current) {
            autoDone.current = true;
            const s = sentenceRefs.current[copy.autoIndex];
            if (s) save(s.textContent ?? "", Array.from(s.getClientRects()));
          }
        },
      });
    }, el);
    return () => ctx.revert();
  }, [total, copy.autoIndex, save]);

  const handleUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    const host = sectionRef.current?.querySelector(".v2-clip-text");
    if (text.length < 12 || !host || !sel.anchorNode || !host.contains(sel.anchorNode)) return;
    const rects = Array.from(sel.getRangeAt(0).getClientRects());
    selectedRef.current = true;
    window.setTimeout(() => (selectedRef.current = false), 80);
    save(text, rects);
    sel.removeAllRanges();
  };

  const clipSentence = (i: number) => {
    if (selectedRef.current) return;
    const s = sentenceRefs.current[i];
    if (s) save(s.textContent ?? "", Array.from(s.getClientRects()));
  };

  return (
    <section id="v2-clipper" ref={sectionRef} data-v2-surface="paper" className="v2-clipper v2-paper">
      <canvas ref={canvasRef} className="v2-clip-fx" aria-hidden="true" />

      <header className="v2-clip-head">
        <h2 className="v2-clip-title">{copy.title}</h2>
        <p className="v2-clip-hint">{copy.hint}</p>
      </header>

      <p className="v2-clip-text" onMouseUp={handleUp} onTouchEnd={handleUp}>
        {copy.sentences.map((s, i) => (
          <span
            key={i}
            ref={(node) => {
              sentenceRefs.current[i] = node;
            }}
            role="button"
            tabIndex={0}
            className={`v2-clip-s ${i < lit ? "is-lit" : ""}`}
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

      <div className="v2-clip-foot">
        <div ref={vaultRef} className="v2-vault" aria-live="polite">
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
