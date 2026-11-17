/**
 * BrainDrop AI — Simulated Nano Execution
 */
import type { AITaskType } from "@braindrop/core";

interface SimulatedResponse {
  output: string;
  latencyMs: number;
}

const LATENCY = { min: 35, max: 120 };

function randomLatency(): number {
  return Math.floor(Math.random() * (LATENCY.max - LATENCY.min) + LATENCY.min);
}

const HANDLERS: Record<string, (input: string) => string> = {
  tag: (input) => {
    const keywords = input.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const tags = [...new Set(keywords.slice(0, 5))];
    return JSON.stringify(tags.length > 0 ? tags : ["general", "research"]);
  },
  summarize: (input) => {
    const sentences = input.split(/[.!?]+/).filter(Boolean);
    const summary = sentences.slice(0, 2).join(". ").trim();
    return summary ? summary + "." : "This note covers key research findings and insights.";
  },
  simplify: (input) => `Simplified: ${input.substring(0, 200)}${input.length > 200 ? "..." : ""}`,
  link: () => JSON.stringify({ related: true, reason: "Both discuss similar technical concepts" }),
  search: (input) => JSON.stringify({ query: input, results: [{ noteId: "demo-1", relevance: 0.92, snippet: "Matching content found..." }] }),
};

export async function simulateNano(taskType: AITaskType, input: string): Promise<SimulatedResponse> {
  const latency = randomLatency();
  await new Promise((resolve) => setTimeout(resolve, latency));
  const handler = HANDLERS[taskType];
  const output = handler ? handler(input) : `[Simulated ${taskType} response]`;
  return { output, latencyMs: latency };
}
