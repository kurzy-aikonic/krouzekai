import type { CourseRun } from "@/data/course-runs";
import {
  effectiveRunPriceCzk,
  formatRunPriceCzk,
  runPriceScopeLabel,
  runUsesCustomPrice,
  type DefaultCoursePrices,
} from "@/lib/course-run-pricing";

type Props = {
  run: CourseRun;
  defaults: DefaultCoursePrices;
  compact?: boolean;
};

export function CourseRunPriceLabel({ run, defaults, compact = false }: Props) {
  const amount = effectiveRunPriceCzk(run, defaults);
  const custom = runUsesCustomPrice(run);
  const scope = runPriceScopeLabel(run);

  if (compact) {
    return (
      <span className="mt-1 inline-flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-700">
        <span>{formatRunPriceCzk(amount)}</span>
        <span className="text-slate-500">({scope})</span>
        {custom ? (
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-900">
            cena termínu
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <p className="mt-2 text-sm font-semibold text-violet-900">
      {formatRunPriceCzk(amount)}{" "}
      <span className="text-xs font-medium text-slate-600">({scope})</span>
      {custom ? (
        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-900">
          vlastní cena
        </span>
      ) : null}
    </p>
  );
}
