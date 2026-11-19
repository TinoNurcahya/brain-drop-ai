"use client";

export interface SplitResult {
  words: HTMLSpanElement[];
  revert: () => void;
}

export function splitTextIntoWords(element: HTMLElement): SplitResult {
  const original = element.innerHTML;
  const words: HTMLSpanElement[] = [];

  // Handle <br> tags and <span> children by splitting around them
  const html = element.innerHTML;
  const parts = html.split(/(<br\s*\/?>|<span[^>]*>.*?<\/span>)/gi);

  element.innerHTML = "";

  parts.forEach((part) => {
    // Preserve <br> elements
    if (part.match(/<br\s*\/?>/i)) {
      element.appendChild(document.createElement("br"));
      return;
    }
    // Preserve existing <span> blocks (like .hero-accent) as a single word
    if (part.match(/^<span/i)) {
      const wrapper = document.createElement("span");
      wrapper.className = "split-word";
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";

      const inner = document.createElement("span");
      inner.className = "split-word-inner";
      inner.style.display = "inline-block";
      inner.innerHTML = part;

      wrapper.appendChild(inner);
      element.appendChild(wrapper);
      words.push(inner);
      return;
    }

    const textWords = part.trim().split(/\s+/).filter(Boolean);
    textWords.forEach((word, i) => {
      const wrapper = document.createElement("span");
      wrapper.className = "split-word";
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";

      const inner = document.createElement("span");
      inner.className = "split-word-inner";
      inner.style.display = "inline-block";
      inner.textContent = word;

      wrapper.appendChild(inner);
      element.appendChild(wrapper);
      words.push(inner);

      if (i < textWords.length - 1) {
        element.appendChild(document.createTextNode("\u00A0"));
      }
    });
  });

  return {
    words,
    revert: () => {
      element.innerHTML = original;
    },
  };
}
