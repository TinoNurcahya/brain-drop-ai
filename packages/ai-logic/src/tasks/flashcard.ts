import { executeTask } from "../router";
import type { AITaskResult, FlashCard } from "@braindrop/core";

export async function generateFlashcards(text: string, noteId: string): Promise<Omit<FlashCard, "id" | "userId">[]> {
  const result: AITaskResult = await executeTask({ type: "flashcard", input: text });
  try {
    const parsed = JSON.parse(result.output);
    return parsed.map((card: any) => ({
      noteId, question: card.question, answer: card.answer,
      difficulty: card.difficulty || "medium",
      nextReview: new Date(), correctCount: 0, incorrectCount: 0, createdAt: new Date(),
    }));
  } catch {
    return [{
      noteId, question: "What are the key points of this note?", answer: result.output,
      difficulty: "medium" as const, nextReview: new Date(), correctCount: 0, incorrectCount: 0, createdAt: new Date(),
    }];
  }
}
