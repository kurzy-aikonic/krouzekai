"use client";

import type { CourseRun } from "@/data/course-runs";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
import {
  courseDifficultyBadgeClass,
  courseDifficultyLabel,
  courseRunTopicLine,
} from "@/lib/course-run-difficulty";
import {
  effectiveRunPriceCzk,
  runUsesCustomPrice,
  type DefaultCoursePrices,
} from "@/lib/course-run-pricing";
import { courseRunAdminCapacityLabel } from "@/lib/course-run-public-status";

type Props = {
  runs: CourseRun[];
  clientKeys: string[];
  occupancyCountByRunId: Record<string, number>;
  selectedKey: string | null;
  dirtyByKey: Record<string, boolean>;
  defaultPricing: DefaultCoursePrices;
  onSelect: (key: string) => void;
};

export function CourseRunsOverview({
  runs,
  clientKeys,
  occupancyCountByRunId,
  selectedKey,
  dirtyByKey,
  defaultPricing,
  onSelect,
}: Props) {
  const activeCount = runs.filter((r) => r.active !== false).length;
  const dirtyCount = Object.values(dirtyByKey).filter(Boolean).length;

  return (
    <div className="portal-card overflow-hidden border-violet-200 p-0">
      <div className="border-b border-violet-100 bg-violet-50/80 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-900">
              Termíny
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Celkem <strong>{runs.length}</strong>
              {runs.length > 0 ? (
                <>
                  {" "}
                  · aktivních <strong>{activeCount}</strong>
                </>
              ) : null}
              {dirtyCount > 0 ? (
                <>
                  {" "}
                  · <strong className="text-amber-800">{dirtyCount}</strong>{" "}
                  neuložených
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {runs.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-600 sm:px-5">
          Zatím žádný termín. Přidejte nový výše.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-white text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 sm:px-5">Termín</th>
                <th className="px-4 py-2.5">Téma / náročnost</th>
                <th className="px-4 py-2.5">Cena</th>
                <th className="px-4 py-2.5">Kapacita</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runs.map((run, index) => {
                const key = clientKeys[index];
                const active = run.active !== false;
                const occ = occupancyCountByRunId[run.id] ?? 0;
                const capLabel = courseRunAdminCapacityLabel(run, occ);
                const selected = selectedKey === key;
                const dirty = dirtyByKey[key] ?? false;
                const topic = courseRunTopicLine(run);
                const difficulty = courseDifficultyLabel(run.difficulty);
                const price = effectiveRunPriceCzk(run, defaultPricing);
                const customPrice = runUsesCustomPrice(run);

                return (
                  <tr
                    key={key}
                    className={
                      selected
                        ? "bg-violet-50/70"
                        : dirty
                          ? "bg-amber-50/40"
                          : "bg-white"
                    }
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display font-extrabold text-slate-900">
                          {run.label || `Termín ${index + 1}`}
                        </p>
                        {dirty ? (
                          <span className="rounded-full bg-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-950">
                            Neuloženo
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {formatScheduleSummary(run)}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase text-violet-800">
                        {run.format === "skupina" ? "Skupina" : "1:1"}
                        {!active ? " · skrytý" : ""}
                      </p>
                    </td>
                    <td className="max-w-[14rem] px-4 py-3 text-xs text-slate-700">
                      {topic ? (
                        <p className="line-clamp-2 leading-relaxed">{topic}</p>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                      {difficulty ? (
                        <span
                          className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase ${courseDifficultyBadgeClass(run.difficulty)}`}
                        >
                          {difficulty}
                        </span>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                      <strong>{price.toLocaleString("cs-CZ")} Kč</strong>
                      {customPrice ? (
                        <span className="mt-0.5 block text-[10px] font-bold uppercase text-amber-800">
                          vlastní
                        </span>
                      ) : (
                        <span className="mt-0.5 block text-[10px] text-slate-500">
                          výchozí
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {capLabel}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelect(key)}
                        className="text-xs font-bold text-violet-800 underline decoration-violet-300 underline-offset-2 hover:text-violet-950"
                      >
                        {selected ? "Upravujete" : "Upravit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
