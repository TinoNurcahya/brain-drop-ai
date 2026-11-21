"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Network,
  LayoutDashboard,
  BookmarkPlus,
  Zap,
  Plus,
  Sparkles,
  SunMoon,
  ArrowRight,
  X,
  CornerDownLeft,
} from "lucide-react";
import { useNotesStore } from "@/stores/notes-store";

interface ActionItem {
  id: string;
  category: "Navigation" | "Notes" | "Actions";
  title: string;
  subtitle?: string;
  icon: typeof FileText;
  badge?: string;
  onSelect: () => void;
}

export function WorkspaceCommandPalette() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const notes = useNotesStore((s) => s.notes);
  const setActiveNoteId = useNotesStore((s) => s.setActiveNoteId);
  const createNote = useNotesStore((s) => s.createNote);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Strictly disabled on landing page per design choice
  const isWorkspace = pathname !== "/";

  // Global keyboard listener for Cmd+K / Ctrl+K and custom trigger
  useEffect(() => {
    if (!isWorkspace) {
      setIsOpen(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isWorkspace]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items
  const items: ActionItem[] = useMemo(() => {
    const list: ActionItem[] = [];

    // 1. Navigation Routes
    const routes = [
      { id: "nav-notes", title: "Notes Explorer", path: "/notes", icon: FileText, badge: "Workspace" },
      { id: "nav-graph", title: "Knowledge Topology Graph", path: "/graph", icon: Network, badge: "Graph" },
      { id: "nav-dashboard", title: "Analytics Dashboard", path: "/dashboard", icon: LayoutDashboard, badge: "Metrics" },
      { id: "nav-capture", title: "Smart Capture Clipper", path: "/capture", icon: BookmarkPlus, badge: "Clipper" },
      { id: "nav-flashcards", title: "Spaced Repetition Cards", path: "/flashcards", icon: Zap, badge: "SRS" },
    ];

    routes.forEach((r) => {
      list.push({
        id: r.id,
        category: "Navigation",
        title: r.title,
        subtitle: r.path,
        icon: r.icon,
        badge: r.badge,
        onSelect: () => {
          router.push(r.path);
          setIsOpen(false);
        },
      });
    });

    // 2. Quick Actions
    list.push({
      id: "act-new-note",
      category: "Actions",
      title: "Create New Note",
      subtitle: "Instant clean canvas in notes editor",
      icon: Plus,
      badge: "Action",
      onSelect: () => {
        const newNote = createNote({
          title: "Untitled Note",
          content: "<p>Start typing...</p>",
          plainText: "Start typing...",
          tags: ["quick-note"],
          isClip: false,
        });
        setActiveNoteId(newNote.id);
        router.push("/notes");
        setIsOpen(false);
      },
    });

    list.push({
      id: "act-theme",
      category: "Actions",
      title: "Toggle Color Theme",
      subtitle: "Switch between dark cosmic and light mode",
      icon: SunMoon,
      badge: "Theme",
      onSelect: () => {
        const current = document.documentElement.dataset.theme;
        const next = current === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("braindrop-theme", next);
        setIsOpen(false);
      },
    });

    // 3. Vault Notes
    notes.slice(0, 30).forEach((note) => {
      list.push({
        id: `note-${note.id}`,
        category: "Notes",
        title: note.title || "Untitled Thought",
        subtitle: note.tags?.length ? `#${note.tags.join(" #")}` : "Local note",
        icon: FileText,
        badge: note.isClip ? "Clip" : "Note",
        onSelect: () => {
          setActiveNoteId(note.id);
          router.push("/notes");
          setIsOpen(false);
        },
      });
    });

    return list;
  }, [notes, router, setActiveNoteId, createNote]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [items, query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
      }
    }
  };

  if (!isWorkspace || !isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden font-sans flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
          <Search size={18} className="text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspace, notes, or quick actions..."
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]">
            ESC
          </kbd>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="sm:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Items List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              No matching commands or notes found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => item.onSelect()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] border border-[var(--accent-cyan)]/30"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-[var(--accent-cyan)]/25 text-[var(--accent-cyan)]"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-[var(--text-muted)] truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]">
                        {item.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft size={13} className="text-[var(--accent-cyan)]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--bg-primary)]/70 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>BrainDrop Command Palette</span>
        </div>
      </div>
    </div>
  );
}
