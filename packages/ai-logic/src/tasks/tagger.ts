import { executeTask } from "../router";
import type { AITaskResult } from "@braindrop/core";

export async function autoTag(text: string): Promise<string[]> {
  const result: AITaskResult = await executeTask({ type: "tag", input: text });
  try { return JSON.parse(result.output); }
  catch { return result.output.split(",").map((t) => t.trim().toLowerCase()); }
}
