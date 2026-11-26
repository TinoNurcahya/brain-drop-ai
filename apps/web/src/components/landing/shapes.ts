// Target point clouds for the particle field. All shapes live around z = 0,
// in world units where the camera (z = 10, fov 45) sees roughly 8.3 units tall.

export interface ShapeLayout {
  cx: number;
  cy: number;
  scale: number;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
}

function place(out: Float32Array, i: number, x: number, y: number, z: number, l: ShapeLayout) {
  out[i * 3] = l.cx + x * l.scale;
  out[i * 3 + 1] = l.cy + y * l.scale;
  out[i * 3 + 2] = z * l.scale;
}

/** A falling drop: the moment ideas are caught. */
export function dropShape(n: number, l: ShapeLayout) {
  const r = rng(11);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = Math.acos(1 - 2 * r());
    const p = r() * Math.PI * 2;
    const surface = r() < 0.82 ? 1 : Math.cbrt(r());
    const rad = 1.55 * (1 - Math.cos(t)) * Math.sin(t) * 0.78 * surface;
    place(out, i, rad * Math.cos(p), 2.2 * Math.cos(t) * surface + 0.2, rad * Math.sin(p), l);
  }
  return out;
}

/** Nodes and edges of a knowledge graph; edges are made of particles too. */
export function graphShape(n: number, l: ShapeLayout) {
  const r = rng(29);
  const nodes: [number, number, number][] = [];
  let guard = 0;
  while (nodes.length < 26 && guard++ < 4000) {
    const c: [number, number, number] = [(r() * 2 - 1) * 3.6, (r() * 2 - 1) * 2.6, (r() * 2 - 1) * 1.4];
    if ((c[0] / 3.6) ** 2 + (c[1] / 2.6) ** 2 > 1) continue;
    if (nodes.every((m) => Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2]) > 0.9)) nodes.push(c);
  }
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        if (!edges.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) edges.push([i, j]);
      });
  });
  const weights = nodes.map(() => 0.06 + r() * 0.14);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.4) {
      const k = Math.floor(r() * nodes.length);
      const w = weights[k];
      const [x, y, z] = nodes[k];
      place(out, i, x + gauss(r) * w, y + gauss(r) * w, z + gauss(r) * w, l);
    } else {
      const [a, b] = edges[Math.floor(r() * edges.length)];
      const t = r();
      const A = nodes[a];
      const B = nodes[b];
      place(
        out,
        i,
        A[0] + (B[0] - A[0]) * t + gauss(r) * 0.015,
        A[1] + (B[1] - A[1]) * t + gauss(r) * 0.015,
        A[2] + (B[2] - A[2]) * t,
        l
      );
    }
  }
  return out;
}

/** Three fanned memory cards with "text lines" drawn in particles. */
export function cardsShape(n: number, l: ShapeLayout) {
  const r = rng(47);
  const cards = [
    { x: -2.3, y: -0.15, z: -0.4, rot: 0.16 },
    { x: 0, y: 0.15, z: 0.4, rot: 0 },
    { x: 2.3, y: -0.15, z: -0.4, rot: -0.16 },
  ];
  const w = 2.0;
  const h = 2.8;
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = cards[i % 3];
    let x: number;
    let y: number;
    if (r() < 0.55) {
      const per = r() * 2 * (w + h);
      if (per < w) [x, y] = [per - w / 2, h / 2];
      else if (per < w + h) [x, y] = [w / 2, h / 2 - (per - w)];
      else if (per < 2 * w + h) [x, y] = [w / 2 - (per - w - h), -h / 2];
      else [x, y] = [-w / 2, -h / 2 + (per - 2 * w - h)];
    } else {
      const row = Math.floor(r() * 5);
      const len = row === 0 ? 1.1 : [1.55, 1.3, 1.5, 0.9][row - 1];
      x = -w / 2 + 0.22 + r() * len;
      y = h / 2 - 0.45 - row * 0.42 + gauss(r) * (row === 0 ? 0.03 : 0.012);
    }
    const cos = Math.cos(c.rot);
    const sin = Math.sin(c.rot);
    place(out, i, c.x + x * cos - y * sin, c.y + x * sin + y * cos, c.z, l);
  }
  return out;
}

/** Samples filled pixels of rendered text. */
export async function textShape(n: number, text: string, worldWidth: number, l: ShapeLayout) {
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.load('600 200px "Newsreader"');
    } catch {
      /* fall back to serif */
    }
  }
  const W = 1400;
  const H = 320;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const out = new Float32Array(n * 3);
  if (!ctx) return out;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '600 230px "Newsreader", Georgia, serif';
  ctx.fillText(text, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 3) {
    for (let x = 0; x < W; x += 3) {
      if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const r = rng(71);
  const count = pts.length / 2;
  for (let i = 0; i < n; i++) {
    if (!count) break;
    const k = Math.floor(r() * count) * 2;
    const x = (pts[k] / W - 0.5) * worldWidth;
    const y = -(pts[k + 1] / H - 0.5) * worldWidth * (H / W);
    place(out, i, x + (r() - 0.5) * 0.02, y + (r() - 0.5) * 0.02, (r() - 0.5) * 0.15, l);
  }
  return out;
}


/** Lines of text: the Notes module. */
export function linesShape(n: number, l: ShapeLayout) {
  const r = rng(83);
  const out = new Float32Array(n * 3);
  const lens = [3.7, 3.1, 3.5, 2.5, 3.3, 1.9];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(r() * lens.length);
    const x = -lens[row] / 2 + r() * lens[row];
    const y = 1.9 - row * 0.72 + gauss(r) * 0.012;
    place(out, i, x, y, (r() - 0.5) * 0.3, l);
  }
  return out;
}

/** Thin vertical ticks: the Activity module. */
export function gridShape(n: number, l: ShapeLayout) {
  const r = rng(97);
  const out = new Float32Array(n * 3);
  const ticks = 30;
  for (let i = 0; i < n; i++) {
    const t = Math.floor(r() * ticks);
    const h = 0.5 + (((t * 37) % 11) / 11) * 2.6;
    const x = -3.6 + t * (7.2 / (ticks - 1));
    const y = -1.5 + r() * h;
    place(out, i, x + gauss(r) * 0.01, y, (r() - 0.5) * 0.2, l);
  }
  return out;
}

/** Loose dust: the idle state of the Index field. */
export function dustShape(n: number, l: ShapeLayout) {
  const r = rng(131);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * 3.8;
    place(out, i, Math.cos(a) * rad * 1.1, Math.sin(a) * rad * 0.8, (r() - 0.5) * 2, l);
  }
  return out;
}
