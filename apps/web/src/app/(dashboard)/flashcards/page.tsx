"use client";

import { useState } from "react";

interface DemoCard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

const DEMO_CARDS: DemoCard[] = [
  { id: "1", question: "What is Firebase AI Logic Hybrid Inference?", answer: "A single SDK that runs AI prompts on-device (Gemini Nano) when available and falls back to cloud (Gemini Flash) when it isn't, providing privacy and reliability.", difficulty: "easy", topic: "Firebase" },
  { id: "2", question: "Why should PII-sensitive tasks run on-device?", answer: "On-device inference keeps personal data in the browser's memory without sending it over the network, ensuring zero data leakage and compliance with privacy regulations.", difficulty: "medium", topic: "Privacy" },
  { id: "3", question: "What is the Leitner system for spaced repetition?", answer: "A learning method using numbered boxes (1-5). Correct answers move cards up, incorrect ones return to box 1. Higher boxes have longer review intervals.", difficulty: "medium", topic: "Learning" },
  { id: "4", question: "When does the Hybrid Router send a task to the cloud?", answer: "Tasks requiring deep reasoning (synthesis, flashcard generation, translation) or large context windows are routed to cloud. Privacy-sensitive tasks always stay on-device.", difficulty: "hard", topic: "Architecture" },
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const card = DEMO_CARDS[currentIndex];

  const handleAnswer = (correct: boolean) => {
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1) % DEMO_CARDS.length);
  };

  const difficultyColor = {
    easy: "var(--accent-emerald)",
    medium: "var(--accent-amber)",
    hard: "var(--accent-rose)",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">🃏 Flashcards</h1>
          <p className="text-sm text-[var(--text-muted)]">
            AI-generated study cards from your notes
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-medium">
          Generate from Note
        </button>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="text-center">
          <span className="text-2xl font-bold text-[var(--accent-emerald)]">{score.correct}</span>
          <p className="text-xs text-[var(--text-muted)]">Correct</p>
        </div>
        <div className="text-center">
          <span className="text-lg text-[var(--text-muted)]">
            {currentIndex + 1} / {DEMO_CARDS.length}
          </span>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-[var(--accent-rose)]">{score.incorrect}</span>
          <p className="text-xs text-[var(--text-muted)]">Incorrect</p>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-lg aspect-[3/2] rounded-2xl glass p-8 flex flex-col items-center justify-center text-center hover:border-[var(--border-hover)] transition-all"
          style={{
            boxShadow: `0 0 30px ${difficultyColor[card.difficulty]}15`,
          }}
        >
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full mb-4"
            style={{
              background: `${difficultyColor[card.difficulty]}15`,
              color: difficultyColor[card.difficulty],
            }}
          >
            {card.difficulty.toUpperCase()} • {card.topic}
          </span>

          {!isFlipped ? (
            <>
              <p className="text-lg font-medium mb-6">{card.question}</p>
              <span className="text-xs text-[var(--text-muted)]">Click to reveal answer</span>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{card.answer}</p>
            </>
          )}
        </button>
      </div>

      {/* Action buttons */}
      {isFlipped && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleAnswer(false)}
            className="px-6 py-3 rounded-xl bg-[var(--accent-rose)]/10 text-[var(--accent-rose)] border border-[var(--accent-rose)]/30 font-medium hover:bg-[var(--accent-rose)]/20 transition-colors"
          >
            ❌ Incorrect
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="px-6 py-3 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/30 font-medium hover:bg-[var(--accent-emerald)]/20 transition-colors"
          >
            ✅ Correct
          </button>
        </div>
      )}

      {/* All cards list */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">All Cards ({DEMO_CARDS.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEMO_CARDS.map((c) => (
            <div key={c.id} className="glass rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">{c.topic}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: `${difficultyColor[c.difficulty]}15`,
                    color: difficultyColor[c.difficulty],
                  }}
                >
                  {c.difficulty}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{c.question}</p>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{c.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
