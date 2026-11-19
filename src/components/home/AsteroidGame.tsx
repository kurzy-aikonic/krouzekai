"use client";

import { useEffect, useRef, useState } from "react";

type Rock = { x: number; y: number; r: number; v: number };

/** Malá hra na zkoušku. Stáhne se až po kliknutí, do prvního vykreslení hero nepatří. */
function GameCanvas({ onOver }: { onOver: (points: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onOverRef = useRef(onOver);

  useEffect(() => {
    onOverRef.current = onOver;
  }, [onOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const keys = new Set<string>();
    let raf = 0;
    let alive = true;
    let ship = 160;
    let tick = 0;
    let points = 0;
    const rocks: Rock[] = [];

    const down = (event: KeyboardEvent) => {
      keys.add(event.key);
      if (["ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
    };
    const up = (event: KeyboardEvent) => keys.delete(event.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    const tap = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ship = ((event.clientX - rect.left) / rect.width) * canvas.width;
    };
    canvas.addEventListener("pointerdown", tap);

    const frame = () => {
      if (!alive) return;
      tick += 1;
      if (keys.has("ArrowLeft")) ship -= 4.2;
      if (keys.has("ArrowRight")) ship += 4.2;
      ship = Math.max(16, Math.min(canvas.width - 16, ship));
      if (tick % 18 === 0) {
        rocks.push({
          x: 16 + Math.random() * (canvas.width - 32),
          y: -12,
          r: 7 + Math.random() * 8,
          v: 1.6 + Math.random() * 1.8,
        });
      }
      for (const rock of rocks) rock.y += rock.v;
      for (let i = rocks.length - 1; i >= 0; i -= 1) {
        const rock = rocks[i];
        if (rock.y > canvas.height + 20) {
          rocks.splice(i, 1);
          points += 1;
        } else if (Math.hypot(rock.x - ship, rock.y - (canvas.height - 22)) < rock.r + 10) {
          onOverRef.current(points);
          alive = false;
          return;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#07060f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(196,181,253,0.15)";
      ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(ship, canvas.height - 28);
      ctx.lineTo(ship - 11, canvas.height - 10);
      ctx.lineTo(ship + 11, canvas.height - 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ddd6fe";
      for (const rock of rocks) {
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rock.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = window.requestAnimationFrame(frame);
    };
    raf = window.requestAnimationFrame(frame);

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      canvas.removeEventListener("pointerdown", tap);
    };
  }, []);

  return <canvas ref={canvasRef} width={320} height={220} className="mt-3 w-full rounded-lg bg-black" />;
}

export function AsteroidGame({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [round, setRound] = useState(0);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="hra-nadpis">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0c0a14] p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <h2 id="hra-nadpis" className="font-display text-lg font-semibold">
            Uhni asteroidům
          </h2>
          <button type="button" className="min-h-11 min-w-11 rounded-lg text-white/80" onClick={onClose} aria-label="Zavřít hru">
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-white/70">
          Šipky doleva a doprava, nebo klepnutí na plochu. Skóre: {score}
          {over ? ". Konec hry." : "."}
        </p>
        <GameCanvas
          key={round}
          onOver={(points) => {
            setScore(points);
            setOver(true);
          }}
        />
        {over ? (
          <button
            type="button"
            className="btn-hero-primary mt-3 w-full"
            onClick={() => {
              setOver(false);
              setScore(0);
              setRound((n) => n + 1);
            }}
          >
            Ještě jednou
          </button>
        ) : null}
      </div>
    </div>
  );
}
