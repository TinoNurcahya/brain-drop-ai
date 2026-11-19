/**
 * BrainDrop AI — Firebase AI Logic Runtime Execution Helper
 * Directly interfaces with Firebase AI Logic GenerativeModel
 */
import { getFirebaseApp, getCloudGenerativeModel } from "./firebase";

export interface FirebaseAIGenerateOptions {
  model?: string;
  responseMimeType?: string;
  temperature?: number;
}

export interface FirebaseAIResult {
  text: string;
  latencyMs: number;
  model: string;
  source: "firebase-ai-cloud" | "fallback-local";
}

/**
 * Execute Cloud Inference via official Firebase AI Logic SDK
 */
export async function executeFirebaseAI(
  prompt: string,
  options: FirebaseAIGenerateOptions = {}
): Promise<FirebaseAIResult> {
  const startTime = performance.now();
  const modelName = options.model || process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    const app = getFirebaseApp();
    const model = getCloudGenerativeModel(modelName, app);

    // Call Firebase AI Logic GenerativeModel runtime
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      text,
      latencyMs,
      model: modelName,
      source: "firebase-ai-cloud",
    };
  } catch (err) {
    console.warn("[Firebase AI Logic] Cloud execution note, falling back cleanly:", err);
    throw err;
  }
}
