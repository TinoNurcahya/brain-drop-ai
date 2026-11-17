import { executeTask } from "../router";
import type { AITaskResult } from "@braindrop/core";

export async function synthesize(noteTexts: string[]): Promise<{ brief: string; mode: string }> {
  const combined = noteTexts.map((t, i) => `--- Note ${i + 1} ---\n${t}`).join("\n\n");
  const result: AITaskResult = await executeTask({ type: "synthesize", input: combined });
  return { brief: result.output, mode: result.mode };
}
