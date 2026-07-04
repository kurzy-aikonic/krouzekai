import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";

/** Fáze skupinového termínu z pohledu rodiče. */
export type GroupRunPhase = "empty" | "gathering" | "launch_ready";

export type CourseRunPublicStatus = {
  occupied: number;
  capacity: number;
  free: number;
  isFull: boolean;
  /** Skupina: všechna místa obsazena — kurz lze spustit. */
  isGroupLaunchReady: boolean;
  /** Skupina: ještě ne 100 % — přijímáme přihlášky, kurz nestartuje. */
  isGroupGathering: boolean;
  phase: GroupRunPhase;
  acceptsRegistration: boolean;
  badgeLabel: string;
  badgeClassName: string;
  statusLine: string;
  detailLine: string;
  progressPercent: number;
};

function clampPercent(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function groupRunPhase(
  run: CourseRun,
  occupied: number,
): GroupRunPhase {
  if (run.format !== "skupina") {
    return occupied >= run.capacity ? "launch_ready" : "empty";
  }
  if (occupied >= run.capacity) return "launch_ready";
  if (occupied > 0) return "gathering";
  return "empty";
}

export function courseRunPublicStatus(
  run: CourseRun,
  registrationCount: number,
): CourseRunPublicStatus {
  const occupied = Math.max(run.filled, registrationCount);
  const free = spotsLeftEffective(run, registrationCount);
  const isFull = free <= 0;
  const capacity = run.capacity;
  const progressPercent =
    capacity > 0 ? clampPercent((occupied / capacity) * 100) : 0;

  if (run.format === "individual") {
    const taken = occupied >= capacity;
    return {
      occupied,
      capacity,
      free,
      isFull,
      isGroupLaunchReady: false,
      isGroupGathering: false,
      phase: taken ? "launch_ready" : "empty",
      acceptsRegistration: !isFull,
      badgeLabel: taken ? "Slot obsazen" : "Volný slot",
      badgeClassName: taken
        ? "border-slate-300 bg-slate-100 text-slate-800"
        : "border-emerald-300 bg-emerald-50 text-emerald-900",
      statusLine: taken
        ? "Individuální termín je obsazen."
        : "Individuální termín je volný.",
      detailLine: taken
        ? "Vyberte jiný slot nebo nechte domluvu na později."
        : "Po přihlášce s vámi doladíme detaily.",
      progressPercent: taken ? 100 : 0,
    };
  }

  const phase = groupRunPhase(run, occupied);
  const isGroupLaunchReady = phase === "launch_ready";
  const isGroupGathering = phase === "gathering";

  if (isGroupLaunchReady) {
    return {
      occupied,
      capacity,
      free,
      isFull: true,
      isGroupLaunchReady: true,
      isGroupGathering: false,
      phase,
      acceptsRegistration: false,
      badgeLabel: "Kapacita naplněna",
      badgeClassName: "border-emerald-300 bg-emerald-50 text-emerald-900",
      statusLine: `Obsazeno ${occupied} z ${capacity} míst — kurz je potvrzen ke spuštění.`,
      detailLine:
        "Skupinu jsme naplnili na 100 %. Ozveme se s fakturací a organizací první lekce. Další přihlášky na tento termín nepřijímáme.",
      progressPercent: 100,
    };
  }

  if (isGroupGathering) {
    return {
      occupied,
      capacity,
      free,
      isFull: false,
      isGroupLaunchReady: false,
      isGroupGathering: true,
      phase,
      acceptsRegistration: true,
      badgeLabel: "Sbíráme přihlášky",
      badgeClassName: "border-amber-300 bg-amber-50 text-amber-950",
      statusLine: `Obsazeno ${occupied} z ${capacity} míst — kurz startuje až po naplnění kapacity.`,
      detailLine: `Skupinový kurz spouštíme jen při plné obsazenosti (${capacity}/${capacity}). Přihláška je nezávazná, dokud kapacitu nedoplníme.`,
      progressPercent,
    };
  }

  return {
    occupied,
    capacity,
    free,
    isFull: false,
    isGroupLaunchReady: false,
    isGroupGathering: false,
    phase: "empty",
    acceptsRegistration: true,
    badgeLabel: "Hledáme účastníky",
    badgeClassName: "border-violet-300 bg-violet-50 text-violet-900",
    statusLine: `Zatím ${occupied} z ${capacity} míst — kurz startuje až po naplnění kapacity.`,
    detailLine: `Potřebujeme ${capacity} dětí na termín. Přihlaste se nezávazně — o spuštění kurzu vás informujeme, až bude skupina kompletní.`,
    progressPercent: 0,
  };
}

/** Krátký popisek pro admin tabulku. */
export function courseRunAdminCapacityLabel(
  run: CourseRun,
  registrationCount: number,
): string {
  const s = courseRunPublicStatus(run, registrationCount);
  if (run.format === "skupina") {
    if (s.isGroupLaunchReady) return `${s.occupied}/${s.capacity} · potvrzeno`;
    return `${s.occupied}/${s.capacity} · sbírá`;
  }
  return `${s.occupied}/${s.capacity} · volno ${s.free}`;
}
