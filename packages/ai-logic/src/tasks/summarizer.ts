import { executeTask } from "../router";
import type { AITaskResult } from "@braindrop/core";

export async function summarize(text: string): Promise<{ summary: string; mode: string }> {
  const result: AITaskResult = await executeTask({ type: "summarize", input: text });
  return { summary: result.output, mode: result.mode };
}

export async function simplify(text: string): Promise<{ simplified: string; mode: string }> {
  const result: AITaskResult = await executeTask({ type: "simplify", input: text });
  return { simplified: result.output, mode: result.mode };
}

export async function expand(text: string): Promise<{ expanded: string; mode: string }> {
  const result: AITaskResult = await executeTask({ type: "expand", input: text });
  return { expanded: result.output, mode: result.mode };
}
