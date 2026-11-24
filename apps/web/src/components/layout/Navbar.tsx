"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X, Search, ArrowUpRight } from "lucide-react";
import { initAppCheck } from "@/lib/firebase";
import { ThemeToggle } from "./ThemeProvider";
import { LocaleToggle, useLocale } from "./LocaleProvider";
import { RollingText } from "@/components/ui/RollingText";

const workspaceLinks = [
  { href: "/capture", label: "Capture" },
  { href: "/notes", label: "Notes" },
  { href: "/graph", label: "Graph" },
  { href: "/flashcards", label: "Cards" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { copy } = useLocale();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    initAppCheck();
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const media = matchMedia("(min-width: 960px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", close);
    media.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", close);
      media.removeEventListener("change", resize);
    };
  }, []);

  useEffect(() => {
    const isLanding = pathname === "/";

    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 60);

      if (isLanding) {
        if (current < 80) {
          setVisible(true);
          lastScroll.current = current;
          return;
        }
        const delta = current - lastScroll.current;
        if (delta > 5) setVisible(false);
        else if (delta < -5) setVisible(true);
        lastScroll.current = current;
      } else {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // /v2 renders its own header
  if (pathname === "/v2") return null;

  // Awwwards Editorial Header on Landing Page ("/")
  if (pathname === "/") {
    return (
      <header
        className={`aw-landing-header ${scrolled ? "is-scrolled" : ""} ${
          !visible ? "is-hidden" : ""
        }`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <a
          href="#canvas-journey"
          className="aw-wordmark"
          aria-label="BrainDrop AI, back to top"
        >
          <span className="aw-brand-icon" aria-hidden="true">
            ✳
          </span>
          <span className="aw-brand-text">
            {"braindrop / ai".split("").map((char, i) => (
              <span
                key={i}
                className="aw-brand-char"
                style={{ "--char-index": i } as React.CSSProperties}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="aw-brand-period">.</span>
        </a>

        <span className="aw-header-description">{copy.header.subtitle}</span>

        <div className="aw-header-actions">
          <LocaleToggle />
          <ThemeToggle />
          <Link href="/notes" className="aw-demo-link group">
            <RollingText text={copy.header.launchWorkspace} />{" "}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
    );
  }

  // Functional Workspace Header on App Routes
  const headerClass = [
    "site-header",
    scrolled ? "scrolled" : "",
    !visible ? "nav-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="BrainDrop home">
          <span className="brand-symbol">
            <Brain size={21} />
          </span>
          <span>
            braindrop
            <span className="brand-ai"> / ai</span>
          </span>
        </Link>
        <div className="desktop-nav">
          {workspaceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-sm"
            title="Open Command Palette (Cmd+K)"
          >
            <Search size={13} className="text-[var(--accent-cyan)]" />
            <span className="font-sans text-[11px]">Search</span>
            <kbd className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <Link
            href="/notes"
            className="nav-workspace flex items-center gap-1.5 !bg-[var(--accent-cyan)]/15 !text-[var(--accent-cyan)] !border-[var(--accent-cyan)]/30 hover:!bg-[var(--accent-cyan)]/25 transition-all text-xs font-semibold py-1.5 px-3 sm:px-4"
          >
            <span>Open App</span>
            <ArrowUpRight size={13} />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="mobile-menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {open && (
          <div className="mobile-nav" id="mobile-navigation">
            {workspaceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/notes" onClick={() => setOpen(false)}>
              Open workspace
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
