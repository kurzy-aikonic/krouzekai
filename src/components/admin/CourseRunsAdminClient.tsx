"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CourseFormat, CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import {
  type RunRegistrationRow,
  registrationCountsTowardRunCapacity,
} from "@/lib/course-run-registrations";
import { registrationStatusPillClassName } from "@/lib/registration-status-ui";
import { registrationStatusLabelsCs } from "@/types/registration";
import { CourseRunScheduleEditor } from "@/components/admin/CourseRunScheduleEditor";
import { CourseRunsOverview } from "@/components/admin/CourseRunsOverview";
import {
  prepareRunsForSave,
  validateRunsForSave,
} from "@/lib/course-runs-admin-utils";
import {
  applySchedulePatch,
  buildAutoCopyFromSchedule,
  labelMatchesAuto,
  suggestStartsOn,
} from "@/lib/course-run-schedule";

type Props = {
  initialRuns: CourseRun[];
  /** Všechny přihlášky s vyplněným runId (i u smazaných id termínů). */
  occupancyByRunId: Record<string, RunRegistrationRow[]>;
  /** Web ještě běží na výchozích demo termínech z kódu. */
  usingDefaultRuns?: boolean;
};

function runsFingerprint(runs: CourseRun[]): string {
  return JSON.stringify(prepareRunsForSave(runs));
}

function emptyGroupRun(): CourseRun {
  const weekday = 2 as const;
  const startsOn = suggestStartsOn(weekday);
  const base: CourseRun = {
    id: `run-${crypto.randomUUID().slice(0, 10)}`,
    label: "",
    description: "",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn,
    weekday,
    lessonTime: "16:00",
    recurrence: "biweekly",
    active: true,
  };
  return { ...base, ...buildAutoCopyFromSchedule(base) };
}

function emptyIndividualRun(): CourseRun {
  const weekday = 2 as const;
  const startsOn = suggestStartsOn(weekday);
  const base: CourseRun = {
    id: `run-${crypto.randomUUID().slice(0, 10)}`,
    label: "",
    description: "",
    format: "individual",
    capacity: 1,
    filled: 0,
    startsOn,
    weekday,
    lessonTime: "16:00",
    recurrence: "biweekly",
    active: true,
  };
  return { ...base, ...buildAutoCopyFromSchedule(base) };
}

function countedTowardCapacity(rows: RunRegistrationRow[]): number {
  return rows.filter((r) => registrationCountsTowardRunCapacity(r.status))
    .length;
}

function newClientKey(): string {
  return crypto.randomUUID();
}

function createInitialEditorState(runs: CourseRun[]) {
  const clientKeys = runs.map(() => newClientKey());
  const manualCopyByKey: Record<string, boolean> = {};
  runs.forEach((run, i) => {
    manualCopyByKey[clientKeys[i]] = !labelMatchesAuto(run);
  });
  return { clientKeys, manualCopyByKey };
}

