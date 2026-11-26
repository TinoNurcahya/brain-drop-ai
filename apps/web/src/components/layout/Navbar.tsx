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

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Canonical landing page ("/") renders its own editorial V2Header
  if (pathname === "/" || pathname === "/v2") return null;

  const headerClass = ["site-header", scrolled ? "scrolled" : ""]
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
