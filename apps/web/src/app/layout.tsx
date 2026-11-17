import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrainDrop AI — Your Second Brain, On-Device",
  description:
    "Privacy-first knowledge capture & research assistant powered by Firebase AI Logic Hybrid Inference. Clip, organize, and connect your knowledge — on-device.",
  openGraph: {
    title: "BrainDrop AI",
    description: "Capture anything, forget nothing — your second brain that never leaves your device.",
    url: "https://brain.tinonurcahya.dev",
    siteName: "BrainDrop AI",
    type: "website",
  },
};

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white font-bold text-sm">
              🧠
            </div>
            <span className="text-lg font-bold gradient-text">BrainDrop AI</span>
          </a>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/notes", label: "Notes", icon: "📝" },
              { href: "/graph", label: "Graph", icon: "🕸️" },
              { href: "/flashcards", label: "Cards", icon: "🃏" },
              { href: "/dashboard", label: "Dashboard", icon: "📊" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Nano Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)] pulse-dot" />
              <span className="text-[var(--text-muted)]">Nano: Checking...</span>
            </div>

            {/* Demo Mode Toggle */}
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 hover:bg-[var(--accent-purple)]/20 transition-colors">
              Demo Mode
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function TelemetryHUD() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            <span className="text-[var(--text-muted)]">On-Device:</span>
            <span className="font-mono text-[var(--accent-emerald)]">0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />
            <span className="text-[var(--text-muted)]">Cloud:</span>
            <span className="font-mono text-[var(--accent-blue)]">0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)]" />
            <span className="text-[var(--text-muted)]">Simulated:</span>
            <span className="font-mono text-[var(--accent-amber)]">0</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🔒</span>
          <span className="text-[var(--text-muted)]">Data kept local:</span>
          <span className="font-mono text-[var(--accent-emerald)]">0 B</span>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-right" theme="dark" />
        <Navbar />
        <main className="pt-16 pb-10 min-h-screen">{children}</main>
        <TelemetryHUD />
      </body>
    </html>
  );
}
