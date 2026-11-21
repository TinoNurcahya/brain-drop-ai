"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X, Search, ArrowUpRight } from "lucide-react";
import { initAppCheck } from "@/lib/firebase";
import { ThemeToggle } from "./ThemeProvider";

const workspaceLinks = [
  { href: "/capture", label: "Capture" },
  { href: "/notes", label: "Notes" },
  { href: "/graph", label: "Graph" },
  { href: "/flashcards", label: "Cards" },
  { href: "/dashboard", label: "Dashboard" },
];
const landingLinks = [
  { href: "/#canvas-journey", label: "Experience" },
  { href: "/#manifesto-folders", label: "Philosophy" },
  { href: "/#manifesto-privacy", label: "Hybrid AI" },
  { href: "/#manifesto-clipper", label: "Extension" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const links = pathname === "/" ? landingLinks : workspaceLinks;

  useEffect(() => {
    initAppCheck();
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Keyboard close + responsive menu collapse
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

  // Scroll-direction-aware hide/reveal (only on landing page)
  useEffect(() => {
    const isLanding = pathname === "/";

    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 60);

      if (isLanding) {
        // Always show near top
        if (current < 80) {
          setVisible(true);
          lastScroll.current = current;
          return;
        }
        // Show on scroll up, hide on scroll down
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

  const headerClass = [
    "site-header",
    scrolled ? "scrolled" : "",
    !visible ? "hidden" : "",
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
          {links.map((link) => (
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
          {pathname === "/" && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[11px] font-mono text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
              <span>Gemini Nano</span>
              <span className="text-[var(--border)]">|</span>
              <span className="text-[var(--accent-emerald)] font-medium">48ms Latency</span>
              <span className="text-[var(--border)]">|</span>
              <span className="text-[var(--accent-cyan)] font-medium">Zero Data Leakage</span>
            </div>
          )}
          {pathname !== "/" && (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all cursor-pointer shadow-sm"
              title="Open Command Palette (Cmd+K)"
            >
              <Search size={13} className="text-[var(--accent-cyan)]" />
              <span className="font-sans text-[11px]">Search</span>
              <kbd className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]">
                ⌘K
              </kbd>
            </button>
          )}
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
            {links.map((link) => (
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
