"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useLocale } from "@/components/layout/LocaleProvider";
import { RollingText } from "@/components/ui/RollingText";

const CLUSTER_CENTERS: [number, number, number][] = [
  [-2.15, 0.72, 0.45],
  [2.1, 0.78, -0.35],
  [-1.65, -1.05, -0.45],
  [1.95, -0.92, 0.48],
];

const NODES_PER_CLUSTER = 18;
const TOTAL_NODES = CLUSTER_CENTERS.length * NODES_PER_CLUSTER;

const NODE_VERTEX_SHADER = /* glsl */ `
  attribute float aCluster;
  attribute float aPhase;
  attribute float aSize;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uActiveCluster;

  varying float vCluster;
  varying float vAlpha;
  varying float vBoost;

  void main() {
    vCluster = aCluster;
    bool isAll = uActiveCluster < -0.5;
    bool isMatch = !isAll && abs(aCluster - uActiveCluster) < 0.25;

    vBoost = isMatch ? 1.0 : (isAll ? 0.65 : 0.15);
    vAlpha = isMatch ? 1.0 : (isAll ? 0.88 : 0.26);

    vec3 pos = position;
    float wave = sin(uTime * 0.95 + aPhase) * 0.08;
    float sway = cos(uTime * 0.75 + aPhase * 1.3) * 0.06;
    pos.y += wave;
    pos.x += sway;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float scaleMult = isMatch ? 1.48 : (isAll ? 1.0 : 0.72);
    float pulse = 1.0 + sin(uTime * 2.2 + aPhase) * 0.14;
    float dist = max(1.5, -mvPosition.z);
    gl_PointSize = clamp((aSize * scaleMult * pulse * uPixelRatio * 26.0) / dist, 6.0, 56.0);
  }
`;

const NODE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying float vCluster;
  varying float vAlpha;
  varying float vBoost;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    vec3 tint = uColor0;
    if (vCluster > 0.5 && vCluster < 1.5) tint = uColor1;
    else if (vCluster >= 1.5 && vCluster < 2.5) tint = uColor2;
    else if (vCluster >= 2.5) tint = uColor3;

    float outerHalo = smoothstep(0.5, 0.14, d);
    float innerCore = smoothstep(0.19, 0.04, d);
    vec3 col = mix(tint, vec3(1.0), innerCore * (0.45 + 0.35 * vBoost));
    float alpha = (outerHalo * 0.62 + innerCore * 0.58) * vAlpha;

    gl_FragColor = vec4(col, alpha);
  }
