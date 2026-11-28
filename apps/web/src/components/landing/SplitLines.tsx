/** Splits lines into masked words for staggered reveals, with optional optical italic emphasis. */
export function SplitLines({
  lines,
  italicWords,
}: {
  lines: string[];
  italicWords?: string[];
}) {
  const italicSet = italicWords?.map((w) => w.toLowerCase());

  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="lp-line" aria-hidden="true">
          {line.split(" ").map((word, wi) => {
            const isItalic = italicSet?.includes(word.toLowerCase());
            return (
              <span key={wi} className="lp-word-mask">
                <span className="lp-word">
                  {isItalic ? <em className="lp-word-em">{word}</em> : word}&nbsp;
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}
