"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import {
  type RunRegistrationRow,
  registrationCountsTowardRunCapacity,
} from "@/lib/course-run-registrations";
import { registrationStatusPillClassName } from "@/lib/registration-status-ui";
import { registrationStatusLabelsCs } from "@/types/registration";

type Props = {
  initialRuns: CourseRun[];
  /** Všechny přihlášky s vyplněným runId (i u smazaných id termínů). */
  occupancyByRunId: Record<string, RunRegistrationRow[]>;
};

function emptyRun(): CourseRun {
  return {
    id: `run-${crypto.randomUUID().slice(0, 10)}`,
    label: "",
    description: "",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: new Date().toISOString().slice(0, 10),
    active: true,
  };
}

function countedTowardCapacity(rows: RunRegistrationRow[]): number {
  return rows.filter((r) => registrationCountsTowardRunCapacity(r.status))
    .length;
}

export function CourseRunsAdminClient({
  initialRuns,
  occupancyByRunId,
}: Props) {
  const router = useRouter();
  const [runs, setRuns] = useState<CourseRun[]>(initialRuns);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/course-runs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runs }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : "Uložení se nezdařilo.";
        setError(msg);
        return;
      }
      setMessage("Termíny uloženy do data/course-runs.json.");
      if (
        typeof data === "object" &&
        data &&
        "runs" in data &&
        Array.isArray((data as { runs: unknown }).runs)
      ) {
        setRuns((data as { runs: CourseRun[] }).runs);
      }
      router.refresh();
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(false);
    }
  }

  function updateAt(index: number, patch: Partial<CourseRun>) {
    setRuns((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  function removeAt(index: number) {
    setRuns((prev) => prev.filter((_, i) => i !== index));
  }

  const orphanEntries = Object.entries(occupancyByRunId).filter(
    ([id]) => !runs.some((r) => r.id === id),
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="portal-card border-violet-100 p-4 text-sm leading-relaxed text-slate-700 sm:p-5">
        <p>
          Údaje se ukládají do{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">data/course-runs.json</code>.
          Tabulka níže bere přihlášky z aktuálních dat (včetně stavu — zrušené se nepočítají
          do kapacity). Volná místa na webu = kapacita minus větší z{" "}
          <strong>ručního obsazeno</strong> a <strong>počtu přihlášek</strong>.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          <strong>Zrušit termín</strong> odebere ho z nabídky na přihlášce; stávající
          přihlášky zůstanou — můžete je v detailu přehodit na jiný termín.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setRuns((p) => [...p, emptyRun()])}
          className="btn-portal-outline max-w-xs"
        >
          + Přidat termín
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={pending}
          className="btn-portal-primary max-w-xs"
        >
          {pending ? "Ukládám…" : "Uložit vše"}
        </button>
      </div>

      {error ? (
        <p className="alert-error" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="alert-success">{message}</p> : null}

      {orphanEntries.length > 0 ? (
        <div className="portal-card border-l-4 border-amber-400 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-bold">Přihlášky u id termínu, které v seznamu nejsou</p>
          <p className="mt-1 text-xs font-medium">
            Pravděpodobně smazaný nebo přejmenovaný termín. V detailu přihlášky přiřaďte
            platný termín.
          </p>
          <div className="mt-4 space-y-6">
            {orphanEntries.map(([rid, rows]) => (
              <div key={rid}>
                <p className="font-mono text-xs font-bold text-amber-900">{rid}</p>
                <div className="mt-2 overflow-x-auto rounded-lg border border-amber-200/80 bg-white/60">
                  <table className="min-w-full text-left text-xs">
                    <thead className="border-b border-amber-100 bg-amber-100/50 font-bold text-amber-900">
                      <tr>
                        <th className="px-2 py-1.5">Kód</th>
                        <th className="px-2 py-1.5">ID</th>
                        <th className="px-2 py-1.5">Dítě</th>
                        <th className="px-2 py-1.5" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100/80">
                      {rows.map((row) => (
                        <tr key={row.id}>
                          <td className="px-2 py-1.5 font-mono font-semibold">
                            {row.publicCode}
                          </td>
                          <td className="px-2 py-1.5 font-mono text-[10px] text-slate-600">
                            {row.id}
                          </td>
                          <td className="px-2 py-1.5">{row.childName}</td>
                          <td className="px-2 py-1.5">
                            <Link
                              href={`/admin/registrations/${encodeURIComponent(row.publicCode)}`}
                              className="font-bold text-violet-800 underline"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {runs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600">
            Zatím žádné termíny. Přidejte řádek nebo uložte prázdný seznam — na
            přihlášce se pak zobrazí jen obecná domluva.
          </p>
        ) : (
          runs.map((run, index) => {
            const rows = occupancyByRunId[run.id] ?? [];
            const counted = countedTowardCapacity(rows);
            const free = spotsLeftEffective(run, counted);
            const active = run.active !== false;

            return (
              <div
                key={`${run.id}-${index}`}
                className="portal-card space-y-4 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div>
                    <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
                      Termín {index + 1}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                          active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-slate-300 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {active ? "V nabídce na webu" : "Zrušený — jen interně"}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        Kapacita {run.capacity} · do kapacity z přihlášek{" "}
                        <strong>{counted}</strong>
                        {run.filled > counted ? (
                          <>
                            {" "}
                            · ručně <strong>{run.filled}</strong>
                          </>
                        ) : null}{" "}
                        · volno cca <strong>{free}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {active ? (
                      <button
                        type="button"
                        onClick={() => updateAt(index, { active: false })}
                        className="btn-portal-ghost text-xs"
                      >
                        Zrušit nabídku
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateAt(index, { active: true })}
                        className="btn-portal-ghost text-xs"
                      >
                        Obnovit nabídku
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="text-xs font-bold text-red-700 underline decoration-red-300 underline-offset-2 hover:text-red-900"
                    >
                      Odstranit z JSON
                    </button>
                  </div>
                </div>

                {rows.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full text-left text-xs sm:text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2">Kód</th>
                          <th className="px-3 py-2">Technické ID</th>
                          <th className="px-3 py-2">Dítě</th>
                          <th className="px-3 py-2">Rodič</th>
                          <th className="px-3 py-2">Stav</th>
                          <th className="px-3 py-2">Přijato</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rows.map((row) => (
                          <tr key={row.id} className="bg-white">
                            <td className="px-3 py-2 font-mono font-semibold">
                              {row.publicCode}
                            </td>
                            <td className="px-3 py-2 font-mono text-[10px] text-slate-500 sm:text-xs">
                              {row.id}
                            </td>
                            <td className="px-3 py-2 font-medium text-slate-800">
                              {row.childName}
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              <span className="block">{row.parentName}</span>
                              <span className="text-xs text-slate-500">
                                {row.parentEmail}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex max-w-[10rem] rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${registrationStatusPillClassName(row.status)}`}
                              >
                                {registrationStatusLabelsCs[row.status]}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                              {row.receivedAt
                                ? new Date(row.receivedAt).toLocaleString(
                                    "cs-CZ",
                                  )
                                : "—"}
                            </td>
                            <td className="px-3 py-2">
                              <Link
                                href={`/admin/registrations/${encodeURIComponent(row.publicCode)}`}
                                className="font-bold text-violet-700 underline decoration-violet-200 underline-offset-2 hover:text-violet-900"
                              >
                                Detail
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    K tomuto termínu zatím žádná přihláška s přiřazeným{" "}
                    <code className="rounded bg-slate-100 px-1">{run.id}</code>.
                  </p>
                )}

                <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Technické id (bez mezer)
                    </label>
                    <input
                      value={run.id}
                      onChange={(e) => updateAt(index, { id: e.target.value })}
                      className="input-portal mt-1.5 font-mono text-sm"
                      autoComplete="off"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Krátký nadpis (pro rodiče)
                    </label>
                    <input
                      value={run.label}
                      onChange={(e) => updateAt(index, { label: e.target.value })}
                      className="input-portal mt-1.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Popis
                    </label>
                    <textarea
                      value={run.description}
                      onChange={(e) =>
                        updateAt(index, { description: e.target.value })
                      }
                      rows={2}
                      className="input-portal mt-1.5 min-h-[4.5rem] resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Start (datum)
                    </label>
                    <input
                      type="date"
                      value={run.startsOn}
                      onChange={(e) =>
                        updateAt(index, { startsOn: e.target.value })
                      }
                      className="input-portal mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Kapacita
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={run.capacity}
                      onChange={(e) =>
                        updateAt(index, {
                          capacity: Number(e.target.value) || 1,
                        })
                      }
                      className="input-portal mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Obsazeno (ruční doplněk)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={5000}
                      value={run.filled}
                      onChange={(e) =>
                        updateAt(index, {
                          filled: Number(e.target.value) || 0,
                        })
                      }
                      className="input-portal mt-1.5"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
