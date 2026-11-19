import { NextRequest, NextResponse } from "next/server";
import { executeFirebaseAI } from "@/lib/firebase-ai";
import { sanitize } from "@braindrop/core";

interface AnalyzePayload {
  title?: string;
  content: string;
  existingTags?: string[];
}

interface AIAnalysisResponse {
  summary: string;
  tags: string[];
  keyInsights: string[];
  suggestedLinks: string[];
  mode: "cloud" | "heuristic";
  model: string;
  latencyMs: number;
  piiSanitized?: boolean;
  redactedEntitiesCount?: number;
}

// Fallback heuristic analyzer when GEMINI_API_KEY is not set
function analyzeHeuristically(content: string, title?: string, existingTags: string[] = []): {
  summary: string;
  tags: string[];
  keyInsights: string[];
  suggestedLinks: string[];
} {
  const clean = content.replace(/#+\s/g, "").replace(/[`*_[\]]/g, "").trim();
  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15);

  // Summary: First 1-2 prominent sentences
  const summary =
    sentences.length > 0
      ? sentences.slice(0, 2).join(". ") + "."
      : `${title || "Note"} overview with key concepts recorded.`;

  // Keywords extraction for tags
  const stopWords = new Set([
    "the", "and", "this", "that", "with", "from", "for", "have", "with",
    "will", "about", "using", "into", "been", "which", "more", "also",
    "some", "when", "their", "what", "then", "them", "these", "your",
  ]);

  const words = clean
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const freqMap: Record<string, number> = {};
  for (const w of words) {
    freqMap[w] = (freqMap[w] || 0) + 1;
  }

  const sortedTags = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, 5);

  const combinedTags = Array.from(new Set([...existingTags, ...sortedTags])).slice(0, 6);

  const keyInsights = sentences.slice(0, 3);

  return {
    summary,
    tags: combinedTags.length > 0 ? combinedTags : ["general", "notes"],
    keyInsights,
    suggestedLinks: [],
  };
}

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = (await req.json()) as AnalyzePayload;
    const { content, title, existingTags = [] } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required for analysis." },
        { status: 400 }
      );
    }

    // Client Privacy Sandbox: Deterministic PII Sanitization prior to cloud egress
    const sanitizedContentResult = sanitize(content);
    const sanitizedTitleResult = title
      ? sanitize(title)
      : { sanitized: "Untitled", redactions: [], containsPII: false };
    const safeContent = sanitizedContentResult.sanitized;
    const safeTitle = sanitizedTitleResult.sanitized;
    const piiDetected = sanitizedContentResult.containsPII || sanitizedTitleResult.containsPII;
    const totalRedacted =
      sanitizedContentResult.redactions.length + sanitizedTitleResult.redactions.length;

    const systemPrompt = `You are BrainDrop AI, an intelligent executive note analyzer built with Firebase AI Logic.
Analyze the following user note and return a strict JSON object with:
- "summary": A concise 1-2 sentence executive summary capturing the core insight.
- "tags": Array of 3-5 relevant lowercase tags (slug-friendly, e.g. "hybrid-ai", "typescript").
- "keyInsights": Array of 2-3 bullet point takeaways.
- "suggestedLinks": Array of conceptual topic names related to this note.

Do not output markdown codeblocks, only pure JSON.`;

    const promptText = `${systemPrompt}\n\nTitle: ${safeTitle}\n\nContent:\n${safeContent.slice(0, 8000)}`;

    // 1. Official Firebase AI Logic Runtime Execution
    try {
      const fbResult = await executeFirebaseAI(promptText, {
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      });

      if (fbResult.text) {
        try {
          const cleanJson = fbResult.text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          const latencyMs = Math.round(performance.now() - startTime);

          const result: AIAnalysisResponse = {
            summary: parsed.summary || "",
            tags: Array.isArray(parsed.tags) ? parsed.tags : [],
            keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
            suggestedLinks: Array.isArray(parsed.suggestedLinks) ? parsed.suggestedLinks : [],
            mode: "cloud",
            model: `firebase-ai/${fbResult.model}`,
            latencyMs,
            piiSanitized: piiDetected,
            redactedEntitiesCount: totalRedacted,
          };

          return NextResponse.json(result);
        } catch {
          // JSON parsing failed, proceed to fallback
        }
      }
    } catch {
      // Firebase AI call gracefully falls back to local heuristic
    }

    // Heuristic Fallback
    const heuristic = analyzeHeuristically(safeContent, safeTitle, existingTags);
    const latencyMs = Math.round(performance.now() - startTime);

    const result: AIAnalysisResponse = {
      ...heuristic,
      mode: "heuristic",
      model: "local-heuristic-engine",
      latencyMs,
      piiSanitized: piiDetected,
      redactedEntitiesCount: totalRedacted,
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
