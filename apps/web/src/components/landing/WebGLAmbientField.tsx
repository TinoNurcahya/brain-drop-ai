"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 64;
const MAX_LINE_SEGMENTS = 96;
const CONNECT_DISTANCE = 6.2;

export function WebGLAmbientField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktopQuery.matches || motionQuery.matches) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let scene: THREE.Scene | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    let pointGeometry: THREE.BufferGeometry | undefined;
    let lineGeometry: THREE.BufferGeometry | undefined;
    let pointMaterial: THREE.PointsMaterial | undefined;
    let lineMaterial: THREE.LineBasicMaterial | undefined;
    let frameId: number | null = null;
    let disposed = false;

    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);
    const linePositions = new Float32Array(MAX_LINE_SEGMENTS * 6);

    const getThemePalette = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      return isLight
        ? {
            pointColor: "#116c74",
            lineColor: "#2366a7",
            pointOpacity: 0.28,
            lineOpacity: 0.09,
          }
        : {
            pointColor: "#79d9de",
            lineColor: "#6edbb3",
            pointOpacity: 0.34,
            lineOpacity: 0.1,
          };
    };

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        58,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 22;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      for (let i = 0; i < NODE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 36;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
        velocities[i * 3] = (Math.random() - 0.5) * 0.004;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
      }

      const palette = getThemePalette();
      pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      pointMaterial = new THREE.PointsMaterial({
        color: palette.pointColor,
        size: 0.14,
        transparent: true,
        opacity: palette.pointOpacity,
        depthWrite: false,
      });
      scene.add(new THREE.Points(pointGeometry, pointMaterial));

      lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3)
      );
      lineGeometry.setDrawRange(0, 0);
      lineMaterial = new THREE.LineBasicMaterial({
        color: palette.lineColor,
        transparent: true,
        opacity: palette.lineOpacity,
        depthWrite: false,
      });
      scene.add(new THREE.LineSegments(lineGeometry, lineMaterial));
    } catch {
      return;
    }

    const syncThemeColors = () => {
      if (!pointMaterial || !lineMaterial) return;
      const palette = getThemePalette();
      pointMaterial.color.set(palette.pointColor);
      pointMaterial.opacity = palette.pointOpacity;
      lineMaterial.color.set(palette.lineColor);
      lineMaterial.opacity = palette.lineOpacity;
    };

    const observer = new MutationObserver(syncThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (disposed) return;
      frameId = requestAnimationFrame(animate);
      container.style.opacity = "1";

      for (let i = 0; i < NODE_COUNT; i++) {
        const ix = i * 3;
        positions[ix] += velocities[ix];
        positions[ix + 1] += velocities[ix + 1];
        positions[ix + 2] += velocities[ix + 2];

        if (positions[ix] > 18 || positions[ix] < -18) velocities[ix] *= -1;
        if (positions[ix + 1] > 12 || positions[ix + 1] < -12)
          velocities[ix + 1] *= -1;
        if (positions[ix + 2] > 8 || positions[ix + 2] < -8)
          velocities[ix + 2] *= -1;
      }

      let lineIdx = 0;
      for (
        let i = 0;
        i < NODE_COUNT && lineIdx < MAX_LINE_SEGMENTS;
        i++
      ) {
        for (
          let j = i + 1;
          j < NODE_COUNT && lineIdx < MAX_LINE_SEGMENTS;
          j++
        ) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
            const offset = lineIdx * 6;
            linePositions[offset] = positions[i * 3];
            linePositions[offset + 1] = positions[i * 3 + 1];
            linePositions[offset + 2] = positions[i * 3 + 2];
            linePositions[offset + 3] = positions[j * 3];
            linePositions[offset + 4] = positions[j * 3 + 1];
            linePositions[offset + 5] = positions[j * 3 + 2];
            lineIdx++;
          }
        }
      }

      if (pointGeometry && lineGeometry && camera && scene && renderer) {
        (
          pointGeometry.attributes.position as THREE.BufferAttribute
        ).needsUpdate = true;
        (
          lineGeometry.attributes.position as THREE.BufferAttribute
        ).needsUpdate = true;
        lineGeometry.setDrawRange(0, lineIdx * 2);

        const scrollFactor = window.scrollY * 0.00018;
        camera.rotation.x = Math.sin(scrollFactor) * 0.04;
        camera.rotation.y = Math.cos(scrollFactor) * 0.05;

        renderer.render(scene, camera);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      pointGeometry?.dispose();
      lineGeometry?.dispose();
      pointMaterial?.dispose();
      lineMaterial?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="aw-webgl-field" aria-hidden="true" />;
}
