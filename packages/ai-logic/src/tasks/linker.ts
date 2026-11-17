import { executeTask } from "../router";

export async function findRelatedNotes(
  sourceText: string,
  candidateTexts: { noteId: string; text: string }[]
): Promise<{ noteId: string; reason: string; strength: number }[]> {
  const results: { noteId: string; reason: string; strength: number }[] = [];
  for (const candidate of candidateTexts.slice(0, 10)) {
    const result = await executeTask({
      type: "link",
      input: `Note A: ${sourceText.substring(0, 300)}\n\nNote B: ${candidate.text.substring(0, 300)}`,
    });
    try {
      const parsed = JSON.parse(result.output);
      if (parsed.related) {
        results.push({ noteId: candidate.noteId, reason: parsed.reason || "Related content", strength: 0.7 + Math.random() * 0.3 });
      }
    } catch { /* skip */ }
  }
  return results.sort((a, b) => b.strength - a.strength);
}
