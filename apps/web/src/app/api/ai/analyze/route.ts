import { NextRequest, NextResponse } from "next/server";

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

    const apiKey = process.env.GEMINI_API_KEY;

    // Cloud AI execution if API Key is configured
    if (apiKey) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const systemPrompt = `You are BrainDrop AI, an intelligent executive note analyzer.
Analyze the following user note and return a strict JSON object with:
- "summary": A concise 1-2 sentence executive summary capturing the core insight.
- "tags": Array of 3-5 relevant lowercase tags (slug-friendly, e.g. "hybrid-ai", "typescript").
- "keyInsights": Array of 2-3 bullet point takeaways.
- "suggestedLinks": Array of conceptual topic names related to this note.

Do not output markdown codeblocks, only pure JSON.`;

      const promptText = `Title: ${title || "Untitled"}\n\nContent:\n${content.slice(0, 8000)}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: promptText },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        const candidateText =
          jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          try {
            const parsed = JSON.parse(candidateText);
            const latencyMs = Math.round(performance.now() - startTime);

            const result: AIAnalysisResponse = {
              summary: parsed.summary || "",
              tags: Array.isArray(parsed.tags) ? parsed.tags : [],
              keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
              suggestedLinks: Array.isArray(parsed.suggestedLinks) ? parsed.suggestedLinks : [],
              mode: "cloud",
              model,
              latencyMs,
            };

            return NextResponse.json(result);
          } catch {
            // JSON parse failed, proceed to heuristic
          }
        }
      }
    }

    // Heuristic Fallback
    const heuristic = analyzeHeuristically(content, title, existingTags);
    const latencyMs = Math.round(performance.now() - startTime);

    const result: AIAnalysisResponse = {
      ...heuristic,
      mode: "heuristic",
      model: "local-heuristic-engine",
      latencyMs,
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
