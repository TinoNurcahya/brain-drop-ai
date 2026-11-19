"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  BookOpen,
  Award,
  Layers,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useFlashcardStore, FlashcardItem } from "@/stores/flashcards-store";
import { useNotesStore } from "@/stores/notes-store";

export default function FlashcardsPage() {
  const {
    cards,
    selectedTopic,
    selectedBoxFilter,
    setSelectedTopic,
    setSelectedBoxFilter,
    addGeneratedCards,
    addSingleCard,
    deleteCard,
    recordReview,
    resetDeckToSeeds,
  } = useFlashcardStore();

  const { notes } = useNotesStore();

  // Review state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNoteForAi, setSelectedNoteForAi] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Manual Card form
  const [manualQuestion, setManualQuestion] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");
  const [manualTopic, setManualTopic] = useState("");
  const [manualDifficulty, setManualDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const matchTopic = selectedTopic === null || c.topic === selectedTopic;
      const matchBox = selectedBoxFilter === null || c.box === selectedBoxFilter;
      return matchTopic && matchBox;
    });
  }, [cards, selectedTopic, selectedBoxFilter]);

  // Unique topics
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    for (const c of cards) {
      if (c.topic) set.add(c.topic);
    }
    return Array.from(set);
  }, [cards]);

  // Active card
  const activeCard = filteredCards[currentIndex] || filteredCards[0] || null;

  // Leitner Box Counts & Mastery Rate
  const box1Count = cards.filter((c) => c.box === 1).length;
  const box2Count = cards.filter((c) => c.box === 2).length;
  const box3Count = cards.filter((c) => c.box === 3).length;
  const totalCards = cards.length;
  const masteryRate = totalCards > 0 ? Math.round((box3Count / totalCards) * 100) : 0;

  // Handle Review action
  const handleReview = useCallback((rating: "again" | "good" | "easy") => {
    if (!activeCard) return;
    recordReview(activeCard.id, rating);

    if (rating === "again") toast.info("Card placed in Box 1 (Daily Review)");
    if (rating === "good") toast.success("Card graduated to Box 2 (3-Day Review)");
    if (rating === "easy") toast.success("Card mastered in Box 3 (Weekly Review)!");

    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (filteredCards.length || 1));
  }, [activeCard, filteredCards.length, recordReview]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGenerateModalOpen || isAddModalOpen) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (isFlipped) {
        if (e.key === "1") handleReview("again");
        if (e.key === "2") handleReview("good");
        if (e.key === "3") handleReview("easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isGenerateModalOpen, isAddModalOpen, handleReview]);

  // AI Flashcard Generation Handler
  const handleGenerateAiCards = async () => {
    const targetNote = notes.find((n) => n.id === selectedNoteForAi);
    if (!targetNote) {
      toast.error("Please select a note from your vault");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: targetNote.id,
          title: targetNote.title,
          content: targetNote.content || targetNote.plainText,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate flashcards");

      const data = await res.json();
      const generated = data.cards || [];

      if (generated.length === 0) {
        toast.warning("No high-yield questions could be generated from this note.");
        return;
      }

      addGeneratedCards(targetNote.id, targetNote.tags?.[0] || targetNote.title, generated);
      toast.success(`Generated ${generated.length} study flashcards with AI!`);
      setIsGenerateModalOpen(false);
      setSelectedNoteForAi("");
    } catch {
      toast.error("Error generating flashcards. Fallback used.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Manual Add Card Handler
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuestion.trim() || !manualAnswer.trim()) return;

    addSingleCard({
      noteId: "manual",
      topic: manualTopic.trim() || "General",
      question: manualQuestion.trim(),
      answer: manualAnswer.trim(),
      difficulty: manualDifficulty,
    });

    toast.success("Added new study card");
    setManualQuestion("");
    setManualAnswer("");
    setManualTopic("");
    setIsAddModalOpen(false);
  };

  const difficultyColors = {
    easy: "text-[var(--accent-emerald)] bg-emerald-500/10 border-emerald-500/20",
    medium: "text-[var(--accent-amber)] bg-amber-500/10 border-amber-500/20",
    hard: "text-[var(--accent-rose)] bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <span>🃏 Spaced Repetition Flashcards</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Leitner 3-Tier Retention System · Active Recall driven by on-device note synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-white text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-primary)] hover:border-[var(--accent-blue)] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Leitner Box Status & Mastery HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Box 1 */}
        <div
          onClick={() => setSelectedBoxFilter(selectedBoxFilter === 1 ? null : 1)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedBoxFilter === 1
              ? "bg-[var(--accent-rose)]/10 border-[var(--accent-rose)]"
              : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Box 1 (Daily)</span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[var(--accent-rose)]">{box1Count}</div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Needs immediate review</p>
        </div>

        {/* Box 2 */}
        <div
          onClick={() => setSelectedBoxFilter(selectedBoxFilter === 2 ? null : 2)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedBoxFilter === 2
              ? "bg-[var(--accent-amber)]/10 border-[var(--accent-amber)]"
              : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Box 2 (3-Day)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl font-bold text-[var(--accent-amber)]">{box2Count}</div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Intermediate recall</p>
        </div>

        {/* Box 3 */}
        <div
          onClick={() => setSelectedBoxFilter(selectedBoxFilter === 3 ? null : 3)}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedBoxFilter === 3
              ? "bg-[var(--accent-emerald)]/10 border-[var(--accent-emerald)]"
              : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Box 3 (Mastered)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-[var(--accent-emerald)]">{box3Count}</div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Long-term memory</p>
        </div>

        {/* Mastery Rate */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Mastery Rate</span>
            <Award className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--accent-emerald)]">{masteryRate}%</div>
          {/* Progress bar */}
          <div className="w-full bg-[var(--bg-tertiary)] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${masteryRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Topic:
          </span>
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
              selectedTopic === null
                ? "bg-[var(--action-blue)] text-white font-medium"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            All Topics ({cards.length})
          </button>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                selectedTopic === topic
                  ? "bg-[var(--action-blue)] text-white font-medium"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {selectedBoxFilter && (
          <button
            onClick={() => setSelectedBoxFilter(null)}
            className="text-xs text-[var(--accent-blue)] hover:underline flex items-center gap-1"
          >
            <span>Showing Box {selectedBoxFilter}</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main 3D Flip Card Studio */}
      {activeCard ? (
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Card Counter & Navigation */}
          <div className="flex items-center justify-between w-full max-w-xl text-xs text-[var(--text-muted)] px-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
              }}
              className="p-1 rounded hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="font-mono">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
              }}
              className="p-1 rounded hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Flip Card Container */}
          <div className="w-full max-w-xl min-h-[340px] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div
              className={`relative w-full h-full min-h-[340px] rounded-3xl transition-transform duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full backface-hidden p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl flex flex-col justify-between hover:border-[var(--accent-blue)]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-tertiary)] text-[var(--accent-blue)] border border-[var(--border)]">
                    {activeCard.topic}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${difficultyColors[activeCard.difficulty]}`}>
                      {activeCard.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-[var(--accent-purple)] border border-purple-500/20">
                      Box {activeCard.box}
                    </span>
                  </div>
                </div>

                <div className="my-auto text-center py-6">
                  <p className="text-lg sm:text-xl font-medium text-[var(--text-primary)] leading-relaxed">
                    {activeCard.question}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border)]/40">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Tap card or press Space to reveal answer
                  </span>
                  <span className="font-mono text-[11px]">{activeCard.reviewsCount} reviews</span>
                </div>
              </div>

              {/* BACK OF CARD (REVEALED ANSWER) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--accent-purple)]/40 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-purple)] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Answer Explanation
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-[var(--accent-purple)] border border-purple-500/20">
                    Box {activeCard.box}
                  </span>
                </div>

                <div className="my-auto text-center py-6">
                  <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
                    {activeCard.answer}
                  </p>
                </div>

                <div className="text-xs text-[var(--text-muted)] text-center pt-2">
                  Rate recall to schedule spaced interval:
                </div>
              </div>
            </div>
          </div>

          {/* Leitner Rating Buttons (Active when flipped) */}
          {isFlipped ? (
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl animate-in fade-in duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReview("again");
                }}
                className="py-3 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-[var(--accent-rose)] hover:bg-rose-500/25 transition-all text-xs font-semibold flex flex-col items-center gap-1"
              >
                <span>🔴 Again (1)</span>
                <span className="text-[10px] font-normal opacity-70">Review Tomorrow</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReview("good");
                }}
                className="py-3 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[var(--accent-amber)] hover:bg-amber-500/25 transition-all text-xs font-semibold flex flex-col items-center gap-1"
              >
                <span>🟡 Good (2)</span>
                <span className="text-[10px] font-normal opacity-70">Review in 3 Days</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReview("easy");
                }}
                className="py-3 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[var(--accent-emerald)] hover:bg-emerald-500/25 transition-all text-xs font-semibold flex flex-col items-center gap-1"
              >
                <span>🟢 Easy (3)</span>
                <span className="text-[10px] font-normal opacity-70">Mastered (7 Days)</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-[var(--text-muted)] text-center h-12 flex items-center justify-center">
              <span>Press <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border)] font-mono text-[10px]">Space</kbd> or click the card to reveal the answer</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4">
          <BookOpen className="w-12 h-12 text-[var(--text-muted)] opacity-30 mx-auto" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            No Flashcards in this Filter
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            You don't have cards matching the current filter. Generate cards from your notes or reset the demo deck.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedTopic(null);
                setSelectedBoxFilter(null);
              }}
              className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] hover:border-[var(--accent-blue)] border border-[var(--border)]"
            >
              Clear Filters
            </button>
            <button
              onClick={resetDeckToSeeds}
              className="px-4 py-2 rounded-lg bg-[var(--action-blue)] text-xs text-white hover:opacity-90"
            >
              Reset Demo Deck
            </button>
          </div>
        </div>
      )}

      {/* Flashcard Vault Gallery Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Layers className="w-4 h-4" /> Card Vault ({cards.length})
          </h2>
          <button
            onClick={resetDeckToSeeds}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
          >
            <RotateCw className="w-3 h-3" /> Reset Seeds
          </button>
        </div>

        <div className="divide-y divide-[var(--border)]/40 max-h-72 overflow-y-auto pr-1">
          {cards.map((c) => (
            <div key={c.id} className="py-3 flex items-start justify-between gap-4 group">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {c.question}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    Box {c.box}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1">{c.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${difficultyColors[c.difficulty]}`}>
                  {c.difficulty}
                </span>
                <button
                  onClick={() => deleteCard(c.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-[var(--accent-rose)] transition-opacity"
                  title="Delete card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: AI Flashcard Generator Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay)] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-purple)]" />
                <span>Generate Study Cards with AI</span>
              </h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Select a note from your BrainDrop vault. AI will synthesize the content and automatically generate high-yield spaced repetition cards.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Select Source Note:
              </label>
              <select
                value={selectedNoteForAi}
                onChange={(e) => setSelectedNoteForAi(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
              >
                <option value="">-- Choose a note from vault ({notes.length} available) --</option>
                {notes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title} ({n.tags?.join(", ") || "no tags"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiCards}
                disabled={isGeneratingAi || !selectedNoteForAi}
                className="px-5 py-2 rounded-xl bg-[image:var(--gradient-primary)] text-white text-xs font-semibold hover:opacity-95 disabled:opacity-40 flex items-center gap-2"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Flashcards</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Manual Card Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--overlay)] backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleManualAdd}
            className="w-full max-w-md p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Add Custom Flashcard
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Topic / Category (e.g. Architecture, Web AI)..."
                value={manualTopic}
                onChange={(e) => setManualTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
              />

              <textarea
                rows={3}
                placeholder="Front: Question or prompt..."
                value={manualQuestion}
                onChange={(e) => setManualQuestion(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
              />

              <textarea
                rows={3}
                placeholder="Back: Answer or key insight..."
                value={manualAnswer}
                onChange={(e) => setManualAnswer(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
              />

              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Difficulty:</span>
                <select
                  value={manualDifficulty}
                  onChange={(e) => setManualDifficulty(e.target.value as any)}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)]"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!manualQuestion.trim() || !manualAnswer.trim()}
                className="px-5 py-2 rounded-xl bg-[var(--action-blue)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
