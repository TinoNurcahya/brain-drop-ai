"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export interface ParticleFieldProps {
  /** Builds up to three target shapes. Stage 0 is rain; stage k morphs into shape k. */
  buildTargets: (count: number, isMobile: boolean, halfW: number) => Float32Array[] | Promise<Float32Array[]>;
  count: number;
  mobileCount: number;
  stageRef: React.MutableRefObject<number>;
  dark: boolean;
  className?: string;
  onUnsupported?: () => void;
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uSize;
  uniform float uPR;
  uniform float uRainW;
  uniform vec2 uMouse;
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec4 aRand;
  varying float vAlpha;
  varying float vMix;

  float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
  float part(float k) { return ease((uStage - k - aRand.x * 0.35) / 0.65); }

  void main() {
    float h = 13.0;
    float speed = 1.4 + aRand.z * 2.4;
    vec3 rain = vec3((aRand.x - 0.5) * uRainW, 6.5 - mod(aRand.y * h + uTime * speed, h), (aRand.w - 0.5) * 5.0);

    float s1 = part(0.0);
    float s2 = part(1.0);
    float s3 = part(2.0);
    vec3 p = mix(rain, aT1, s1);
    p = mix(p, aT2, s2);
    p = mix(p, aT3, s3);

    float settled = s1;
    p += vec3(
      sin(uTime * 0.8 + aRand.y * 30.0),
      cos(uTime * 0.7 + aRand.x * 30.0),
      sin(uTime * 0.6 + aRand.w * 30.0)
    ) * 0.03 * settled;

    vec2 d = p.xy - uMouse;
    float f = 1.0 - smoothstep(0.0, 1.3, length(d));
    p.xy += normalize(d + 1e-4) * f * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.45 + aRand.z * 0.9) * uPR * (10.0 / -mv.z);
    vAlpha = mix(0.3 + aRand.w * 0.35, 0.55 + aRand.z * 0.45, settled);
    vMix = aRand.y;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(mix(uColA, uColB, vMix), a * vAlpha * uOpacity);
  }
`;

function applyMaterialTheme(m: THREE.ShaderMaterial, dark: boolean) {
  m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
  (m.uniforms.uColA.value as THREE.Color).set(dark ? "#79d9de" : "#116c74");
  (m.uniforms.uColB.value as THREE.Color).set(dark ? "#d8ecee" : "#2f535a");
  m.uniforms.uOpacity.value = dark ? 0.9 : 0.86;
  m.needsUpdate = true;
}

export function ParticleField({
  buildTargets,
  count,
  mobileCount,
  stageRef,
  dark,
  className,
  onUnsupported,
}: ParticleFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const gpuRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    material: THREE.ShaderMaterial;
  } | null>(null);
  const buildRef = useRef(buildTargets);
  buildRef.current = buildTargets;
  const unsupportedRef = useRef(onUnsupported);
  unsupportedRef.current = onUnsupported;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      unsupportedRef.current?.();
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = isMobile ? mobileCount : count;
    const pr = Math.min(window.devicePixelRatio || 1, 1.75);

    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 10;
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BufferGeometry();
    const rand = new Float32Array(n * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    const empty = new Float32Array(n * 3);
    ["aT1", "aT2", "aT3"].forEach((k) => geometry.setAttribute(k, new THREE.BufferAttribute(empty, 3)));

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uStage: { value: stageRef.current },
        uSize: { value: isMobile ? 7 : 6 },
        uPR: { value: pr },
        uRainW: { value: 16 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uColA: { value: new THREE.Color() },
        uColB: { value: new THREE.Color() },
        uOpacity: { value: 1 },
      },
    });
    applyMaterialTheme(material, darkRef.current);
    gpuRef.current = { renderer, scene, camera, material };

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    group.add(points);

    let halfW = 1;
    let halfH = 1;
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      halfW = halfH * camera.aspect;
      material.uniforms.uRainW.value = halfW * 2.2;
    };
    resize();

    let disposed = false;
    Promise.resolve(buildRef.current(n, isMobile, halfW)).then((targets) => {
      if (disposed) return;
      ["aT1", "aT2", "aT3"].forEach((k, i) => {
        const t = targets[Math.min(i, targets.length - 1)];
        if (t) geometry.setAttribute(k, new THREE.BufferAttribute(t, 3));
      });
    });

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const mouse = new THREE.Vector2(99, 99);
    const tilt = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (Math.abs(nx) > 1 || Math.abs(ny) > 1) {
        mouse.set(99, 99);
        return;
      }
      mouse.set(nx * halfW, ny * halfH);
      tilt.set(nx, ny);
    };
    if (!isMobile && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const clock = new THREE.Clock();
    let stage = stageRef.current;
    let raf = 0;
    const smoothMouse = material.uniforms.uMouse.value as THREE.Vector2;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      // Pause during circular iris theme transition to keep ViewTransition at 60fps
      if (!visible || document.documentElement.getAttribute("data-theme-transition") === "iris") return;
      if (!reduce) material.uniforms.uTime.value += dt;
      stage += (stageRef.current - stage) * (reduce ? 1 : Math.min(1, dt * 4));
      material.uniforms.uStage.value = stage;
      if (mouse.x > 90) smoothMouse.set(99, 99);
      else if (smoothMouse.x > 90) smoothMouse.copy(mouse);
      else smoothMouse.lerp(mouse, Math.min(1, dt * 6));
      group.rotation.y += (tilt.x * 0.12 - group.rotation.y) * Math.min(1, dt * 3);
      group.rotation.x += (-tilt.y * 0.08 - group.rotation.x) * Math.min(1, dt * 3);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      gpuRef.current = null;
    };
  }, [count, mobileCount, stageRef]);

  // Update synchronously inside ThemeProvider's flushSync so the iris ViewTransition snapshot already has new colors.
  useLayoutEffect(() => {
    const gpu = gpuRef.current;
    if (!gpu) return;
    applyMaterialTheme(gpu.material, dark);
    gpu.renderer.render(gpu.scene, gpu.camera);
  }, [dark]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
