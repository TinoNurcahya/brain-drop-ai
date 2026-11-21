"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive 3D Dual-Hemisphere Neural Brain Canvas
 * - Left Hemisphere (x < 0): Deep Amber (On-Device Gemini Nano 4)
 * - Right Hemisphere (x > 0): Light Amber (Cloud Gemini Flash)
 * - Central Bridge (x ≈ 0): Mid Amber Synaptic Connections
 * - Layered Depth: Foreground floating particles drift in front of text,
 *   while the brain core floats in 3D space with mouse tilt & rotation.
 */
export function NeuralBrainCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group holding the entire brain assembly for unified rotation
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // 2. Procedural Anatomical Brain Points Generation
    const isMobile = window.innerWidth <= 640;
    const pointCount = isMobile ? 1400 : 2800;

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    // Colors — Warm Amber + Deep Navy palette
    const colorEmerald = new THREE.Color(0xc88a20); // On-Device (deep amber)
    const colorEmeraldLight = new THREE.Color(0xe8a838); // Warm Amber primary
    const colorCyan = new THREE.Color(0xf0bc5a); // Cloud (light amber)
    const colorCyanLight = new THREE.Color(0xf5d08a); // Soft warm glow
    const colorPurple = new THREE.Color(0xd4a030); // Bridge (amber mid)
    const colorPurpleLight = new THREE.Color(0xe8c060); // Bridge light

    const brainNodes: THREE.Vector3[] = [];

    // Helper: Anatomical brain radius perturbation
    function getBrainRadius(
      theta: number,
      phi: number,
      isLeft: boolean
    ): number {
      const baseR = 5.2;
      // Gyri & Sulci folds
      const gyri =
        Math.sin(theta * 6) * Math.cos(phi * 7) * 0.45 +
        Math.sin(theta * 12) * Math.sin(phi * 12) * 0.22 +
        Math.cos(phi * 18) * 0.12;

      // Temporal lobe bulge (lower lateral)
      const temporalBulge =
        Math.sin(phi) > 0.3 && Math.cos(theta) > 0.2 ? 0.4 : 0;

      // Frontal lobe expansion (front top)
      const frontalBulge =
        Math.sin(phi) < -0.2 && Math.sin(theta) > 0 ? 0.35 : 0;

      // Cerebellum bulge (lower back)
      const cerebellum =
        Math.sin(phi) > 0.5 && Math.sin(theta) < -0.4 ? 0.45 : 0;

      return baseR + gyri + temporalBulge + frontalBulge + cerebellum;
    }

    // Generate Points for Both Hemispheres
    for (let i = 0; i < pointCount; i++) {
      // Golden spiral distribution over a hemisphere
      const isLeft = i % 2 === 0;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount) - Math.PI / 2;
      const theta = (Math.PI * (1 + Math.sqrt(5)) * i) % (Math.PI * 2);

      const r = getBrainRadius(theta, phi, isLeft);

      // Convert spherical to Cartesian with brain proportions:
      // x: lateral width, y: vertical height, z: anteroposterior length
      let x = r * 0.85 * Math.cos(phi) * Math.cos(theta);
      let y = r * 0.95 * Math.sin(phi);
      let z = r * 1.15 * Math.cos(phi) * Math.sin(theta);

      // Separate into Left and Right Hemispheres with longitudinal fissure gap
      const fissureGap = 0.55;
      if (isLeft) {
        x = -Math.abs(x) - fissureGap;
      } else {
        x = Math.abs(x) + fissureGap;
      }

      // Slightly flatten medial surface facing the fissure
      if (Math.abs(x) < fissureGap + 0.5) {
        x = isLeft ? -fissureGap - 0.2 : fissureGap + 0.2;
      }

      positions.push(x, y, z);
      const nodeVec = new THREE.Vector3(x, y, z);
      brainNodes.push(nodeVec);

      // Color assignment based on hemisphere & medial bridge
      const distFromCenter = Math.abs(x);
      let vertexColor: THREE.Color;

      if (distFromCenter < 1.1) {
        // Corpus Callosum / Synaptic Bridge zone
        vertexColor = Math.random() > 0.5 ? colorPurple : colorPurpleLight;
      } else if (isLeft) {
        // Left: On-Device Nano Emerald
        vertexColor =
          Math.random() > 0.4
            ? colorEmerald
            : Math.random() > 0.5
            ? colorEmeraldLight
            : colorPurpleLight;
      } else {
        // Right: Cloud Flash Cyan/Blue
        vertexColor =
          Math.random() > 0.4
            ? colorCyan
            : Math.random() > 0.5
            ? colorCyanLight
            : colorPurpleLight;
      }

      colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
      // Particle size variation
      sizes.push(Math.random() * 2.2 + 1.2);
    }

    // 3. Floating Ambient Depth Sparks (Z-depth parallax around headline)
    const sparkCount = isMobile ? 80 : 180;
    const sparkPositions: number[] = [];
    const sparkColors: number[] = [];
    const sparkVelocities: { x: number; y: number; z: number }[] = [];

    for (let s = 0; s < sparkCount; s++) {
      // Spread across wide frustum, including in front of camera (z > 0)
      const sx = (Math.random() - 0.5) * 32;
      const sy = (Math.random() - 0.5) * 20;
      const sz = (Math.random() - 0.5) * 22; // Range [-11, +11]

      sparkPositions.push(sx, sy, sz);
      sparkVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005,
      });

      // Color spark according to x coordinate
      const sparkCol =
        sx < -2
          ? colorEmeraldLight
          : sx > 2
          ? colorCyanLight
          : colorPurpleLight;
      sparkColors.push(sparkCol.r, sparkCol.g, sparkCol.b);
    }

    // 4. Points Geometries & Materials
    // Soft circular particle texture generated via canvas to avoid asset download
    function createCircleTexture(): THREE.Texture {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const circleTexture = createCircleTexture();

    // Main Brain Point Cloud
    const brainGeometry = new THREE.BufferGeometry();
    brainGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    brainGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const brainMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.28,
      vertexColors: true,
      map: circleTexture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const brainPoints = new THREE.Points(brainGeometry, brainMaterial);
    brainGroup.add(brainPoints);

    // Ambient Depth Sparks Cloud
    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sparkPositions, 3)
    );
    sparkGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(sparkColors, 3)
    );

    const sparkMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.45,
      vertexColors: true,
      map: circleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparkPoints = new THREE.Points(sparkGeometry, sparkMaterial);
    scene.add(sparkPoints); // Direct in scene so it doesn't rotate with brainGroup

    // 5. Synaptic Connecting Lines (Neural Graph Mesh)
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxConnectionsPerNode = 2;
    const maxDistance = 1.35;

    // Connect close neighbors
    for (let i = 0; i < brainNodes.length; i += 3) {
      let connections = 0;
      const p1 = brainNodes[i];

      for (let j = i + 1; j < brainNodes.length; j += 4) {
        if (connections >= maxConnectionsPerNode) break;
        const p2 = brainNodes[j];
        const dist = p1.distanceTo(p2);

        if (dist < maxDistance) {
          linePositions.push(p1.x, p1.y, p1.z);
          linePositions.push(p2.x, p2.y, p2.z);

          // Line color matches hemisphere
          const midX = (p1.x + p2.x) / 2;
          const lineColor =
            Math.abs(midX) < 1.0
              ? colorPurple
              : midX < 0
              ? colorEmerald
              : colorCyan;

          lineColors.push(lineColor.r, lineColor.g, lineColor.b);
          lineColors.push(lineColor.r, lineColor.g, lineColor.b);
          connections++;
        }
      }
    }

    // Inter-hemispheric Corpus Callosum Bridge Lines
    for (let i = 0; i < brainNodes.length; i += 12) {
      const pLeft = brainNodes[i];
      if (pLeft.x >= 0 || pLeft.x < -1.8) continue; // near medial left

      for (let j = 0; j < brainNodes.length; j += 12) {
        const pRight = brainNodes[j];
        if (pRight.x <= 0 || pRight.x > 1.8) continue; // near medial right

        const dist = pLeft.distanceTo(pRight);
        if (dist < 2.2 && Math.abs(pLeft.y - pRight.y) < 1.0) {
          linePositions.push(pLeft.x, pLeft.y, pLeft.z);
          linePositions.push(pRight.x, pRight.y, pRight.z);

          lineColors.push(colorPurpleLight.r, colorPurpleLight.g, colorPurpleLight.b);
          lineColors.push(colorPurpleLight.r, colorPurpleLight.g, colorPurpleLight.b);
          break;
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(lineColors, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const brainLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    brainGroup.add(brainLines);

    // Initial brain tilt for anatomical elegance
    brainGroup.rotation.x = 0.22;
    brainGroup.rotation.y = -0.15;
    brainGroup.position.y = -0.2;

    // 6. Interactive Mouse & Gyro Tilt Controls
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      // Normalized between -1 and 1
      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });

    // Responsive Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize, { passive: true });

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      if (!prefersReducedMotion) {
        // Continuous organic rotation
        brainGroup.rotation.y += delta * 0.12;

        // Interactive mouse tilt applied on top
        brainGroup.rotation.y += mouse.x * 0.015;
        brainGroup.rotation.x = 0.22 - mouse.y * 0.18;
        brainGroup.rotation.z = mouse.x * 0.08;

        // Subtle breathing scale pulse
        const breathe = 1 + Math.sin(elapsed * 1.5) * 0.015;
        brainGroup.scale.set(breathe, breathe, breathe);

        // Synapse line opacity shimmer
        lineMaterial.opacity = 0.18 + Math.sin(elapsed * 3) * 0.07;
      } else {
        brainGroup.rotation.y = -0.15;
        brainGroup.rotation.x = 0.22;
      }

      // Drift Ambient Depth Sparks
      const sparkPosAttr = sparkGeometry.attributes.position;
      const sparkArr = sparkPosAttr.array as Float32Array;

      for (let s = 0; s < sparkCount; s++) {
        const idx = s * 3;
        sparkArr[idx] += sparkVelocities[s].x;
        sparkArr[idx + 1] += sparkVelocities[s].y;
        sparkArr[idx + 2] += sparkVelocities[s].z;

        // Bounds wrapping
        if (sparkArr[idx] > 18) sparkArr[idx] = -18;
        if (sparkArr[idx] < -18) sparkArr[idx] = 18;
        if (sparkArr[idx + 1] > 12) sparkArr[idx + 1] = -12;
        if (sparkArr[idx + 1] < -12) sparkArr[idx + 1] = 12;
        if (sparkArr[idx + 2] > 12) sparkArr[idx + 2] = -12;
        if (sparkArr[idx + 2] < -12) sparkArr[idx + 2] = 12;
      }
      sparkPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("resize", onResize);

      brainGeometry.dispose();
      brainMaterial.dispose();
      sparkGeometry.dispose();
      sparkMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      circleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="neural-brain-canvas-container"
      aria-hidden="true"
    />
  );
}
