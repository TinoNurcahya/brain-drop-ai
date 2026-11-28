"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export function FluidCursor() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname === "/") return;
    // Disable on touch devices or reduced motion
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    const mouse = {
      x: -100,
      y: -100,
      targetX: -100,
      targetY: -100,
      visible: false,
      isHoveringInteractive: false,
    };

    // Single-accent 60-30-10 compliant particle tones per theme
    const getSparkPalette = () => {
      const isLight = document.documentElement.dataset.theme === "light";
      return isLight
        ? [
            "rgba(17, 108, 116, ", // primary deep teal accent
            "rgba(24, 128, 138, ", // subtle teal derivative
            "rgba(28, 25, 23, ",   // neutral charcoal ink fleck
          ]
        : [
            "rgba(121, 217, 222, ", // primary oceanic cyan accent
            "rgba(165, 232, 236, ", // luminous cyan tint
            "rgba(238, 234, 225, ", // warm chalk ink spark
          ];
    };

    const particles: SparkParticle[] = [];
    const maxParticles = 40;
    let lastSparkTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.visible = true;

      const target = e.target as HTMLElement | null;
      mouse.isHoveringInteractive = !!(
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest("[role='button']") ||
        target?.closest(".interactive-target")
      );

      const now = performance.now();
      if (now - lastSparkTime > 24 && particles.length < maxParticles) {
        lastSparkTime = now;
        const palette = getSparkPalette();
        const colorBase = palette[Math.floor(Math.random() * palette.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.25 + 0.25;

        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.0 + 0.9,
          color: colorBase,
          alpha: 0.78,
          decay: Math.random() * 0.024 + 0.016,
        });
      }
    };

    const onMouseLeave = () => {
      mouse.visible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    let animationId: number;

    const render = () => {
      if (document.documentElement.getAttribute("data-theme-transition") === "iris") {
        animationId = requestAnimationFrame(render);
        return;
      }
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.22;
      mouse.y += (mouse.targetY - mouse.y) * 0.22;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (mouse.visible) {
        const isLight = document.documentElement.dataset.theme === "light";
        ctx.save();

        if (mouse.isHoveringInteractive) {
          ctx.strokeStyle = isLight
            ? "rgba(17, 108, 116, 0.72)"
            : "rgba(121, 217, 222, 0.78)";
          ctx.lineWidth = 1.35;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 17, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = isLight
            ? "rgba(17, 108, 116, 0.9)"
            : "rgba(121, 217, 222, 0.92)";
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const gradient = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            11
          );
          if (isLight) {
            gradient.addColorStop(0, "rgba(17, 108, 116, 0.65)");
            gradient.addColorStop(0.4, "rgba(17, 108, 116, 0.2)");
            gradient.addColorStop(1, "rgba(17, 108, 116, 0)");
          } else {
            gradient.addColorStop(0, "rgba(121, 217, 222, 0.85)");
            gradient.addColorStop(0.4, "rgba(121, 217, 222, 0.28)");
            gradient.addColorStop(1, "rgba(121, 217, 222, 0)");
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = isLight ? "#1c1917" : "#eeeae1";
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fluid-cursor-canvas fixed inset-0 w-screen h-screen pointer-events-none z-[99999]"
      aria-hidden="true"
    />
  );
}
