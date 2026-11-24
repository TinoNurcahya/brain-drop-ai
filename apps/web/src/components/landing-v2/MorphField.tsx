"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface Props {
  /** Returns one target point cloud per shape; the last one is the idle state. */
  buildShapes: (count: number, isMobile: boolean, halfW: number) => Float32Array[];
  shapeIndex: number;
  count: number;
  mobileCount: number;
  dark: boolean;
  className?: string;
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uSize;
  uniform float uPR;
  uniform vec2 uMouse;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;
  varying float vAlpha;
  varying float vMix;

  void main() {
    float t = clamp((uMix - aRand.x * 0.4) / 0.6, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aFrom, aTo, t);
    float swirl = sin(t * 3.14159) * 0.4;
    p.xy += vec2(cos(aRand.y * 6.28318), sin(aRand.y * 6.28318)) * swirl;
    p += vec3(
      sin(uTime * 0.8 + aRand.y * 30.0),
      cos(uTime * 0.7 + aRand.x * 30.0),
      sin(uTime * 0.6 + aRand.w * 30.0)
    ) * 0.03;

    vec2 d = p.xy - uMouse;
    float f = 1.0 - smoothstep(0.0, 1.2, length(d));
    p.xy += normalize(d + 1e-4) * f * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.45 + aRand.z * 0.9) * uPR * (10.0 / -mv.z);
    vAlpha = 0.5 + aRand.z * 0.5;
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

function applyTheme(m: THREE.ShaderMaterial, dark: boolean) {
  m.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
  (m.uniforms.uColA.value as THREE.Color).set(dark ? "#79d9de" : "#1d5b84");
  (m.uniforms.uColB.value as THREE.Color).set(dark ? "#c3a0ef" : "#6a46b8");
  m.uniforms.uOpacity.value = dark ? 0.9 : 0.85;
  m.needsUpdate = true;
}

interface Gpu {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  material: THREE.ShaderMaterial;
  geometry: THREE.BufferGeometry;
  shapes: Float32Array[] | null;
  current: number;
  tween: gsap.core.Tween | null;
}

/** A point cloud that morphs between a set of target shapes. */
export function MorphField({ buildShapes, shapeIndex, count, mobileCount, dark, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const buildRef = useRef(buildShapes);
  buildRef.current = buildShapes;
  const shapeRef = useRef(shapeIndex);
  shapeRef.current = shapeIndex;
  const gpuRef = useRef<Gpu | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
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

    const geometry = new THREE.BufferGeometry();
    const rand = new Float32Array(n * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    geometry.setAttribute("aFrom", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geometry.setAttribute("aTo", new THREE.BufferAttribute(new Float32Array(n * 3), 3));

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMix: { value: 1 },
        uSize: { value: isMobile ? 7 : 6 },
        uPR: { value: pr },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uColA: { value: new THREE.Color() },
        uColB: { value: new THREE.Color() },
        uOpacity: { value: 1 },
      },
    });
    applyTheme(material, darkRef.current);

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const gpu: Gpu = { renderer, scene, camera, material, geometry, shapes: null, current: -1, tween: null };
    gpuRef.current = gpu;

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
    };
    resize();

    let disposed = false;
    Promise.resolve(buildRef.current(n, isMobile, halfW)).then((shapes) => {
      if (disposed || !shapes.length) return;
      const idx = Math.min(shapeRef.current, shapes.length - 1);
      gpu.shapes = shapes;
      gpu.current = idx;
      geometry.setAttribute("aFrom", new THREE.BufferAttribute(new Float32Array(shapes[idx]), 3));
      geometry.setAttribute("aTo", new THREE.BufferAttribute(new Float32Array(shapes[idx]), 3));
      material.uniforms.uMix.value = 1;
    });

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const mouse = new THREE.Vector2(99, 99);
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (Math.abs(nx) > 1 || Math.abs(ny) > 1) mouse.set(99, 99);
      else mouse.set(nx * halfW, ny * halfH);
    };
    if (!isMobile && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const clock = new THREE.Clock();
    const smoothMouse = material.uniforms.uMouse.value as THREE.Vector2;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.documentElement.getAttribute("data-theme-transition") === "iris") return;
      if (!reduce) material.uniforms.uTime.value += dt;
      if (mouse.x > 90) smoothMouse.set(99, 99);
      else if (smoothMouse.x > 90) smoothMouse.copy(mouse);
      else smoothMouse.lerp(mouse, Math.min(1, dt * 6));
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      gpu.tween?.kill();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      gpuRef.current = null;
    };
  }, [count, mobileCount]);

  useEffect(() => {
    const g = gpuRef.current;
    if (!g || !g.shapes) return;
    const idx = Math.min(shapeIndex, g.shapes.length - 1);
    if (idx === g.current) return;
    g.current = idx;
    g.tween?.kill();

    const from = g.geometry.getAttribute("aFrom") as THREE.BufferAttribute;
    const to = g.geometry.getAttribute("aTo") as THREE.BufferAttribute;
    const rand = g.geometry.getAttribute("aRand") as THREE.BufferAttribute;
    const fa = from.array as Float32Array;
    const ta = to.array as Float32Array;
    const ra = rand.array as Float32Array;
    const m = g.material.uniforms.uMix.value as number;

    // Freeze the current in-flight positions as the new origin.
    for (let i = 0; i < rand.count; i++) {
      let t = Math.min(1, Math.max(0, (m - ra[i * 4] * 0.4) / 0.6));
      t = t * t * (3 - 2 * t);
      for (let k = 0; k < 3; k++) fa[i * 3 + k] = fa[i * 3 + k] + (ta[i * 3 + k] - fa[i * 3 + k]) * t;
    }
    ta.set(g.shapes[idx]);
    from.needsUpdate = true;
    to.needsUpdate = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      g.material.uniforms.uMix.value = 1;
      return;
    }
    g.material.uniforms.uMix.value = 0;
    g.tween = gsap.to(g.material.uniforms.uMix, { value: 1, duration: 1.3, ease: "power2.inOut" });
  }, [shapeIndex]);

  useLayoutEffect(() => {
    const g = gpuRef.current;
    if (!g) return;
    applyTheme(g.material, dark);
    g.renderer.render(g.scene, g.camera);
  }, [dark]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
