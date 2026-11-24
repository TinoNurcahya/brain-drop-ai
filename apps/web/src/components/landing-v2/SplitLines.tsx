/** Splits lines into masked words for staggered reveals. Screen readers get the parent's aria-label. */
export function SplitLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="v2-line" aria-hidden="true">
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="v2-word-mask">
              <span className="v2-word">{word}&nbsp;</span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
