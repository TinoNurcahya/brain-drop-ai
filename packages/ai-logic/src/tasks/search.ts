import { executeTask } from "../router";
import type { AITaskResult } from "@braindrop/core";

export interface SearchResult {
  noteId: string;
  relevance: number;
  snippet: string;
}

export async function semanticSearch(query: string, notes: { id: string; plainText: string }[]): Promise<SearchResult[]> {
  const result: AITaskResult = await executeTask({
    type: "search", input: query,
    context: notes.map((n) => `[${n.id}] ${n.plainText.substring(0, 200)}`).join("\n"),
  });
  try {
    const parsed = JSON.parse(result.output);
    return parsed.results || [];
  } catch {
    return notes
      .filter((n) => n.plainText.toLowerCase().includes(query.toLowerCase()))
      .map((n) => ({ noteId: n.id, relevance: 0.5, snippet: n.plainText.substring(0, 150) }));
  }
}
