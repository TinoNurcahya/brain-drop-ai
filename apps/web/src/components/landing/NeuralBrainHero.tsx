"use client";

import dynamic from "next/dynamic";

const NeuralBrainCanvas = dynamic(
  () =>
    import("./NeuralBrainCanvas").then((mod) => mod.NeuralBrainCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="neural-brain-canvas-container neural-brain-loading-placeholder"
        aria-hidden="true"
      />
    ),
  }
);

export function NeuralBrainHero() {
  return <NeuralBrainCanvas />;
}
