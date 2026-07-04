import type { CourseRun } from "@/data/course-runs";

export type DefaultCoursePrices = {
  skupinaCourseCzk: number;
  individualCourseCzk: number;
};

/** Cena termínu — vlastní nebo výchozí globální podle formátu. */
export function effectiveRunPriceCzk(
  run: CourseRun,
  defaults: DefaultCoursePrices,
): number {
  if (typeof run.priceCzk === "number" && run.priceCzk >= 100) {
    return run.priceCzk;
  }
  return run.format === "individual"
    ? defaults.individualCourseCzk
    : defaults.skupinaCourseCzk;
}

export function runUsesCustomPrice(run: CourseRun): boolean {
  return typeof run.priceCzk === "number" && run.priceCzk >= 100;
}

/** Popisek k ceně pro rodiče / admin. */
export function runPriceScopeLabel(run: CourseRun): string {
  return run.format === "individual"
    ? "celý kurz 1:1"
    : "za dítě ve skupině";
}

export function formatRunPriceCzk(amount: number): string {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
}
