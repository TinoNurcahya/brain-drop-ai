"use client";

const DEMO_NODES = [
  { id: "1", label: "Firebase AI Logic", x: 400, y: 200, color: "#f59e0b", size: 60 },
  { id: "2", label: "Hybrid Inference", x: 300, y: 350, color: "#8b5cf6", size: 50 },
  { id: "3", label: "Gemini Nano 4", x: 200, y: 250, color: "#10b981", size: 45 },
  { id: "4", label: "React Flow", x: 550, y: 300, color: "#4f8ff7", size: 40 },
  { id: "5", label: "Knowledge Graph", x: 500, y: 150, color: "#4f8ff7", size: 50 },
  { id: "6", label: "Spaced Repetition", x: 150, y: 400, color: "#f43f5e", size: 35 },
  { id: "7", label: "Tiptap Editor", x: 600, y: 400, color: "#8b5cf6", size: 35 },
];

const DEMO_EDGES = [
  { source: "1", target: "2" },
  { source: "1", target: "3" },
  { source: "1", target: "5" },
  { source: "2", target: "3" },
  { source: "4", target: "5" },
  { source: "5", target: "7" },
  { source: "3", target: "6" },
];

export default function GraphPage() {
  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-xl font-bold">🕸️ Knowledge Graph</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {DEMO_NODES.length} nodes • {DEMO_EDGES.length} connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs glass hover:border-[var(--border-hover)]">
            🔍 Find Related
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30">
            ✨ AI Suggest Links
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative bg-[var(--bg-secondary)] overflow-hidden">
        <svg className="w-full h-full">
          {/* Edges */}
          {DEMO_EDGES.map((edge, i) => {
            const source = DEMO_NODES.find((n) => n.id === edge.source);
            const target = DEMO_NODES.find((n) => n.id === edge.target);
            if (!source || !target) return null;
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="var(--border)"
                strokeWidth={1.5}
                opacity={0.6}
              />
            );
          })}

          {/* Nodes */}
          {DEMO_NODES.map((node) => (
            <g key={node.id} className="cursor-pointer">
              {/* Glow */}
              <circle cx={node.x} cy={node.y} r={node.size / 2 + 8} fill={node.color} opacity={0.1} />
              {/* Node */}
              <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} opacity={0.8} />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + node.size / 2 + 16}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize={11}
                fontWeight={500}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 glass rounded-xl p-4 max-w-xs">
          <p className="text-xs text-[var(--text-muted)] mb-2">
            💡 React Flow integration coming soon. This is a static SVG preview of the knowledge graph concept.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Click a node to open the note. AI suggests new connections between related topics.
          </p>
        </div>
      </div>
    </div>
  );
}