export function CourseRunsAdminClient({
  initialRuns,
  occupancyByRunId,
  usingDefaultRuns = false,
}: Props) {
  const router = useRouter();
  const [runs, setRuns] = useState<CourseRun[]>(initialRuns);
  const [savedFingerprint, setSavedFingerprint] = useState(() =>
    runsFingerprint(initialRuns),
  );
  const [editorState, setEditorState] = useState(() =>
    createInitialEditorState(initialRuns),
  );
  const clientKeys = editorState.clientKeys;
  const manualCopyByKey = editorState.manualCopyByKey;
  const [advancedOpenByKey, setAdvancedOpenByKey] = useState<
    Record<string, boolean>
  >({});
  const [expandedKey, setExpandedKey] = useState<string | null>(
    () => editorState.clientKeys[0] ?? null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const dirty = useMemo(
    () => runsFingerprint(runs) !== savedFingerprint,
    [runs, savedFingerprint],
  );

  useEffect(() => {
    setRuns(initialRuns);
    setSavedFingerprint(runsFingerprint(initialRuns));
    const nextEditor = createInitialEditorState(initialRuns);
    setEditorState(nextEditor);
    setExpandedKey((prev) =>
      prev && nextEditor.clientKeys.includes(prev)
        ? prev
        : (nextEditor.clientKeys[0] ?? null),
    );
  }, [initialRuns]);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const freeByRunId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const run of runs) {
      const rows = (occupancyByRunId[run.id] ?? []).filter(
        (row) => row.format === run.format,
      );
      map[run.id] = spotsLeftEffective(run, countedTowardCapacity(rows));
    }
    return map;
  }, [runs, occupancyByRunId]);

  async function reloadFromServer() {
    const res = await fetch("/api/admin/course-runs", {
      credentials: "same-origin",
    });
    const data: unknown = await res.json().catch(() => ({}));
    if (
      res.ok &&
      typeof data === "object" &&
      data &&
      "runs" in data &&
      Array.isArray((data as { runs: unknown }).runs)
    ) {
      const savedRuns = (data as { runs: CourseRun[] }).runs;
      setRuns(savedRuns);
      const nextEditor = createInitialEditorState(savedRuns);
      setEditorState(nextEditor);
      setExpandedKey((prev) =>
        prev && nextEditor.clientKeys.includes(prev)
          ? prev
          : (nextEditor.clientKeys[0] ?? null),
      );
    }
  }

  async function save() {
    setMessage(null);
    setError(null);
    const prepared = prepareRunsForSave(runs);
    const validationError = validateRunsForSave(prepared);
    if (validationError) {
      setError(validationError);
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/admin/course-runs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ runs: prepared }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const o = data as { error?: string; details?: { fieldErrors?: unknown } };
        const base =
          typeof o.error === "string" ? o.error : "Uložení se nezdařilo.";
        setError(base);
        return;
      }
      setRuns(prepared);
      setSavedFingerprint(runsFingerprint(prepared));
      setMessage(`Uloženo ${prepared.length} termínů. Zobrazují se na webu i zde v seznamu.`);
      await reloadFromServer();
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

  function updateFormatAt(index: number, format: CourseFormat) {
    const run = runs[index];
    if (!run) return;
    const rowKey = clientKeys[index];
    const manual = manualCopyByKey[rowKey] ?? false;
    const hasRegs =
      (occupancyByRunId[run.id]?.some((r) => r.format === run.format) ??
        false);
    const patch: Partial<CourseRun> = { format };
    if (format === "individual") {
      patch.capacity = Math.min(run.capacity, 1) || 1;
    } else if (run.format === "individual" && run.capacity <= 1) {
      patch.capacity = 6;
    }
    const next = applySchedulePatch(run, patch);
    if (manual) {
      updateAt(index, { format: next.format, capacity: next.capacity });
      return;
    }
    updateAt(index, buildAutoCopyFromSchedule(next, { lockId: hasRegs }));
  }

  function removeAt(index: number) {
    const run = runs[index];
    if (!run) return;
    const key = clientKeys[index];
    const regRows = occupancyByRunId[run.id] ?? [];
    const label = run.label.trim() || `Termín ${index + 1}`;
    const confirmed = window.confirm(
      regRows.length > 0
        ? `Termín „${label}“ má ${regRows.length} přihlášek. Po uložení zmizí ze seznamu — přihlášky zůstanou, ale ztratí propojení s tímto termínem. Pokračovat?`
        : `Odebrat „${label}" ze seznamu? Změna se projeví až po kliknutí na Uložit vše.`,
    );
    if (!confirmed) return;

    setRuns((prev) => prev.filter((_, i) => i !== index));
    setEditorState((prev) => ({
      clientKeys: prev.clientKeys.filter((_, i) => i !== index),
      manualCopyByKey: Object.fromEntries(
        Object.entries(prev.manualCopyByKey).filter(([k]) => k !== key),
      ),
    }));
    if (expandedKey === key) {
      const nextKeys = clientKeys.filter((_, i) => i !== index);
      setExpandedKey(nextKeys[0] ?? null);
    }
  }

  function addRun(run: CourseRun) {
    const key = newClientKey();
    setRuns((prev) => [...prev, run]);
    setEditorState((prev) => ({
      clientKeys: [...prev.clientKeys, key],
      manualCopyByKey: { ...prev.manualCopyByKey, [key]: false },
    }));
    setExpandedKey(key);
    requestAnimationFrame(() => {
      document.getElementById(`run-editor-${key}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function focusRun(key: string) {
    setExpandedKey(key);
    requestAnimationFrame(() => {
      document.getElementById(`run-editor-${key}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  const orphanEntries = Object.entries(occupancyByRunId).filter(
    ([id]) => !runs.some((r) => r.id === id),
  );

  return (
    <div className="mt-8 space-y-6">
      {usingDefaultRuns ? (
        <div className="portal-card border-l-4 border-amber-400 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 sm:px-5">
          <p className="font-bold">Web zobrazuje výchozí ukázkové termíny</p>
          <p className="mt-1 leading-relaxed">
            Na homepage a v registraci jsou zatím demo termíny. Upravte seznam
            níže a klikněte <strong>Uložit vše</strong> — pak se zobrazí vaše
            vlastní termíny.
          </p>
        </div>
      ) : null}

      {dirty ? (
        <div className="portal-card border-l-4 border-violet-500 bg-violet-50/90 px-4 py-3 text-sm text-violet-950 sm:px-5">
          <p className="font-bold">Máte neuložené změny</p>
          <p className="mt-1 leading-relaxed">
            Úpravy termínů se projeví na webu až po kliknutí na{" "}
            <strong>Uložit vše</strong>. Při odchodu ze stránky bez uložení
            změny zmizí.
          </p>
        </div>
      ) : null}

      <div className="portal-card border-violet-100 p-4 text-sm leading-relaxed text-slate-700 sm:p-5">
        <p>
          Skupinové termíny se nabízejí u přihlášky ve formátu „Skupina“,
          individuální u „1:1“. Výběr na webu je volitelný — rodič může nechat
          domluvu na později. Tabulka níže ukazuje přihlášky k termínu; zrušené
          se nepočítají do kapacity. Volná místa = kapacita minus větší z{" "}
          <strong>ručního obsazeno</strong> a <strong>počtu přihlášek</strong>.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          <strong>Rozvrh</strong> — den, čas a opakování; nadpis a popis pro web se
          doplní samy. <strong>Zrušit termín</strong> odebere ho z nabídky na
          přihlášce; stávající přihlášky zůstanou — můžete je v detailu přehodit
          na jiný termín.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => addRun(emptyGroupRun())}
          className="btn-portal-outline max-w-xs"
        >
          + Skupinový termín
        </button>
        <button
          type="button"
          onClick={() => addRun(emptyIndividualRun())}
          className="btn-portal-outline max-w-xs"
        >
          + Individuální slot
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={pending || !dirty}
          className={`btn-portal-primary max-w-xs ${dirty ? "ring-2 ring-violet-400 ring-offset-2" : ""}`}
        >
          {pending ? "Ukládám…" : dirty ? "Uložit vše *" : "Uloženo"}
        </button>
      </div>

      {error ? (
        <p className="alert-error" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="alert-success">{message}</p> : null}

      <CourseRunsOverview
        runs={runs}
        clientKeys={clientKeys}
        occupancyFreeByRunId={freeByRunId}
        expandedKey={expandedKey}
        onSelect={focusRun}
      />

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
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-slate-700">
          Úprava termínů
        </h2>
        {runs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600">
            Zatím žádné termíny. Přidejte skupinový běh nebo 1:1 slot, případně uložte prázdný
            seznam — na přihlášce se pak zobrazí jen obecná domluva.
          </p>
        ) : (
          runs.map((run, index) => {
            const rowKey = clientKeys[index];
            const manualCopy = manualCopyByKey[rowKey] ?? false;
            const advancedOpen = advancedOpenByKey[rowKey] ?? false;
            const rows = (occupancyByRunId[run.id] ?? []).filter(
              (row) => row.format === run.format,
            );
            const counted = countedTowardCapacity(rows);
            const free = spotsLeftEffective(run, counted);
            const active = run.active !== false;
            const expanded = expandedKey === rowKey;

            return (
              <div
                id={`run-editor-${rowKey}`}
                key={rowKey}
                className="portal-card scroll-mt-24 space-y-4 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
                      {run.label || `Termín ${index + 1}`}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-600">
                      {run.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-violet-900">
                        {run.format === "skupina" ? "Skupina" : "1:1"}
                      </span>
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
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedKey(expanded ? null : rowKey)
                      }
                      className="btn-portal-ghost text-xs"
                    >
                      {expanded ? "Sbalit editor" : "Rozbalit editor"}
                    </button>
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
                      Odstranit termín
                    </button>
                  </div>
                </div>

                {expanded ? (
                  <>
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

                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Formát nabídky
                    </label>
                    <select
                      value={run.format}
                      onChange={(e) =>
                        updateFormatAt(index, e.target.value as CourseFormat)
                      }
                      className="input-portal mt-1.5 block max-w-md"
                    >
                      <option value="skupina">Skupinový běh</option>
                      <option value="individual">Individuální 1:1</option>
                    </select>
                  </div>

                  <CourseRunScheduleEditor
                    scheduleKey={rowKey}
                    run={run}
                    lockId={rows.length > 0}
                    manualCopy={manualCopy}
                    onManualCopyChange={(manual) =>
                      setEditorState((prev) => ({
                        ...prev,
                        manualCopyByKey: {
                          ...prev.manualCopyByKey,
                          [rowKey]: manual,
                        },
                      }))
                    }
                    onChange={(patch) => updateAt(index, patch)}
                  />

                  {manualCopy ? (
                    <>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Krátký nadpis (pro rodiče)
                        </label>
                        <input
                          value={run.label}
                          onChange={(e) =>
                            updateAt(index, { label: e.target.value })
                          }
                          className="input-portal mt-1.5"
                        />
                      </div>
                      <div>
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
                    </>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Kapacita
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={run.format === "individual" ? 1 : 500}
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
                      <p className="mt-1 text-[11px] text-slate-500">
                        Volná místa počítáme z přihlášek; ruční číslo jen když
                        potřebujete override.
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setAdvancedOpenByKey((prev) => ({
                          ...prev,
                          [rowKey]: !advancedOpen,
                        }))
                      }
                      className="text-xs font-bold text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
                    >
                      {advancedOpen ? "Skrýt pokročilé" : "Pokročilé — technické id"}
                    </button>
                    {advancedOpen ? (
                      <div className="mt-3">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Technické id (bez mezer)
                        </label>
                        <input
                          value={run.id}
                          onChange={(e) =>
                            updateAt(index, { id: e.target.value })
                          }
                          className="input-portal mt-1.5 font-mono text-sm"
                          autoComplete="off"
                        />
                        <p className="mt-1 text-[11px] text-slate-500">
                          Propojuje přihlášky s termínem. Neměňte po spuštění
                          přihlašování, pokud už na termín někdo je.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
                </>
                ) : (
                  <p className="text-xs text-slate-500">
                    Klikněte na <strong>Rozbalit editor</strong> nebo{" "}
                    <strong>Upravit</strong> v tabulce výše.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
