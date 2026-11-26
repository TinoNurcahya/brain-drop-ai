"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget, scrollToY } from "@/lib/smooth-scroll";

const IDS = [
  "v2-story",
  "v2-workspace",
  "v2-hybrid",
  "v2-clipper",
  "v2-privacy",
  "v2-index",
  "v2-closing",
];

/** Quiet right-edge dot index (LifeMemory-inspired) + 1.5px total scroll hairline. */
export function ChapterHud({ names }: { names: string[] }) {
  const [active, setActive] = useState(0);
  const [surface, setSurface] = useState<"ink" | "paper">("ink");
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let cur = 0;
      let curSurface: "ink" | "paper" = "ink";

      // Evaluate chapters 0..5 inside the main stage.
      for (let i = 0; i < IDS.length - 1; i++) {
        const el = document.getElementById(IDS[i]);
        if (el && el.getBoundingClientRect().top <= mid) {
          cur = i;
          curSurface = el.dataset.v2Surface === "paper" ? "paper" : "ink";
        }
      }

      // Evaluate sticky-curtain closing chapter (ink) via mainStage bottom exit.
      const mainStage = document.getElementById("v2-main-stage");
      if (mainStage && mainStage.getBoundingClientRect().bottom <= mid) {
        cur = IDS.length - 1;
        curSurface = "ink";
      }

      setActive((prev) => (prev === cur ? prev : cur));
      setSurface((prev) => (prev === curSurface ? prev : curSurface));

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      lineRef.current?.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleJump = (i: number) => {
    if (i === IDS.length - 1) {
      scrollToY(document.documentElement.scrollHeight - window.innerHeight);
      return;
    }
    scrollToTarget(`#${IDS[i]}`);
  };

  return (
    <>
      <nav
        className={`v2-side-index v2-side-index-${surface}`}
        aria-label="Chapter index"
      >
        {IDS.map((id, i) => (
          <button
            key={id}
            type="button"
            className="v2-side-dot-btn"
            aria-label={`0${i + 1} ${names[i] ?? ""}`}
            aria-current={active === i ? "step" : undefined}
            onClick={() => handleJump(i)}
          >
            <span className="v2-side-dot" aria-hidden="true" />
            <span className="v2-side-name">
              <span className="v2-side-num">0{i + 1}</span>
              {names[i]}
            </span>
          </button>
        ))}
      </nav>
      <div ref={lineRef} className="v2-hud-line" aria-hidden="true" />
    </>
  );
}
