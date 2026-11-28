"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUp } from "lucide-react";
import { sanitize } from "@braindrop/core";
import type { LandingCopy } from "@/lib/landing-copy";
import { scrollToY } from "@/lib/smooth-scroll";
import { SplitLines } from "./SplitLines";

gsap.registerPlugin(ScrollTrigger);

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function parseFact(val: string) {
  const m = val.match(/^(\d+)(.*)$/);
  if (!m) return { target: 0, suffix: val, numeric: false };
  return { target: Number(m[1]), suffix: m[2], numeric: true };
}

/** Private by default: 3-tier architectural vertical conduit + live editable PII redaction sandbox. */
export function PrivacyPipeline({ copy }: { copy: LandingCopy["why"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const conduitRef = useRef<HTMLDivElement>(null);
  const factRefs = useRef<(HTMLElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [beat, setBeat] = useState(0);
  const [layer, setLayer] = useState(0);
  const [gateActive, setGateActive] = useState(false);
  const [cloudActive, setCloudActive] = useState(false);
  const [returnActive, setReturnActive] = useState(false);
  const [sampleIdx, setSampleIdx] = useState<number>(0); // 0, 1 = presets, 2 = custom editable
  const [customText, setCustomText] = useState<string>(() => copy.sandbox.samples[0]?.rawText ?? "");
  const [interacted, setInteracted] = useState(false);
  const [isStatic, setStatic] = useState(false);

  const isCustom = sampleIdx === 2;
  const activeRawText = isCustom
    ? customText
    : (copy.sandbox.samples[sampleIdx]?.rawText ?? copy.sandbox.samples[0].rawText);

  const result = useMemo(() => sanitize(activeRawText), [activeRawText]);
  const parts = useMemo(
    () => result.sanitized.split(/(\[REDACTED_[A-Z_]+\])/g).filter(Boolean),
    [result.sanitized]
  );

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const applyProgress = (p: number) => {
      const b = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      const localScan = b === 1 ? clamp01((p - 0.34) / 0.33) : b === 2 ? 1 : 0;
      const q = b === 2 ? clamp01((p - 0.67) / 0.33) : 0;

      // Parallel vertical conduit phases (strictly non-crossing):
      // Outbound A (01->02): q 0.00..0.28
      // Gate intercept (02): q 0.28..0.46
      // Outbound B (02->03): q 0.46..0.72
      // Return B (03->02):   q 0.72..0.86
      // Return A (02->01):   q 0.86..1.00
      const outA = clamp01(q / 0.28);
      const outB = clamp01((q - 0.46) / 0.26);
      const retB = clamp01((q - 0.72) / 0.14);
      const retA = clamp01((q - 0.86) / 0.14);

      const activeTier =
        b < 2 ? 0 : q < 0.24 ? 0 : q < 0.58 ? 1 : q < 0.92 ? 2 : 0;

      setBeat((prev) => (prev === b ? prev : b));
      setLayer((prev) => (prev === activeTier ? prev : activeTier));
      setGateActive((prev) => {
        const next = q >= 0.24;
        return prev === next ? prev : next;
      });
      setCloudActive((prev) => {
        const next = q >= 0.64;
        return prev === next ? prev : next;
      });
      setReturnActive((prev) => {
        const next = q >= 0.76;
        return prev === next ? prev : next;
      });

      const conduit = conduitRef.current;
      if (conduit) {
        conduit.style.setProperty("--local-scan", localScan.toFixed(3));
        conduit.style.setProperty("--out-a", outA.toFixed(3));
        conduit.style.setProperty("--out-b", outB.toFixed(3));
        conduit.style.setProperty("--ret-b", retB.toFixed(3));
        conduit.style.setProperty("--ret-a", retA.toFixed(3));
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    if (reduce || narrow) {
      setStatic(true);
      applyProgress(1);
      return;
    }

    applyProgress(0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lp-pipe-title .lp-word",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
        }
      );

      copy.facts.forEach((f, idx) => {
        const parsed = parseFact(f.value);
        const targetEl = factRefs.current[idx];
        if (!targetEl || !parsed.numeric || parsed.target === 0) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: parsed.target,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none none" },
          onUpdate: () => {
            targetEl.textContent = `${Math.round(counter.v)}${parsed.suffix}`;
          },
        });
      });

      triggerRef.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=1250",
        pin: true,
        scrub: true,
        onUpdate: (self) => applyProgress(self.progress),
      });
    }, el);
    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [copy.facts]);

  const jump = (frac: number) => {
    setInteracted(true);
    const st = triggerRef.current;
    if (st) {
      scrollToY(st.start + frac * (st.end - st.start));
      return;
    }
    const b = frac < 0.34 ? 0 : frac < 0.67 ? 1 : 2;
    setBeat(b);
    setLayer(b === 2 ? 2 : 0);
    setGateActive(b === 2);
    setCloudActive(b === 2);
    setReturnActive(b === 2);
  };

  const showSanitized = gateActive || interacted || isCustom || isStatic;
  const tier01Status =
    beat === 1
      ? copy.labels.nano
      : returnActive
        ? "Synced · local"
        : "IndexedDB · 0B out";
  const tier02Status = showSanitized
    ? `${result.redactions.length} ${copy.sandbox.scrubbedNote}`
    : "Standby · 0B egress";
  const tier03Status = cloudActive ? "Sanitized payload" : "Idle · offline";

  return (
    <section
      id="privacy"
      ref={sectionRef}
      data-surface="void"
      className={`lp-pipe lp-void ${isStatic ? "is-static" : ""}`}
      aria-label={copy.lines.join(" ")}
    >
      <div className="lp-pipe-copy">
        <div className="lp-pipe-top-group">
          <h2 className="lp-pipe-title" aria-label={copy.lines.join(" ")}>
            <SplitLines lines={copy.lines} italicWords={[copy.italicWord]} />
          </h2>

          <div className="lp-pipe-beats" aria-live="polite">
            {copy.beats.map((b, i) => (
              <div key={b.title} className={`lp-pipe-beat ${beat === i || isStatic ? "is-active" : ""}`}>
                <span className="lp-num">0{i + 1}</span>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>

          <div className="lp-pipe-jump">
            <button
              type="button"
              className={`lp-tlink lp-tlink-lg ${beat === 1 ? "is-active" : ""}`}
              onClick={() => jump(0.52)}
            >
              {copy.sandbox.localBtn}
            </button>
            <button
              type="button"
              className={`lp-tlink lp-tlink-lg ${beat === 2 ? "is-active" : ""}`}
              onClick={() => jump(0.95)}
            >
              {copy.sandbox.cloudBtn}
            </button>
          </div>
        </div>

        <dl className="lp-pipe-facts">
          {copy.facts.map((f, idx) => (
            <div key={f.label}>
              <dt
                ref={(node) => {
                  factRefs.current[idx] = node;
                }}
              >
                {f.value}
              </dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lp-pipe-visual">
        {/* 3-Tier Architectural Vertical Conduit (Strict Parallel Outbound / Return Rails) */}
        <div
          ref={conduitRef}
          className="lp-conduit"
          role="group"
          aria-label={`${copy.labels.device}, ${copy.labels.gate}, ${copy.labels.cloud}`}
        >
          {/* Tier 01: On-Device Storage & Gemini Nano */}
          <button
            type="button"
            onClick={() => jump(0.52)}
            className={`lp-tier ${layer === 0 ? "is-active" : ""} ${beat === 1 ? "is-scanning" : ""}`}
          >
            <i className="lp-reg-tick is-tl" aria-hidden="true" />
            <i className="lp-reg-tick is-br" aria-hidden="true" />
            <span className="lp-tier-id">01</span>
            <span className="lp-tier-body">
              <strong className="lp-tier-name">{copy.labels.device}</strong>
              <span className="lp-tier-sub">{copy.beats[beat === 1 ? 1 : 0]?.title}</span>
            </span>
            <span className="lp-tier-state">
              <span className="lp-tier-readout">{tier01Status}</span>
              <span className="lp-tier-track" aria-hidden="true">
                <i className="lp-tier-scan-fill" />
              </span>
            </span>
          </button>

          {/* Corridor A: Tier 01 <-> Tier 02 */}
          <div className="lp-conduit-span" aria-hidden="true">
            <div className={`lp-conduit-rail is-out ${gateActive ? "is-lit" : ""}`}>
              <span className="lp-conduit-line">
                <i className="lp-conduit-fill is-out-a" />
              </span>
              <ArrowDown size={13} className="lp-conduit-icon" />
              <span className="lp-conduit-meta">raw draft</span>
            </div>
            <div className={`lp-conduit-rail is-ret ${returnActive ? "is-lit" : ""}`}>
              <ArrowUp size={13} className="lp-conduit-icon" />
              <span className="lp-conduit-line">
                <i className="lp-conduit-fill is-ret-a" />
              </span>
              <span className="lp-conduit-meta">local save</span>
            </div>
          </div>

          {/* Tier 02: Local PII Redaction Gate */}
          <button
            type="button"
            onClick={() => jump(0.8)}
            className={`lp-tier is-gate ${layer === 1 ? "is-active" : ""} ${
              showSanitized ? "is-intercepting" : ""
            }`}
          >
            <i className="lp-reg-tick is-tl" aria-hidden="true" />
            <i className="lp-reg-tick is-br" aria-hidden="true" />
            <span className="lp-tier-id">02</span>
            <span className="lp-tier-body">
              <strong className="lp-tier-name">{copy.labels.gate}</strong>
              <span className="lp-tier-sub">@braindrop/core · &lt;2ms</span>
            </span>
            <span className="lp-tier-state">
              <span className={`lp-tier-readout ${showSanitized ? "is-redact" : ""}`}>
                {tier02Status}
              </span>
              <span className="lp-tier-aperture" aria-hidden="true">
                <i className="is-left" />
                <i className="is-right" />
              </span>
            </span>
          </button>

          {/* Corridor B: Tier 02 <-> Tier 03 */}
          <div className="lp-conduit-span" aria-hidden="true">
            <div className={`lp-conduit-rail is-out ${cloudActive ? "is-lit" : ""}`}>
              <span className="lp-conduit-line">
                <i className="lp-conduit-fill is-out-b" />
              </span>
              <ArrowDown size={13} className="lp-conduit-icon" />
              <span className="lp-conduit-meta">redacted only</span>
            </div>
            <div className={`lp-conduit-rail is-ret ${returnActive ? "is-lit" : ""}`}>
              <ArrowUp size={13} className="lp-conduit-icon" />
              <span className="lp-conduit-line">
                <i className="lp-conduit-fill is-ret-b" />
              </span>
              <span className="lp-conduit-meta">synthesis</span>
            </div>
          </div>

          {/* Tier 03: Cloud Synthesis (Gemini 3.8 Flash) */}
          <button
            type="button"
            onClick={() => jump(0.95)}
            className={`lp-tier ${layer === 2 ? "is-active" : ""} ${cloudActive ? "is-reached" : ""}`}
          >
            <i className="lp-reg-tick is-tl" aria-hidden="true" />
            <i className="lp-reg-tick is-br" aria-hidden="true" />
            <span className="lp-tier-id">03</span>
            <span className="lp-tier-body">
              <strong className="lp-tier-name">{copy.labels.cloud}</strong>
              <span className="lp-tier-sub">{copy.beats[2]?.title}</span>
            </span>
            <span className="lp-tier-state">
              <span className="lp-tier-readout">{tier03Status}</span>
              <span className="lp-tier-track" aria-hidden="true">
                <i className={`lp-tier-cloud-fill ${cloudActive ? "is-on" : ""}`} />
              </span>
            </span>
          </button>
        </div>

        {/* Live Editable PII Redaction Proof Sandbox */}
        <div className="lp-pipe-proof">
          <div className="lp-pipe-samples-head">
            <div className="lp-pipe-samples" role="tablist" aria-label={copy.sandbox.sampleLabel}>
              {copy.sandbox.samples.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={sampleIdx === idx}
                  onClick={() => {
                    setSampleIdx(idx);
                    setInteracted(true);
                  }}
                  className={`lp-tlink ${sampleIdx === idx ? "is-active" : ""}`}
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                role="tab"
                aria-selected={isCustom}
                onClick={() => {
                  setSampleIdx(2);
                  setInteracted(true);
                }}
                className={`lp-tlink ${isCustom ? "is-active" : ""}`}
              >
                {copy.sandbox.customTabLabel}
              </button>
            </div>
            <span className="lp-pipe-engine-tag">{copy.sandbox.liveEngineLabel}</span>
          </div>

          <div className="lp-pipe-proof-row">
            <div className="lp-pipe-label-row">
              <span className="lp-pipe-proof-label">{copy.sandbox.rawLabel}</span>
              {isCustom && (
                <button
                  type="button"
                  onClick={() => setCustomText(copy.sandbox.samples[0]?.rawText ?? "")}
                  className="lp-pipe-reset"
                >
                  {copy.sandbox.resetLabel}
                </button>
              )}
            </div>

            {isCustom ? (
              <textarea
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setInteracted(true);
                }}
                rows={2}
                maxLength={280}
                placeholder={copy.sandbox.customPlaceholder}
                aria-label={copy.sandbox.customTabLabel}
                className="lp-pipe-input"
              />
            ) : (
              <p
                className={`lp-pipe-text lp-pipe-clickable ${showSanitized && layer >= 1 ? "is-dim" : ""}`}
                onClick={() => {
                  setCustomText(activeRawText);
                  setSampleIdx(2);
                  setInteracted(true);
                }}
                title={copy.sandbox.customTabLabel}
              >
                {activeRawText}
              </p>
            )}
          </div>

          <div className={`lp-pipe-proof-row ${showSanitized ? "is-on" : ""}`}>
            <span className="lp-pipe-proof-label">
              {copy.sandbox.sanitizedLabel} ·{" "}
              {result.redactions.length > 0
                ? `${result.redactions.length} ${copy.sandbox.scrubbedNote}`
                : copy.sandbox.zeroPiiNote}
            </span>
            <p className="lp-pipe-text">
              {parts.length > 0 ? (
                parts.map((part, i) =>
                  part.startsWith("[REDACTED_") ? (
                    <mark key={i} className="lp-pii-redacted">
                      {part}
                    </mark>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )
              ) : (
                <span className="lp-pipe-empty-dash">…</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