`;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface GraphData {
  positions: Float32Array;
  clusters: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
  edges: [number, number, number, number][]; // [indexA, indexB, clusterA, clusterB]
}

function buildDeterministicGraph(): GraphData {
  const positions = new Float32Array(TOTAL_NODES * 3);
  const clusters = new Float32Array(TOTAL_NODES);
  const phases = new Float32Array(TOTAL_NODES);
  const sizes = new Float32Array(TOTAL_NODES);

  for (let c = 0; c < CLUSTER_CENTERS.length; c++) {
    const [cx, cy, cz] = CLUSTER_CENTERS[c];
    for (let i = 0; i < NODES_PER_CLUSTER; i++) {
      const idx = c * NODES_PER_CLUSTER + i;
      const r1 = seededRandom(idx * 3 + 1);
      const r2 = seededRandom(idx * 3 + 2);
      const r3 = seededRandom(idx * 3 + 3);

      const theta = r1 * Math.PI * 2;
      const phi = Math.acos(2 * r2 - 1);
      const radius = i === 0 ? 0.08 : 0.45 + r3 * 1.12;

      positions[idx * 3] = cx + radius * Math.sin(phi) * Math.cos(theta);
      positions[idx * 3 + 1] = cy + radius * Math.sin(phi) * Math.sin(theta) * 0.85;
      positions[idx * 3 + 2] = cz + radius * Math.cos(phi) * 0.78;

      clusters[idx] = c;
      phases[idx] = r1 * Math.PI * 2;
      sizes[idx] = i === 0 ? 1.85 : 0.85 + r2 * 0.75;
    }
  }

  const edges: [number, number, number, number][] = [];

  // Intra-cluster radial & neighbor connections
  for (let c = 0; c < CLUSTER_CENTERS.length; c++) {
    const base = c * NODES_PER_CLUSTER;
    for (let i = 1; i < NODES_PER_CLUSTER; i++) {
      edges.push([base, base + i, c, c]);
      const next = i === NODES_PER_CLUSTER - 1 ? 1 : i + 1;
      edges.push([base + i, base + next, c, c]);
      if (i % 3 === 0 && i + 4 < NODES_PER_CLUSTER) {
        edges.push([base + i, base + i + 4, c, c]);
      }
    }
  }

  // Inter-cluster semantic bridge connections
  const bridgePairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [0, 3],
    [1, 2],
  ];

  bridgePairs.forEach(([cA, cB], bIdx) => {
    for (let k = 0; k < 3; k++) {
      const nodeA = cA * NODES_PER_CLUSTER + ((bIdx + k * 5 + 1) % NODES_PER_CLUSTER);
      const nodeB = cB * NODES_PER_CLUSTER + ((bIdx * 2 + k * 4 + 2) % NODES_PER_CLUSTER);
      edges.push([nodeA, nodeB, cA, cB]);
    }
  });

  return { positions, clusters, phases, sizes, edges };
}

export function WebGLNeuralGraphStage() {
  const { copy } = useLocale();
  const data = copy.neuralGraph3D;

  const [activeCluster, setActiveCluster] = useState<number | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const stageRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const activeClusterRef = useRef<number | null>(null);
  const updateEdgeColorsRef = useRef<((clusterId: number | null) => void) | null>(null);
  const pointUniformsRef = useRef<{
    uTime: { value: number };
    uPixelRatio: { value: number };
    uActiveCluster: { value: number };
    uColor0: { value: THREE.Color };
    uColor1: { value: THREE.Color };
    uColor2: { value: THREE.Color };
    uColor3: { value: THREE.Color };
  } | null>(null);

  const graph = useMemo(() => buildDeterministicGraph(), []);

  useEffect(() => {
    activeClusterRef.current = activeCluster;
    if (pointUniformsRef.current) {
      pointUniformsRef.current.uActiveCluster.value =
        activeCluster === null ? -1 : activeCluster;
    }
    updateEdgeColorsRef.current?.(activeCluster);
  }, [activeCluster]);

  useEffect(() => {
    const stageEl = stageRef.current;
    const host = canvasHostRef.current;
    if (!stageEl || !host) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: THREE.WebGLRenderer | undefined;
    let scene: THREE.Scene | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    let pointGeometry: THREE.BufferGeometry | undefined;
    let pointMaterial: THREE.ShaderMaterial | undefined;
    let lineGeometry: THREE.BufferGeometry | undefined;
    let lineMaterial: THREE.LineBasicMaterial | undefined;
    let frameId: number | null = null;
    let disposed = false;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const camTargetPos = new THREE.Vector3(0, 0, 8.2);
    const camLookTarget = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    let isStageVisible = true;

    const getClusterColors = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      return isLight
        ? ["#116c74", "#2366a7", "#16735d", "#b45309"]
        : ["#79d9de", "#7893D0", "#6edbb3", "#c9af89"];
    };

    try {
      const width = host.clientWidth || 720;
      const height = host.clientHeight || 520;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 60);
      camera.position.set(0, 0, 8.2);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      host.appendChild(renderer.domElement);

      const hexColors = getClusterColors();
      const uniforms = {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uActiveCluster: {
          value: activeClusterRef.current === null ? -1 : activeClusterRef.current,
        },
        uColor0: { value: new THREE.Color(hexColors[0]) },
        uColor1: { value: new THREE.Color(hexColors[1]) },
        uColor2: { value: new THREE.Color(hexColors[2]) },
        uColor3: { value: new THREE.Color(hexColors[3]) },
      };
      pointUniformsRef.current = uniforms;

      pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(graph.positions.slice(), 3)
      );
      pointGeometry.setAttribute(
        "aCluster",
        new THREE.BufferAttribute(graph.clusters, 1)
      );
      pointGeometry.setAttribute(
        "aPhase",
        new THREE.BufferAttribute(graph.phases, 1)
      );
      pointGeometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(graph.sizes, 1)
      );

      pointMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: NODE_VERTEX_SHADER,
        fragmentShader: NODE_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const pointsMesh = new THREE.Points(pointGeometry, pointMaterial);
      scene.add(pointsMesh);

      const linePositions = new Float32Array(graph.edges.length * 6);
      const lineColors = new Float32Array(graph.edges.length * 6);

      graph.edges.forEach(([a, b], idx) => {
        const offset = idx * 6;
        linePositions[offset] = graph.positions[a * 3];
        linePositions[offset + 1] = graph.positions[a * 3 + 1];
        linePositions[offset + 2] = graph.positions[a * 3 + 2];
        linePositions[offset + 3] = graph.positions[b * 3];
        linePositions[offset + 4] = graph.positions[b * 3 + 1];
        linePositions[offset + 5] = graph.positions[b * 3 + 2];
      });

      lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3)
      );
      const colorAttr = new THREE.BufferAttribute(lineColors, 3);
      lineGeometry.setAttribute("color", colorAttr);

      lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      });

      const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(linesMesh);

      const paintEdges = (selectedCluster: number | null) => {
        const paletteHex = getClusterColors();
        const isLight = document.documentElement.dataset.theme === "light";
        const dimmedColor = new THREE.Color(isLight ? "#c6bfb4" : "#244357");
        const palette = paletteHex.map((h) => new THREE.Color(h));

        graph.edges.forEach(([, , cA, cB], idx) => {
          const offset = idx * 6;
          const touchesSelected =
            selectedCluster === null ||
            cA === selectedCluster ||
            cB === selectedCluster;

          const colA = touchesSelected ? palette[cA] : dimmedColor;
          const colB = touchesSelected ? palette[cB] : dimmedColor;

          lineColors[offset] = colA.r;
          lineColors[offset + 1] = colA.g;
          lineColors[offset + 2] = colA.b;
          lineColors[offset + 3] = colB.r;
          lineColors[offset + 4] = colB.g;
          lineColors[offset + 5] = colB.b;
        });

        colorAttr.needsUpdate = true;
      };

      updateEdgeColorsRef.current = paintEdges;
      paintEdges(activeClusterRef.current);

      const syncThemePalette = () => {
        const nextHex = getClusterColors();
        uniforms.uColor0.value.set(nextHex[0]);
        uniforms.uColor1.value.set(nextHex[1]);
        uniforms.uColor2.value.set(nextHex[2]);
        uniforms.uColor3.value.set(nextHex[3]);
        paintEdges(activeClusterRef.current);
      };

      const themeObserver = new MutationObserver(syncThemePalette);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      const handlePointerMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pointer.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      const handlePointerLeave = () => {
        pointer.targetX = 0;
        pointer.targetY = 0;
      };

      stageEl.addEventListener("pointermove", handlePointerMove, { passive: true });
      stageEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });

      const handleResize = () => {
        if (!renderer || !camera || !host) return;
        const nextW = host.clientWidth || 720;
        const nextH = host.clientHeight || 520;
        camera.aspect = nextW / nextH;
        camera.updateProjectionMatrix();
        renderer.setSize(nextW, nextH);
      };
      window.addEventListener("resize", handleResize);

      const observer = new IntersectionObserver(
        (entries) => {
          isStageVisible = entries.some((entry) => entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(stageEl);

      const clock = new THREE.Clock();

      const animate = () => {
        if (disposed) return;
        frameId = window.requestAnimationFrame(animate);
        if (!isStageVisible || !renderer || !scene || !camera) return;

        const elapsed = motionQuery.matches ? 0 : clock.getElapsedTime();
        uniforms.uTime.value = elapsed;

        pointer.x += (pointer.targetX - pointer.x) * 0.06;
        pointer.y += (pointer.targetY - pointer.y) * 0.06;

        const selected = activeClusterRef.current;
        if (selected !== null && CLUSTER_CENTERS[selected]) {
          const [cx, cy, cz] = CLUSTER_CENTERS[selected];
          camLookTarget.set(cx * 0.72, cy * 0.72, cz * 0.5);
          camTargetPos.set(
            cx * 0.85 + pointer.x * 0.95,
            cy * 0.85 - pointer.y * 0.65,
            5.65
          );
        } else {
          camLookTarget.set(0, 0, 0);
          camTargetPos.set(pointer.x * 1.35, -pointer.y * 0.85, 8.2);
        }

        camera.position.lerp(camTargetPos, 0.055);
        currentLookAt.lerp(camLookTarget, 0.065);
        camera.lookAt(currentLookAt);

        if (!motionQuery.matches && selected === null) {
          pointsMesh.rotation.y = Math.sin(elapsed * 0.14) * 0.12;
          linesMesh.rotation.y = pointsMesh.rotation.y;
        } else {
          pointsMesh.rotation.y += (0 - pointsMesh.rotation.y) * 0.06;
          linesMesh.rotation.y = pointsMesh.rotation.y;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        disposed = true;
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        observer.disconnect();
        themeObserver.disconnect();
        stageEl.removeEventListener("pointermove", handlePointerMove);
        stageEl.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("resize", handleResize);
        pointGeometry?.dispose();
        pointMaterial?.dispose();
        lineGeometry?.dispose();
        lineMaterial?.dispose();
        renderer?.dispose();
        if (renderer?.domElement.parentNode === host) {
          host.removeChild(renderer.domElement);
        }
      };
    } catch {
      setWebglFailed(true);
    }
  }, [graph]);

  const currentCluster =
    activeCluster !== null
      ? data.clusters.find((c) => c.id === activeCluster) ?? data.clusters[0]
      : null;

  return (
    <section
      id="neural-graph-3d"
      ref={stageRef}
      className="bd-stage bd-webgl-stage"
      aria-labelledby="bd-webgl-title"
    >
      <div className="aw-container">
        <header className="bd-stage-header">
          <span className="bd-stage-index" data-fade>
            {data.stageIndex}
          </span>
          <div className="bd-stage-heading-row">
            <h2 id="bd-webgl-title" className="aw-title bd-stage-title" data-reveal>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  {data.titleLine1}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-block" data-reveal-line>
                  <em>{data.titleAccent}</em>
                </span>
              </span>
            </h2>
            <p className="aw-copy" data-fade>
              {data.subtitle}
            </p>
          </div>
        </header>

        {/* Cluster Filter Axis (Hairline Architectural Controls >= 14px) */}
        <div
          className="bd-cluster-controls"
          role="tablist"
          aria-label="3D Knowledge Clusters"
          data-fade
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCluster === null}
            onClick={() => setActiveCluster(null)}
            className={`bd-cluster-btn ${activeCluster === null ? "is-active" : ""}`}
          >
            {data.allClustersLabel}
          </button>
          {data.clusters.map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              role="tab"
              aria-selected={activeCluster === cluster.id}
              onClick={() => setActiveCluster(cluster.id)}
              className={`bd-cluster-btn ${activeCluster === cluster.id ? "is-active" : ""}`}
            >
              {cluster.label}
            </button>
          ))}
        </div>

        {/* 3D WebGL Shader Canvas + Spatial Topology HUD */}
        <div className="bd-webgl-layout">
          <div className="bd-webgl-canvas-wrap">
            <div ref={canvasHostRef} className="bd-webgl-host" aria-hidden="true" />
            {webglFailed && (
              <div className="bd-webgl-fallback">
                <span className="bd-meta-mono">WEBGL SHADER FALLBACK · VECTOR MAP</span>
              </div>
            )}
            <div className="bd-webgl-coords" aria-hidden="true">
              <span>CAMERA // {currentCluster ? `CLUSTER_0${currentCluster.id + 1}` : "ORBIT_GLOBAL"}</span>
              <span>72 NODES · GLSL SHADER MATERIAL</span>
            </div>
          </div>

          <aside className="bd-webgl-hud" aria-live="polite">
            <div className="bd-webgl-hud-block">
              <div className="bd-webgl-hud-meta">
                <span>
                  {currentCluster ? currentCluster.nodeCount : "72 NODES · 4 CLUSTERS"}
                </span>
                <span className="bd-text-cyan">
                  {currentCluster ? currentCluster.coherence : data.coherenceLabel}
                </span>
              </div>
              <h3 className="bd-webgl-hud-title">
                {currentCluster ? currentCluster.centerTopic : "Autonomous Neural Constellation"}
              </h3>
            </div>

            <div className="bd-webgl-hud-block">
              <span className="bd-webgl-hud-label">{data.linkedNodesLabel}</span>
              <ul className="bd-webgl-node-list">
                {(currentCluster
                  ? currentCluster.connectedNotes
                  : data.clusters.map((c) => `${c.centerTopic} (${c.nodeCount})`)
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bd-webgl-hud-block">
              <span className="bd-webgl-hud-label">{data.bridgeInsightLabel}</span>
              <p className="bd-webgl-hud-insight">
                {currentCluster
                  ? currentCluster.insight
                  : data.clusters[0].insight}
              </p>
            </div>

            <div className="bd-webgl-hud-footer">
              <Link href="/graph" className="aw-text-link group">
                <RollingText text={data.openGraphCta} />{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
