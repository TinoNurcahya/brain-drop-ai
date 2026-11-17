/**
 * BrainDrop AI — Prompt Templates
 */

export const PROMPTS = {
  TAG: `You are a note tagging assistant. Given the following text, extract 3-5 relevant topic tags.
Return ONLY a JSON array of lowercase tag strings, no explanation.

Text:
{{INPUT}}

Tags:`,

  SUMMARIZE: `Summarize the following text in 2-3 concise sentences. Be direct and informative.

Text:
{{INPUT}}

Summary:`,

  SIMPLIFY: `Rewrite the following text in simpler, clearer language. Keep the same meaning but use shorter sentences and common words.

Text:
{{INPUT}}

Simplified:`,

  SYNTHESIZE: `You are a research synthesis assistant. Given the following notes, create a comprehensive research brief that:
1. Identifies common themes across all notes
2. Highlights key insights and findings
3. Notes any contradictions or gaps
4. Suggests areas for further research

Format the output as well-structured markdown with headings and bullet points.

Notes:
{{INPUT}}

Research Brief:`,

  FLASHCARD: `Generate study flashcards from the following text. Create 5-8 question-answer pairs that test understanding of the key concepts.

Return as a JSON array: [{"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}]

Text:
{{INPUT}}

Flashcards:`,

  EXPAND: `Expand the following brief note into a detailed, well-structured paragraph. Add relevant context, examples, and explanations while maintaining accuracy.

Brief note:
{{INPUT}}

Expanded:`,

  TRANSLATE: `Translate the following text to {{TARGET_LANGUAGE}}. Maintain the original meaning, tone, and formatting.

Text:
{{INPUT}}

Translation:`,
} as const;

export function fillPrompt(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}
