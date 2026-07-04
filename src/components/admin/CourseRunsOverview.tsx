"use client";

import type { CourseRun } from "@/data/course-runs";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
import { courseRunAdminCapacityLabel } from "@/lib/course-run-public-status";

type Props = {
  runs: CourseRun[];
  clientKeys: string[];
  occupancyCountByRunId: Record<string, number>;
  expandedKey: string | null;
  onSelect: (key: string) => void;
};

export function CourseRunsOverview({
  runs,
  clientKeys,
  occupancyCountByRunId,
  expandedKey,
  onSelect,
}: Props) {
  const activeCount = runs.filter((r) => r.active !== false).length;

  return (
    <div className="portal-card overflow-hidden border-violet-200 p-0">
      <div className="border-b border-violet-100 bg-violet-50/80 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-900">
              Uložené termíny
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Celkem <strong>{runs.length}</strong>
              {runs.length > 0 ? (
                <>
                  {" "}
                  · na webu aktivních <strong>{activeCount}</strong>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {runs.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-600 sm:px-5">
          Zatím žádný termín. Přidejte skupinový běh nebo 1:1 slot a uložte —
          pak se zobrazí zde i na úvodní stránce webu.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-white text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 sm:px-5">Termín</th>
                <th className="px-4 py-2.5">Formát</th>
                <th className="px-4 py-2.5">Stav</th>
                <th className="px-4 py-2.5">Kapacita / stav</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runs.map((run, index) => {
                const key = clientKeys[index];
                const active = run.active !== false;
                const occ = occupancyCountByRunId[run.id] ?? 0;
                const capLabel = courseRunAdminCapacityLabel(run, occ);
                const selected = expandedKey === key;
                return (
                  <tr
                    key={key}
                    className={selected ? "bg-violet-50/60" : "bg-white"}
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <p className="font-display font-extrabold text-slate-900">
                        {run.label || `Termín ${index + 1}`}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {formatScheduleSummary(run)}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase text-violet-800">
                      {run.format === "skupina" ? "Skupina" : "1:1"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                          active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-slate-300 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {active ? "Na webu" : "Skrytý"}
                      </span>
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
