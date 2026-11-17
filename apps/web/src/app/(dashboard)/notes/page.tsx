"use client";

import { useState } from "react";

interface NoteItem {
  id: string;
  title: string;
  preview: string;
  tags: string[];
  isClip: boolean;
  updatedAt: string;
}

const DEMO_NOTES: NoteItem[] = [
  {
    id: "1",
    title: "Firebase AI Logic — Hybrid Inference Guide",
    preview: "Firebase AI Logic provides a single SDK for running prompts on-device with Gemini Nano and falling back to cloud models...",
    tags: ["firebase", "ai", "hybrid"],
    isClip: true,
    updatedAt: "2m ago",
  },
  {
    id: "2",
    title: "React Server Components vs Client Components",
    preview: "Server Components render on the server and send HTML to the client. They cannot use hooks or browser APIs...",
    tags: ["react", "nextjs", "architecture"],
    isClip: false,
    updatedAt: "1h ago",
  },
  {
    id: "3",
    title: "Knowledge Graph Visualization Techniques",
    preview: "Force-directed layouts work well for small to medium graphs. For larger datasets, consider hierarchical or radial layouts...",
    tags: ["visualization", "d3", "graph"],
    isClip: true,
    updatedAt: "3h ago",
  },
  {
    id: "4",
    title: "Spaced Repetition Algorithm — Leitner System",
    preview: "The Leitner system uses boxes numbered 1-5. Correctly answered cards move up a box, incorrect ones return to box 1...",
    tags: ["learning", "algorithm", "flashcards"],
    isClip: false,
    updatedAt: "1d ago",
  },
];

export default function NotesPage() {
  const [selectedNote, setSelectedNote] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = DEMO_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.includes(searchQuery.toLowerCase()))
  );

  const activeNote = DEMO_NOTES.find((n) => n.id === selectedNote);

  return (
    <div className="flex h-[calc(100vh-6.5rem)]">
      {/* Sidebar — Note List */}
      <aside className="w-80 border-r border-[var(--border)] flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔍</span>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
            />
          </div>
          <button className="mt-3 w-full py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
            + New Note
          </button>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note.id)}
              className={`w-full text-left p-4 border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors ${
                selectedNote === note.id ? "bg-[var(--bg-tertiary)] border-l-2 border-l-[var(--accent-blue)]" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 flex-1">
                  {note.isClip && <span className="mr-1.5">📎</span>}
                  {note.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-2">{note.preview}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">{note.updatedAt}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main — Editor Area */}
      <div className="flex-1 flex flex-col">
        {activeNote ? (
          <>
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
              <div>
                <h1 className="text-lg font-semibold">{activeNote.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {activeNote.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs glass hover:border-[var(--border-hover)]">
                  🔗 Link Notes
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs glass hover:border-[var(--border-hover)]">
                  🃏 Make Flashcards
                </button>
              </div>
            </div>

            {/* Editor + AI Sidebar */}
            <div className="flex-1 flex">
              {/* Editor */}
              <div className="flex-1 p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="min-h-[400px] p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-secondary)] leading-relaxed">
                    <p className="text-[var(--text-muted)] italic">
                      ✏️ Tiptap rich text editor will be integrated here.
                    </p>
                    <p className="mt-4">{activeNote.preview}</p>
                    <p className="mt-4 text-[var(--text-muted)]">
                      Select text to see AI actions: Summarize, Simplify, Expand, Translate...
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Sidebar */}
              <aside className="w-72 border-l border-[var(--border)] p-4 flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-[var(--text-secondary)]">🤖 AI Assistant</h2>

                <div className="space-y-2">
                  {[
                    { icon: "📝", label: "Summarize", badge: "On-Device", color: "emerald" },
                    { icon: "💡", label: "Simplify", badge: "On-Device", color: "emerald" },
                    { icon: "📖", label: "Expand", badge: "Cloud", color: "blue" },
                    { icon: "🔗", label: "Find Related", badge: "On-Device", color: "emerald" },
                    { icon: "🌐", label: "Translate", badge: "Cloud", color: "blue" },
                    { icon: "🧪", label: "Synthesize", badge: "Cloud", color: "blue" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center justify-between p-3 rounded-lg glass hover:border-[var(--border-hover)] transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span>{action.icon}</span>
                        <span>{action.label}</span>
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          action.color === "emerald"
                            ? "bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
                            : "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]"
                        }`}
                      >
                        {action.badge}
                      </span>
                    </button>
                  ))}
                </div>

                {/* AI Response Area */}
                <div className="flex-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] p-3">
                  <p className="text-xs text-[var(--text-muted)] text-center mt-8">
                    Select text and choose an AI action to see results here.
                  </p>
                </div>
              </aside>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📝</span>
              <h2 className="text-xl font-semibold mb-2">Select a note</h2>
              <p className="text-sm text-[var(--text-muted)]">Choose a note from the sidebar or create a new one.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
