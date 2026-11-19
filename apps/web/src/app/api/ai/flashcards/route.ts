import { NextRequest, NextResponse } from "next/server";
import { executeFirebaseAI } from "@/lib/firebase-ai";
import { sanitize } from "@braindrop/core";

interface FlashcardResponseItem {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

// Fallback heuristic question & answer generator when no API key is configured
function extractHeuristicFlashcards(
  title: string,
  content: string
): FlashcardResponseItem[] {
  const cards: FlashcardResponseItem[] = [];
  const clean = content.replace(/[`*_[\]]/g, "").trim();
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  // 1. Definition card from title and first paragraph
  const firstParagraph = lines.find((l) => !l.startsWith("#") && l.length > 25);
  if (firstParagraph) {
    cards.push({
      question: `What is the core concept and purpose of "${title}"?`,
      answer: firstParagraph.slice(0, 220),
      difficulty: "easy",
    });
  }

  // 2. Heading-based questions
  const headings = lines.filter((l) => l.startsWith("#"));
  for (const h of headings.slice(0, 2)) {
    const cleanHeading = h.replace(/#+\s*/, "");
    cards.push({
      question: `Explain the key considerations regarding "${cleanHeading}" in ${title}.`,
      answer: `It covers foundational principles and runtime specifications detailed in the research notes.`,
      difficulty: "medium",
    });
  }

  // 3. Bullet points takeaways
  const bulletPoints = lines.filter((l) => l.startsWith("-") || l.startsWith("*"));
  if (bulletPoints.length >= 2) {
    cards.push({
      question: `What are two critical operational takeaways noted in ${title}?`,
      answer: bulletPoints.slice(0, 2).map((b) => b.replace(/^[-*]\s*/, "")).join("; "),
      difficulty: "hard",
    });
  }

  if (cards.length === 0) {
    cards.push({
      question: `What is the key takeaway from ${title}?`,
      answer: clean.slice(0, 180) || "Study note review card.",
      difficulty: "easy",
    });
  }

  return cards;
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required to generate flashcards." },
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

    const systemPrompt = `You are BrainDrop AI Study Assistant powered by Firebase AI Logic.
Analyze the note provided and generate 3 to 5 high-yield study flashcards for spaced repetition.
Return a strict JSON object with a single key "cards" containing an array of objects:
[
  {
    "question": "Clear, concise conceptual question",
    "answer": "Direct, informative answer (1-2 sentences)",
    "difficulty": "easy" | "medium" | "hard"
  }
]
Do not include markdown wrappers, only pure JSON.`;

    const promptText = `${systemPrompt}\n\nNote Title: ${safeTitle}\n\nContent:\n${safeContent.slice(0, 7000)}`;

    // 1. Official Firebase AI Logic Cloud Generation
    try {
      const fbResult = await executeFirebaseAI(promptText, {
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      });

      if (fbResult.text) {
        try {
          const cleanJson = fbResult.text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          const cardsArray = Array.isArray(parsed.cards) ? parsed.cards : parsed;
          if (Array.isArray(cardsArray) && cardsArray.length > 0) {
            return NextResponse.json({
              success: true,
              cards: cardsArray,
              source: `firebase-ai/${fbResult.model}`,
              piiSanitized: piiDetected,
              redactedEntitiesCount: totalRedacted,
            });
          }
        } catch {}
      }
    } catch {
      // Graceful fallback to heuristic
    }

    // Fallback to local heuristic extractor
    const cards = extractHeuristicFlashcards(safeTitle || "Study Note", safeContent);

    return NextResponse.json({
      success: true,
      cards,
      source: "local-heuristic",
      piiSanitized: piiDetected,
      redactedEntitiesCount: totalRedacted,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
