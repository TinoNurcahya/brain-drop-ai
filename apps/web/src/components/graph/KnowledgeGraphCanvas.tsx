"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import type { NoteStoreItem } from "@/stores/notes-store";

export interface SimNode {
  id: string;
  noteId: string;
  title: string;
  tags: string[];
  isClip: boolean;
  summary?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  degree: number;
}

export interface SimEdge {
  id: string;
  source: string;
  target: string;
  sharedTags: string[];
  strength: number;
  isAiSuggested?: boolean;
}

interface KnowledgeGraphCanvasProps {
  notes: NoteStoreItem[];
  selectedTag: string | null;
  searchQuery: string;
  onSelectNode: (note: NoteStoreItem) => void;
  showAiLinks: boolean;
}

// Tag color palette generator
const TAG_COLORS = [
  "#4f8ff7", // Blue
  "#8b5cf6", // Purple
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

function getTagColor(tag?: string): string {
  if (!tag) return "#4f8ff7";
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function KnowledgeGraphCanvas({
  notes,
  selectedTag,
  searchQuery,
  onSelectNode,
  showAiLinks,
}: KnowledgeGraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const paletteRef = useRef({ grid: "#253640", label: "#111a21", text: "#adbdc7", primary: "#edf3f5", border: "#536b7a", edge: "#77b6ff", aiEdge: "#c3a0ef" });
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (name: string) => css.getPropertyValue(name).trim();
    paletteRef.current = { grid: read("--graph-grid"), label: read("--graph-label-bg"), text: read("--text-secondary"), primary: read("--text-primary"), border: read("--border-hover"), edge: read("--graph-edge"), aiEdge: read("--accent-purple") };
  }, [resolvedTheme]);

  // Transform / Pan & Zoom state
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const [zoomLevel, setZoomLevel] = useState(100);

  // Simulation references
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<SimEdge[]>([]);
  const hoveredNodeIdRef = useRef<string | null>(null);
  const draggedNodeRef = useRef<SimNode | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // 1. Build Nodes and Edges from Notes
  useEffect(() => {
    if (notes.length === 0) {
      nodesRef.current = [];
      edgesRef.current = [];
      return;
    }

    // World coordinates are centered at zero; the view transform supplies the screen center.
    const centerX = 0;
    const centerY = 0;

    // Preserve existing node positions if re-rendering
    const existingNodeMap = new Map<string, SimNode>();
    for (const n of nodesRef.current) {
      existingNodeMap.set(n.id, n);
    }

    // Build SimNodes
    const newNodes: SimNode[] = notes.map((note, idx) => {
      const existing = existingNodeMap.get(note.id);
      const angle = (idx / notes.length) * Math.PI * 2;
      const dist = 120 + Math.random() * 100;

      const primaryTag = note.tags?.[0] || "";
      const baseRadius = note.isClip ? 18 : 22;

      return {
        id: note.id,
        noteId: note.id,
        title: note.title || "Untitled",
        tags: note.tags || [],
        isClip: Boolean(note.isClip),
        summary: note.summary,
        x: existing?.x ?? centerX + Math.cos(angle) * dist,
        y: existing?.y ?? centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: baseRadius,
        color: getTagColor(primaryTag),
        degree: 0,
      };
    });

    // Build SimEdges based on shared tags & explicit linkedNoteIds
    const newEdges: SimEdge[] = [];
    const edgeKeySet = new Set<string>();

    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const noteA = notes[i];
        const noteB = notes[j];

        // 1. Check shared tags
        const shared = (noteA.tags || []).filter((t) =>
          (noteB.tags || []).includes(t)
        );

        // 2. Check explicit links
        const isExplicitLink =
          noteA.linkedNoteIds?.includes(noteB.id) ||
          noteB.linkedNoteIds?.includes(noteA.id);

        if (shared.length > 0 || isExplicitLink) {
          const edgeId = `${noteA.id}-${noteB.id}`;
          edgeKeySet.add(edgeId);

          newEdges.push({
            id: edgeId,
            source: noteA.id,
            target: noteB.id,
            sharedTags: shared,
            strength: isExplicitLink ? 2.5 : Math.min(shared.length, 3),
            isAiSuggested: false,
          });

          newNodes[i].degree += 1;
          newNodes[j].degree += 1;
        }
      }
    }

    // AI Semantic Link Suggestions (Synthesize conceptual links between related topics)
    if (showAiLinks && newNodes.length >= 2) {
      // Connect nodes that share conceptual affinity even without strict matching tag strings
      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          const edgeId = `${newNodes[i].id}-${newNodes[j].id}`;
          const reverseId = `${newNodes[j].id}-${newNodes[i].id}`;
          if (!edgeKeySet.has(edgeId) && !edgeKeySet.has(reverseId)) {
            // Check cross-conceptual keywords in summary
            const textA = (newNodes[i].summary || newNodes[i].title).toLowerCase();
            const textB = (newNodes[j].summary || newNodes[j].title).toLowerCase();

            const commonKeywords = ["ai", "hybrid", "gemini", "model", "graph", "data", "browser"].filter(
              (kw) => textA.includes(kw) && textB.includes(kw)
            );

            if (commonKeywords.length > 0) {
              newEdges.push({
                id: `ai-${edgeId}`,
                source: newNodes[i].id,
                target: newNodes[j].id,
                sharedTags: commonKeywords,
                strength: 1,
                isAiSuggested: true,
              });
              newNodes[i].degree += 1;
              newNodes[j].degree += 1;
              edgeKeySet.add(edgeId);
            }
          }
        }
      }
    }

    // Adjust radius by degree
    for (const node of newNodes) {
      node.radius = Math.min(32, node.radius + node.degree * 2);
    }

    nodesRef.current = newNodes;
    edgesRef.current = newEdges;
  }, [notes, showAiLinks]);

  // 2. Physics Simulation Loop & Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    // Handle high DPI display
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Initial center transform
    if (transformRef.current.x === 0 && transformRef.current.y === 0) {
      const rect = canvas.getBoundingClientRect();
      transformRef.current.x = rect.width / 2;
      transformRef.current.y = rect.height / 2;
    }

    const stepSimulation = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const centerX = 0;
      const centerY = 0;

      // Force calculations
      const nodeMap = new Map<string, SimNode>();
      for (const n of nodes) nodeMap.set(n.id, n);

      // 1. Repulsion between all node pairs (Coulomb force)
      const repulsionK = 2800;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const na = nodes[i];
          const nb = nodes[j];
          const dx = nb.x - na.x;
          const dy = nb.y - na.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 400) {
            const force = (repulsionK / (dist * dist)) * 0.8;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNodeRef.current !== na) {
              na.vx -= fx;
              na.vy -= fy;
            }
            if (draggedNodeRef.current !== nb) {
              nb.vx += fx;
              nb.vy += fy;
            }
          }
        }
      }

      // 2. Spring attraction along edges (Hooke's force)
      const restLength = 110;
      for (const edge of edges) {
        const na = nodeMap.get(edge.source);
        const nb = nodeMap.get(edge.target);
        if (!na || !nb) continue;

        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const displacement = dist - restLength;
        const springForce = displacement * 0.04 * edge.strength;

        const fx = (dx / dist) * springForce;
        const fy = (dy / dist) * springForce;

        if (draggedNodeRef.current !== na) {
          na.vx += fx;
          na.vy += fy;
        }
        if (draggedNodeRef.current !== nb) {
          nb.vx -= fx;
          nb.vy -= fy;
        }
      }

      // 3. Weak centering gravity pull
      for (const node of nodes) {
        if (draggedNodeRef.current === node) continue;

        const cdx = centerX - node.x;
        const cdy = centerY - node.y;
        node.vx += cdx * 0.003;
        node.vy += cdy * 0.003;

        // Friction damping
        node.vx *= 0.82;
        node.vy *= 0.82;

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;
      }

      // Render frame
      render();

      if (isRunning) {
        animFrameIdRef.current = requestAnimationFrame(stepSimulation);
      }
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.save();
      // Apply pan & zoom
      const { x: panX, y: panY, scale } = transformRef.current;
      ctx.translate(panX, panY);
      ctx.scale(scale, scale);

      // Draw subtle background grid dots
      const gridSpacing = 40;
      const startX = Math.floor((-panX / scale) / gridSpacing) * gridSpacing - gridSpacing;
      const endX = startX + (rect.width / scale) + gridSpacing * 2;
      const startY = Math.floor((-panY / scale) / gridSpacing) * gridSpacing - gridSpacing;
      const endY = startY + (rect.height / scale) + gridSpacing * 2;

      ctx.fillStyle = paletteRef.current.grid;
      for (let gx = startX; gx < endX; gx += gridSpacing) {
        for (let gy = startY; gy < endY; gy += gridSpacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const nodeMap = new Map<string, SimNode>();
      for (const n of nodes) nodeMap.set(n.id, n);

      const hoveredId = hoveredNodeIdRef.current;
      const hasFilter = Boolean(selectedTag || searchQuery);

      // Collect active 1-hop neighbor ids if a node is hovered
      const activeNeighborIds = new Set<string>();
      if (hoveredId) {
        activeNeighborIds.add(hoveredId);
        for (const e of edges) {
          if (e.source === hoveredId) activeNeighborIds.add(e.target);
          if (e.target === hoveredId) activeNeighborIds.add(e.source);
        }
      }

      // Draw Edges
      for (const edge of edges) {
        const na = nodeMap.get(edge.source);
        const nb = nodeMap.get(edge.target);
        if (!na || !nb) continue;

        const isConnectedToHovered =
          hoveredId && (edge.source === hoveredId || edge.target === hoveredId);

        let opacity = 0.25;
        let strokeColor = paletteRef.current.edge;
        let lineWidth = Math.max(1, edge.strength * 0.8);

        if (edge.isAiSuggested) {
          strokeColor = paletteRef.current.aiEdge;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }

        if (hoveredId) {
          if (isConnectedToHovered) {
            opacity = 0.9;
            lineWidth = 2.5;
            strokeColor = edge.isAiSuggested ? paletteRef.current.aiEdge : paletteRef.current.edge;
          } else {
            opacity = 0.05;
          }
        }

        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();

        // Reset line dash
        ctx.setLineDash([]);
      }

      ctx.globalAlpha = 1;

      // Draw Nodes
      for (const node of nodes) {
        const isHovered = node.id === hoveredId;
        const isConnected = activeNeighborIds.has(node.id);

        // Check search/tag match
        let isMatched = true;
        if (selectedTag && !node.tags.includes(selectedTag)) {
          isMatched = false;
        }
        if (
          searchQuery &&
          !node.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          isMatched = false;
        }

        let nodeAlpha = 1;
        if (hoveredId) {
          nodeAlpha = isConnected ? 1 : 0.15;
        } else if (hasFilter) {
          nodeAlpha = isMatched ? 1 : 0.2;
        }

        ctx.save();
        ctx.globalAlpha = nodeAlpha;

        // Outer Glow
        const glowRadius = node.radius + (isHovered ? 12 : 6);
        const glowGrad = ctx.createRadialGradient(
          node.x, node.y, node.radius * 0.5,
          node.x, node.y, glowRadius
        );
        glowGrad.addColorStop(0, node.color);
        glowGrad.addColorStop(1, "transparent");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node Body
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Border ring
        ctx.strokeStyle = isHovered ? paletteRef.current.primary : paletteRef.current.border;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Node Icon/Badge (Clip 📎 indicator)
        if (node.isClip) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("📎", node.x, node.y);
        }

        // Node Title Label
        ctx.font = isHovered ? "bold 14px system-ui, sans-serif" : "14px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        // Text background pill
        const labelText = node.title.length > 22 ? node.title.slice(0, 20) + "..." : node.title;
        const textWidth = ctx.measureText(labelText).width;
        const labelY = node.y + node.radius + 6;

        ctx.fillStyle = paletteRef.current.label;
        ctx.fillRect(
          node.x - textWidth / 2 - 4,
          labelY - 1,
          textWidth + 8,
          19
        );

        ctx.fillStyle = isHovered ? paletteRef.current.primary : paletteRef.current.text;
        ctx.fillText(labelText, node.x, labelY);

        ctx.restore();
      }

      ctx.restore();
    };

    animFrameIdRef.current = requestAnimationFrame(stepSimulation);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedTag, searchQuery]);

  // Coordinate helper: Screen (Canvas) to Simulation World space
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const { x: panX, y: panY, scale } = transformRef.current;
    return {
      x: (screenX - panX) / scale,
      y: (screenY - panY) / scale,
    };
  }, []);

  // Find node under pointer
  const getNodeAtPoint = useCallback((worldX: number, worldY: number) => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (dx * dx + dy * dy <= node.radius * node.radius + 64) {
        return node;
      }
    }
    return null;
  }, []);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    const clickedNode = getNodeAtPoint(world.x, world.y);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
    } else {
      isPanningRef.current = true;
      panStartRef.current = {
        x: screenX - transformRef.current.x,
        y: screenY - transformRef.current.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = world.x;
      draggedNodeRef.current.y = world.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (isPanningRef.current) {
      transformRef.current.x = screenX - panStartRef.current.x;
      transformRef.current.y = screenY - panStartRef.current.y;
      return;
    }

    // Check hover
    const hoveredNode = getNodeAtPoint(world.x, world.y);
    hoveredNodeIdRef.current = hoveredNode?.id || null;
    canvas.style.cursor = hoveredNode ? "pointer" : "grab";
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    if (draggedNodeRef.current) {
      const clicked = draggedNodeRef.current;
      draggedNodeRef.current = null;

      // Detect if it was a quick click vs a drag
      const originalNote = notes.find((n) => n.id === clicked.id);
      if (originalNote) {
        onSelectNode(originalNote);
      }
    }

    isPanningRef.current = false;
    canvas.style.cursor = "default";
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newScale = Math.min(Math.max(0.35, transformRef.current.scale * zoomFactor), 3);

    // Zoom centered around mouse pointer
    const currentScale = transformRef.current.scale;
    transformRef.current.x = mouseX - (mouseX - transformRef.current.x) * (newScale / currentScale);
    transformRef.current.y = mouseY - (mouseY - transformRef.current.y) * (newScale / currentScale);
    transformRef.current.scale = newScale;

    setZoomLevel(Math.round(newScale * 100));
  };

  // Zoom controls
  const handleZoom = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const currentScale = transformRef.current.scale;
    const newScale = Math.min(Math.max(0.35, currentScale * factor), 3);

    transformRef.current.x = centerX - (centerX - transformRef.current.x) * (newScale / currentScale);
    transformRef.current.y = centerY - (centerY - transformRef.current.y) * (newScale / currentScale);
    transformRef.current.scale = newScale;

    setZoomLevel(Math.round(newScale * 100));
  };

  const handleResetView = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    transformRef.current = {
      x: rect.width / 2,
      y: rect.height / 2,
      scale: 1,
    };
    setZoomLevel(100);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--bg-secondary)] select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block"
      />

      {/* Floating Canvas Controls (clear of the telemetry panel) */}
      <div className="absolute bottom-5 left-5 flex items-center gap-1.5 p-1.5 rounded-xl bg-[var(--bg-card)]/90 border border-[var(--border)] shadow-xl backdrop-blur-md">
        <button
          onClick={() => handleZoom(1.2)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
        <span className="text-[11px] font-mono text-[var(--text-muted)] px-1.5 min-w-[45px] text-center">
          {zoomLevel}%
        </span>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <Minus size={18} aria-hidden="true" />
        </button>
        <div className="w-[1px] h-4 bg-[var(--border)] mx-0.5" />
        <button
          onClick={handleResetView}
          className="px-2 py-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Center View"
        >
          Reset
        </button>
      </div>

      {/* Canvas Watermark / Hint */}
      <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-[var(--text-muted)] bg-[var(--bg-primary)]/70 px-3 py-1.5 rounded-lg border border-[var(--border)]/50 backdrop-blur-sm">
        💡 Drag nodes to rearrange • Scroll to zoom • Drag background to pan
      </div>
    </div>
  );
}
