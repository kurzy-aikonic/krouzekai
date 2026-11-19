"use client";

import { useEffect } from "react";

/**
 * Jemná mřížka a parallax. Načte se až po vykreslení hero, na mobilu se nespouští.
 * Samotný nadpis a obrázek jsou v HTML, ať LCP nečeká na JavaScript.
 */
export function HeroFx() {
  useEffect(() => {
    const root = document.getElementById("uvod");
    const canvas = document.getElementById("hero-grid") as HTMLCanvasElement | null;
    if (!root || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const pointer = { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42 };

    const fit = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const draw = () => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      root.style.setProperty("--hx", ((pointer.x - 0.5) * 2).toFixed(3));
      root.style.setProperty("--hy", ((pointer.y - 0.5) * 2).toFixed(3));

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const gap = Math.max(28, Math.round(w / 36));
      const ox = (pointer.x - 0.5) * gap * 0.35;
      const oy = (pointer.y - 0.5) * gap * 0.35;
      ctx.lineWidth = 1;
      for (let x = (ox % gap) - gap; x < w; x += gap) {
        for (let y = (oy % gap) - gap; y < h; y += gap) {
          const dx = x / w - pointer.x;
          const dy = y / h - pointer.y;
          const dist = Math.hypot(dx, dy);
          const pull = Math.max(0, 1 - dist * 2.4);
          const px = x + dx * pull * gap * 0.55;
          const py = y + dy * pull * gap * 0.55;
          ctx.strokeStyle = `rgba(196, 181, 253, ${0.04 + pull * 0.22})`;
          ctx.strokeRect(px, py, gap * 0.72, gap * 0.72);
        }
      }
      raf = window.requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
    };
    const onLeave = () => {
      pointer.tx = 0.62;
      pointer.ty = 0.48;
    };

    fit();
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", fit);
    raf = window.requestAnimationFrame(draw);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return null;
}
