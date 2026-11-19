"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X } from "lucide-react";
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
  { href: "/#experience", label: "The experience" },
  { href: "/#how-it-works", label: "How it works" },
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
          <ThemeToggle />
          <Link href="/notes" className="nav-workspace">
            Workspace
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
