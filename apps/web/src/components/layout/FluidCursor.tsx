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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
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

    // Pointer state with smooth spring lerp
    const mouse = {
      x: -100,
      y: -100,
      targetX: -100,
      targetY: -100,
      visible: false,
      isHoveringInteractive: false,
    };

    const colors = isLanding
      ? [
          "rgba(232, 168, 56, ", // warm amber
          "rgba(240, 188, 90, ", // gold light
          "rgba(255, 214, 138, ", // soft warm amber
          "rgba(255, 255, 255, ", // white spark
        ]
      : [
          "rgba(110, 219, 179, ", // emerald
          "rgba(121, 217, 222, ", // cyan
          "rgba(195, 160, 239, ", // violet
          "rgba(255, 255, 255, ", // white spark
        ];

    const particles: SparkParticle[] = [];
    const maxParticles = 45;

    let lastSparkTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.visible = true;

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      mouse.isHoveringInteractive = !!(
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest(".interactive-target")
      );

      // Spawn spark particles with distance throttling
      const now = performance.now();
      if (now - lastSparkTime > 24 && particles.length < maxParticles) {
        lastSparkTime = now;
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.4 + 0.3;

        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.2 + 1.0,
          color: colorBase,
          alpha: 0.85,
          decay: Math.random() * 0.025 + 0.015,
        });
      }
    };

    const onMouseLeave = () => {
      mouse.visible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Animation Loop
    let animationId: number;

    const render = () => {
      // Pause drawing during iris theme transition to grant 100% GPU frame budget to ViewTransition
      if (document.documentElement.getAttribute("data-theme-transition") === "iris") {
        animationId = requestAnimationFrame(render);
        return;
      }
      animationId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.22;
      mouse.y += (mouse.targetY - mouse.y) * 0.22;

      // Render Synaptic Spark Trail
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

      // Render Magnetic Pointer Core
      if (mouse.visible) {
        ctx.save();

        if (mouse.isHoveringInteractive) {
          // Expanded magnetic aura
          ctx.strokeStyle = isLanding
            ? "rgba(232, 168, 56, 0.75)"
            : "rgba(121, 217, 222, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = isLanding
            ? "rgba(240, 188, 90, 0.9)"
            : "rgba(110, 219, 179, 0.9)";
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Subtle precise dot with soft halo
          const gradient = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            12
          );
          if (isLanding) {
            gradient.addColorStop(0, "rgba(232, 168, 56, 0.9)");
            gradient.addColorStop(0.3, "rgba(240, 188, 90, 0.4)");
            gradient.addColorStop(1, "rgba(232, 168, 56, 0)");
          } else {
            gradient.addColorStop(0, "rgba(121, 217, 222, 0.9)");
            gradient.addColorStop(0.3, "rgba(110, 219, 179, 0.4)");
            gradient.addColorStop(1, "rgba(121, 217, 222, 0)");
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fluid-cursor-canvas"
      aria-hidden="true"
    />
  );
}
