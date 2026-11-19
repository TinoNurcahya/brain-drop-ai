import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FlashcardItem {
  id: string;
  noteId: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  box: 1 | 2 | 3; // Leitner Box 1 (Daily), Box 2 (Every 3 Days), Box 3 (Mastered/Weekly)
  reviewsCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  createdAt: string;
}

const INITIAL_SEED_CARDS: FlashcardItem[] = [
  {
    id: "card-1",
    noteId: "note-1",
    topic: "Firebase AI Logic",
    question: "What is Firebase AI Logic Hybrid Inference?",
    answer: "A unified SDK architecture that executes AI prompts on-device with Gemini Nano when available, seamlessly falling back to cloud models (Gemini Flash) for high-context or complex tasks.",
    difficulty: "easy",
    box: 3,
    reviewsCount: 5,
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-2",
    noteId: "note-2",
    topic: "Chrome AI",
    question: "Why does Chrome Built-in AI (Prompt API) guarantee data privacy?",
    answer: "Inference executes entirely inside client device memory through Chrome's native languageModel API without sending plain text, tokens, or personal identifiers over the public network.",
    difficulty: "medium",
    box: 2,
    reviewsCount: 3,
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-3",
    noteId: "note-5",
    topic: "Learning Algorithms",
    question: "How does the Leitner spaced repetition system optimize long-term memory retention?",
    answer: "It sorts study cards into tiered review boxes (1 to 3). Difficult cards remain in Box 1 for frequent daily reviews, while mastered cards graduate to Box 3 with expanding review intervals.",
    difficulty: "medium",
    box: 1,
    reviewsCount: 1,
    lastReviewedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-4",
    noteId: "note-4",
    topic: "Knowledge Graph",
    question: "How do Coulomb's Law and Hooke's Law collaborate in force-directed graph layouts?",
    answer: "Coulomb's Law provides inverse-square repulsion between all nodes to prevent visual crowding, while Hooke's Law provides spring attraction between connected notes to cluster related topics.",
    difficulty: "hard",
    box: 2,
    reviewsCount: 2,
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-5",
    noteId: "note-6",
    topic: "Security & Privacy",
    question: "Which 6 entity classes are deterministically scrubbed by BrainDrop's client-side PII sanitizer?",
    answer: "Email addresses, API keys & secrets, credit card numbers, phone numbers (+62/US), National IDs (NIK/SSN), and IPv4 addresses before any network egress.",
    difficulty: "easy",
    box: 3,
    reviewsCount: 4,
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-6",
    noteId: "note-3",
    topic: "Architecture",
    question: "What is the primary constraint when passing props from a Server Component to a Client Component?",
    answer: "All arguments and props must be strictly JSON-serializable across the React serialization boundary (no functions, class instances, or circular references).",
    difficulty: "medium",
    box: 1,
    reviewsCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-7",
    noteId: "note-7",
    topic: "Web Extensions",
    question: "What is the key advantage of the Chrome Manifest V3 Side Panel API over legacy popups?",
    answer: "The side panel stays open persistently alongside the user's active browsing workflow without resetting state or requiring repeated reopening on tab clicks.",
    difficulty: "easy",
    box: 2,
    reviewsCount: 2,
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "card-8",
    noteId: "note-8",
    topic: "DevOps",
    question: "How does Turborepo achieve sub-second caching in multi-package monorepos?",
    answer: "By hashing file inputs, environment variables, and dependencies into content-addressed cache keys, bypassing rebuilds entirely when inputs are unchanged.",
    difficulty: "hard",
    box: 3,
    reviewsCount: 6,
    lastReviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

interface FlashcardsState {
  cards: FlashcardItem[];
  selectedTopic: string | null;
  selectedBoxFilter: number | null;

  // Actions
  setSelectedTopic: (topic: string | null) => void;
  setSelectedBoxFilter: (box: number | null) => void;
  addGeneratedCards: (
    noteId: string,
    topic: string,
    cards: Array<{ question: string; answer: string; difficulty: "easy" | "medium" | "hard" }>
  ) => void;
  addSingleCard: (
    card: Omit<FlashcardItem, "id" | "box" | "reviewsCount" | "createdAt">
  ) => void;
  deleteCard: (id: string) => void;
  recordReview: (id: string, rating: "again" | "good" | "easy") => void;
  resetDeckToSeeds: () => void;
}

export const useFlashcardStore = create<FlashcardsState>()(
  persist(
    (set) => ({
      cards: INITIAL_SEED_CARDS,
      selectedTopic: null,
      selectedBoxFilter: null,

      setSelectedTopic: (selectedTopic) => set({ selectedTopic }),
      setSelectedBoxFilter: (selectedBoxFilter) => set({ selectedBoxFilter }),

      addGeneratedCards: (noteId, topic, newCards) => {
        const timestamp = new Date().toISOString();
        const items: FlashcardItem[] = newCards.map((c, idx) => ({
          id: `card-${Date.now()}-${idx}`,
          noteId,
          topic,
          question: c.question,
          answer: c.answer,
          difficulty: c.difficulty,
          box: 1,
          reviewsCount: 0,
          nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          createdAt: timestamp,
        }));

        set((state) => ({
          cards: [...items, ...state.cards],
        }));
      },

      addSingleCard: (card) => {
        const newCard: FlashcardItem = {
          id: `card-${Date.now()}`,
          box: 1,
          reviewsCount: 0,
          nextReviewAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          createdAt: new Date().toISOString(),
          ...card,
        };

        set((state) => ({
          cards: [newCard, ...state.cards],
        }));
      },

      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
      },

      recordReview: (id, rating) => {
        const now = Date.now();
        set((state) => ({
          cards: state.cards.map((c) => {
            if (c.id !== id) return c;

            let nextBox: 1 | 2 | 3 = c.box;
            let intervalDays = 1;

            if (rating === "again") {
              nextBox = 1;
              intervalDays = 1;
            } else if (rating === "good") {
              nextBox = (Math.min(3, c.box + 1) as 1 | 2 | 3);
              intervalDays = nextBox === 2 ? 3 : 7;
            } else if (rating === "easy") {
              nextBox = 3;
              intervalDays = 7;
            }

            return {
              ...c,
              box: nextBox,
              reviewsCount: c.reviewsCount + 1,
              lastReviewedAt: new Date(now).toISOString(),
              nextReviewAt: new Date(now + 1000 * 60 * 60 * 24 * intervalDays).toISOString(),
            };
          }),
        }));
      },

      resetDeckToSeeds: () => {
        set({
          cards: INITIAL_SEED_CARDS,
          selectedTopic: null,
          selectedBoxFilter: null,
        });
      },
    }),
    {
      name: "braindrop_flashcards_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
