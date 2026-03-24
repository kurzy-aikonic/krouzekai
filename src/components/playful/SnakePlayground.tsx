"use client";

import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const GRID_W = 18;
const GRID_H = 18;
const CELL = 20;
const CANVAS_W = GRID_W * CELL;
const CANVAS_H = GRID_H * CELL;
const TICK_MS = 135;

type Cell = { x: number; y: number };

function randomFood(occupied: Cell[]): Cell {
  let p: Cell;
  let guard = 0;
  do {
    p = {
      x: Math.floor(Math.random() * GRID_W),
      y: Math.floor(Math.random() * GRID_H),
    };
    guard++;
  } while (occupied.some((c) => c.x === p.x && c.y === p.y) && guard < 500);
  return p;
}

function initialSnake(): Cell[] {
  return [
    { x: 10, y: 9 },
    { x: 9, y: 9 },
    { x: 8, y: 9 },
  ];
}

export function SnakePlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const snakeRef = useRef<Cell[]>(initialSnake());
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const nextDirRef = useRef<Cell | null>(null);
  const foodRef = useRef<Cell>(randomFood(initialSnake()));
  const scoreRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const even = (x + y) % 2 === 0;
        ctx.fillStyle = even ? "#ede9fe" : "#fae8ff";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    const food = foodRef.current;
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = "#f43f5e";
    ctx.fill();
    ctx.strokeStyle = "#881337";
    ctx.lineWidth = 2;
    ctx.stroke();

    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const pad = i === 0 ? 2 : 3;
      const gx = seg.x * CELL + pad;
      const gy = seg.y * CELL + pad;
      const w = CELL - pad * 2;
      const r = i === 0 ? 6 : 5;
      ctx.beginPath();
      ctx.roundRect(gx, gy, w, w, r);
      const g = ctx.createLinearGradient(gx, gy, gx + w, gy + w);
      if (i === 0) {
        g.addColorStop(0, "#4ade80");
        g.addColorStop(1, "#16a34a");
      } else {
        g.addColorStop(0, "#86efac");
        g.addColorStop(1, "#22c55e");
      }
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "#14532d";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    if (snake[0]) {
      const h = snake[0];
      const cx = h.x * CELL + CELL / 2;
      const cy = h.y * CELL + CELL / 2;
      ctx.fillStyle = "#14532d";
      const eye = 2.5;
      const off = 3;
      if (dirRef.current.x === 1) {
        ctx.fillRect(cx + off - eye / 2, cy - 4, eye, eye);
        ctx.fillRect(cx + off - eye / 2, cy + 1, eye, eye);
      } else if (dirRef.current.x === -1) {
        ctx.fillRect(cx - off - eye / 2, cy - 4, eye, eye);
        ctx.fillRect(cx - off - eye / 2, cy + 1, eye, eye);
      } else if (dirRef.current.y === -1) {
        ctx.fillRect(cx - 3, cy - off - eye / 2, eye, eye);
        ctx.fillRect(cx + 1, cy - off - eye / 2, eye, eye);
      } else {
        ctx.fillRect(cx - 3, cy + off - eye / 2, eye, eye);
        ctx.fillRect(cx + 1, cy + off - eye / 2, eye, eye);
      }
    }
  }, []);

  const trySetDir = useCallback((dx: number, dy: number) => {
    const cur = dirRef.current;
    if (dx === -cur.x && dy === -cur.y) return;
    nextDirRef.current = { x: dx, y: dy };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!detailsRef.current?.open) return;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          trySetDir(0, -1);
          break;
        case "ArrowDown":
          e.preventDefault();
          trySetDir(0, 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          trySetDir(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          trySetDir(1, 0);
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trySetDir]);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      if (nextDirRef.current) {
        const nd = nextDirRef.current;
        const cur = dirRef.current;
        if (!(nd.x === -cur.x && nd.y === -cur.y)) {
          dirRef.current = nd;
        }
        nextDirRef.current = null;
      }

      const head = snakeRef.current[0];
      if (!head) return;
      const d = dirRef.current;
      const newHead = { x: head.x + d.x, y: head.y + d.y };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_W ||
        newHead.y < 0 ||
        newHead.y >= GRID_H
      ) {
        setHighScore((h) => Math.max(h, scoreRef.current));
        setGameOver(true);
        setRunning(false);
        return;
      }

      const body = snakeRef.current;
      if (body.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setHighScore((h) => Math.max(h, scoreRef.current));
        setGameOver(true);
        setRunning(false);
        return;
      }

      const ate =
        newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      snakeRef.current = [newHead, ...body];
      if (!ate) {
        snakeRef.current.pop();
      } else {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        foodRef.current = randomFood(snakeRef.current);
      }
      draw();
    }, TICK_MS);

    return () => clearInterval(id);
  }, [running, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  function resetAndStart() {
    snakeRef.current = initialSnake();
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = null;
    foodRef.current = randomFood(snakeRef.current);
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setRunning(true);
    queueMicrotask(draw);
  }

  function stop() {
    setRunning(false);
  }

  function onDetailsToggle() {
    if (!detailsRef.current?.open) {
      setRunning(false);
    }
  }

  return (
    <details
      ref={detailsRef}
      onToggle={onDetailsToggle}
      className="snake-details card-playful mt-16 overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-violet-50"
    >
      <summary className="snake-summary flex cursor-pointer list-none flex-col gap-2 p-5 pr-12 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-br from-lime-300 to-emerald-400 text-3xl shadow-[3px_3px_0_#312e81]"
            aria-hidden
          >
            🐍
          </span>
          <div>
            <p className="font-display text-xl font-extrabold text-[var(--magic-ink)] sm:text-2xl">
              Mini hra: had
            </p>
            <p className="mt-1 max-w-xl text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">
              Klikni a rozbal — zahraj si klasiku přímo na webu. Na kroužku se
              naučíš podobné věci stavět s AI: pravidla hry, pohyb, skóre, grafika
              i celá stránka kolem.
            </p>
          </div>
        </div>
        <span className="font-display snake-closed-hint text-sm font-bold text-violet-600 sm:mt-0 sm:text-right">
          Rozbal a hraj ▼
        </span>
        <span className="snake-open-hint font-display text-sm font-bold text-emerald-700 sm:text-right">
          Zavři ▲
        </span>
      </summary>

      <div className="border-t-[3px] border-dashed border-violet-200 px-5 pb-6 pt-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
          <div className="relative rounded-2xl border-[3px] border-[var(--magic-ink)] bg-white p-2 shadow-[4px_4px_0_#312e81]">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block max-w-full rounded-xl"
              aria-label="Herní pole hada"
            />
            {gameOver ? (
              <div className="absolute inset-2 flex flex-col items-center justify-center rounded-xl bg-[var(--magic-ink)]/85 text-center text-white backdrop-blur-[2px]">
                <p className="font-display text-2xl font-extrabold">Koniec! 💥</p>
                <p className="mt-1 text-sm font-semibold">Skóre: {score}</p>
              </div>
            ) : null}
          </div>

          <div className="flex w-full max-w-xs flex-col gap-4">
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/80 px-4 py-3 text-center">
              <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
                Skóre
              </p>
              <p className="font-display text-3xl font-extrabold text-[var(--magic-ink)]">
                {score}
              </p>
              {highScore > 0 ? (
                <p className="text-xs font-bold text-violet-700">
                  Rekord: {highScore}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {!running && !gameOver ? (
                <button
                  type="button"
                  onClick={resetAndStart}
                  className="btn-magic px-6 py-2.5 text-sm"
                >
                  Start 🎮
                </button>
              ) : null}
              {gameOver ? (
                <button
                  type="button"
                  onClick={resetAndStart}
                  className="btn-magic px-6 py-2.5 text-sm"
                >
                  Znovu
                </button>
              ) : null}
              {running ? (
                <button
                  type="button"
                  onClick={stop}
                  className="btn-magic-outline px-5 py-2.5 text-sm"
                >
                  Pauza
                </button>
              ) : null}
            </div>

            <p className="text-center text-xs font-semibold text-slate-600">
              Šipky na klávesnici — nebo tlačítka ↓
            </p>

            <div className="mx-auto grid w-36 grid-cols-3 gap-1">
              <span />
              <DirButton label="Nahoru" onClick={() => trySetDir(0, -1)}>
                ↑
              </DirButton>
              <span />
              <DirButton label="Vlevo" onClick={() => trySetDir(-1, 0)}>
                ←
              </DirButton>
              <span />
              <DirButton label="Vpravo" onClick={() => trySetDir(1, 0)}>
                →
              </DirButton>
              <span />
              <DirButton label="Dolů" onClick={() => trySetDir(0, 1)}>
                ↓
              </DirButton>
              <span />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm font-medium leading-relaxed text-slate-700">
          <span className="font-display font-extrabold text-violet-700">
            Tip pro rodiče:
          </span>{" "}
          Tohle je záměrně jednoduchá ukázka — na kurzu děti řeší vlastní nápady
          (hry, appky, weby) a AI jim pomáhá s kódem i vzhledem. Tady vidíš jen
          kousek toho, co jde dnes poskládat na internetu.
        </p>
      </div>
    </details>
  );
}

function DirButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 items-center justify-center rounded-xl border-2 border-[var(--magic-ink)] bg-white font-display text-lg font-extrabold text-[var(--magic-ink)] shadow-[2px_2px_0_#312e81] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      {children}
    </button>
  );
}
