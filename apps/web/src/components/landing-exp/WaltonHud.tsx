"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, List } from "lucide-react";
import type { Locale } from "@/lib/landing-i18n";
import type { WaltonCopy } from "@/lib/landing-walton-copy";
import { ConjoinedLink } from "./ConjoinedControl";

interface WaltonHudProps {
  copy: WaltonCopy["hud"];
  locale: Locale;
  onToggleLocale: () => void;
  activeChapterIdx: number;
  isDarkSurface: boolean;
  showBottomHud: boolean;
  onSelectChapter: (chapterId: string) => void;
}

/**
 * Walton Family Foundation signature HUD system:
 * 1. Top-center minimal 'B' + tri-swatch emblem
 * 2. Top-right EN/ID + circular spring '=' Menu button
 * 3. Frosted-backdrop floating #site-menu modal (data-lenis-prevent)
 * 4. Right-edge vertical elongating chapter progress rail
 * 5. Bottom floating context pill (02 / 07 + conjoined CTA)
 */
export function WaltonHud({
  copy,
  locale,
  onToggleLocale,
  activeChapterIdx,
  isDarkSurface,
  showBottomHud,
  onSelectChapter,
}: WaltonHudProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toneClass = isDarkSurface && !menuOpen ? "is-dark" : "";
  const formattedChapter = `0${Math.min(copy.chapters.length, Math.max(1, activeChapterIdx + 1))} / 0${copy.chapters.length}`;

  return (
    <>
      {/* 1. Top Bar: Center Emblem + Right Menu Trigger */}
      <header className={`wf-topbar ${toneClass}`}>
        <Link
          href="/"
          className="wf-emblem"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              onSelectChapter("ch-hero");
            }
          }}
        >
          <span className="sr-only">BrainDrop</span>
          <span className="wf-emblem-letter" aria-hidden="true">
            B
          </span>
          <span className="wf-emblem-bars" aria-hidden="true">
            <i className="is-a" />
            <i className="is-b" />
            <i className="is-c" />
          </span>
        </Link>

        <div className="wf-top-actions">
          <button
            type="button"
            className="wf-lang-pill"
            onClick={onToggleLocale}
            title={copy.langAria}
            aria-label={locale === "en" ? `EN — ${copy.langAria}` : `ID — ${copy.langAria}`}
          >
            {locale === "en" ? "EN" : "ID"}
          </button>

          <button
            type="button"
            className={`wf-menu-trigger ${menuOpen ? "is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="wf-site-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="wf-menu-label">
              {menuOpen ? copy.closeLabel : copy.menuLabel}
            </span>
            <span className="wf-menu-circle" aria-hidden="true">
              <span className="wf-menu-eq">
                <i />
                <i />
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* 2. Right-Edge Vertical Chapter Progress Capsule */}
      <nav
        className={`wf-progress-rail ${toneClass}`}
        aria-label="Chapter progress"
      >
        <button
          type="button"
          className="wf-rail-toc"
          aria-label={copy.menuLabel}
          onClick={() => setMenuOpen(true)}
        >
          <List size={14} aria-hidden="true" />
        </button>
        <span className="wf-rail-sep" aria-hidden="true" />
        <div className="wf-rail-dots">
          {copy.chapters.map((ch, idx) => {
            const isActive = activeChapterIdx === idx;
            return (
              <button
                key={ch.id}
                type="button"
                className={`wf-rail-dot ${isActive ? "is-active" : ""}`}
                aria-label={`${ch.num} ${ch.title}`}
                title={`${ch.num} · ${ch.title}`}
                onClick={() => onSelectChapter(ch.id)}
              >
                <span aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Bottom Floating Context HUD (02 / 07 + Conjoined CTA) */}
      <div
        className={`wf-context-hud ${showBottomHud && !menuOpen ? "is-visible" : ""} ${toneClass}`}
        aria-hidden={!showBottomHud || menuOpen}
      >
        <div className="wf-context-shell">
          <span className="wf-context-count">{formattedChapter}</span>
          <ConjoinedLink
            href="/notes"
            label={copy.contextCta}
            variant={isDarkSurface && !menuOpen ? "lime" : "light"}
            size="sm"
          />
        </div>
      </div>

      {/* 4. Frosted Floating Editorial Menu Modal (#wf-site-menu) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="wf-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              id="wf-site-menu"
              role="dialog"
              aria-modal="true"
              aria-label={copy.menuLabel}
              data-lenis-prevent="true"
              className="wf-menu-modal"
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="wf-menu-grid">
                <div className="wf-menu-col-chapters">
                  <span className="wf-menu-heading">{copy.chaptersHeading}</span>
                  <ol className="wf-menu-chapter-list">
                    {copy.chapters.map((ch, idx) => {
                      const isActive = activeChapterIdx === idx;
                      return (
                        <li key={ch.id}>
                          <button
                            type="button"
                            className={`wf-menu-chapter-btn ${isActive ? "is-active" : ""}`}
                            onClick={() => {
                              setMenuOpen(false);
                              onSelectChapter(ch.id);
                            }}
                          >
                            <span className="wf-menu-ch-num">{ch.num}</span>
                            <span className="wf-menu-ch-title">{ch.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div className="wf-menu-col-routes">
                  <span className="wf-menu-heading">{copy.workspaceHeading}</span>
                  <ul className="wf-menu-route-list">
                    {copy.workspaceLinks.map((lnk) => (
                      <li key={lnk.href}>
                        <Link
                          href={lnk.href}
                          className="wf-menu-route-link"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>{lnk.label}</span>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="wf-menu-foot">
                    <ConjoinedLink
                      href="/notes"
                      label={copy.contextCta}
                      variant="ink"
                      size="sm"
                      onClick={() => setMenuOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
