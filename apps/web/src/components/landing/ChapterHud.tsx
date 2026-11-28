"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget, scrollToY } from "@/lib/smooth-scroll";

const IDS = [
  "story",
  "workspace",
  "hybrid",
  "clipper",
  "privacy",
  "index",
  "closing",
];

/** Frameless right-edge architectural tick-mark ruler + 1.5px total scroll hairline. */
export function ChapterHud({ names }: { names: string[] }) {
  const [active, setActive] = useState(0);
  const [surface, setSurface] = useState<"ink" | "paper" | "void">("ink");
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let cur = 0;
      let curSurface: "ink" | "paper" | "void" = "ink";

      for (let i = 0; i < IDS.length - 1; i++) {
        const el = document.getElementById(IDS[i]);
        if (el && el.getBoundingClientRect().top <= mid) {
          cur = i;
          curSurface =
            el.dataset.surface === "void"
              ? "void"
              : el.dataset.surface === "paper"
                ? "paper"
                : "ink";
        }
      }

      const mainStage = document.getElementById("landing-main-stage");
      if (mainStage && mainStage.getBoundingClientRect().bottom <= mid) {
        cur = IDS.length - 1;
        curSurface = "void";
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
        className={`lp-side-index lp-side-index-${surface}`}
        aria-label="Chapter index"
      >
        {IDS.map((id, i) => (
          <button
            key={id}
            type="button"
            className="lp-side-tick-btn"
            aria-label={`0${i + 1} ${names[i] ?? ""}`}
            aria-current={active === i ? "step" : undefined}
            onClick={() => handleJump(i)}
          >
            <span className="lp-side-name">
              <span className="lp-side-num">0{i + 1}</span>
              {names[i]}
            </span>
            <span className="lp-side-idx-num" aria-hidden="true">
              0{i + 1}
            </span>
            <span className="lp-side-tick" aria-hidden="true" />
          </button>
        ))}
      </nav>
      <div ref={lineRef} className="lp-hud-line" aria-hidden="true" />
    </>
  );
}
