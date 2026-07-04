"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CourseFormat, CourseRun } from "@/data/course-runs";
import {
  type RunRegistrationRow,
  registrationCountsTowardRunCapacity,
} from "@/lib/course-run-registrations";
import {
  prepareRunsForSave,
  runFingerprint,
  validateRunsForSave,
} from "@/lib/course-runs-admin-utils";
import {
  applySchedulePatch,
  buildAutoCopyFromSchedule,
  labelMatchesAuto,
  suggestStartsOn,
} from "@/lib/course-run-schedule";
import { CourseRunEditorPanel } from "@/components/admin/CourseRunEditorPanel";
import { CourseRunsOverview } from "@/components/admin/CourseRunsOverview";
import type { DefaultCoursePrices } from "@/lib/course-run-pricing";

type Props = {
  initialRuns: CourseRun[];
  occupancyByRunId: Record<string, RunRegistrationRow[]>;
  usingDefaultRuns?: boolean;
  defaultPricing: DefaultCoursePrices;
};

function emptyGroupRun(): CourseRun {
  const weekday = 2 as const;
  const startsOn = suggestStartsOn(weekday);
  const base: CourseRun = {
    id: `run-${crypto.randomUUID().slice(0, 10)}`,
    label: "",
    description: "",
    topic: "",
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
    topic: "",
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

function snapshotsFromRuns(
  runs: CourseRun[],
  keys: string[],
): Record<string, CourseRun> {
  const prepared = prepareRunsForSave(runs);
  const map: Record<string, CourseRun> = {};
  prepared.forEach((run, i) => {
    const key = keys[i];
    if (key) map[key] = { ...run };
  });
  return map;
}

function buildClientState(runs: CourseRun[]) {
  const editor = createInitialEditorState(runs);
  return {
    editor,
    snapshots: snapshotsFromRuns(runs, editor.clientKeys),
    selectedKey: editor.clientKeys[0] ?? null,
  };
}

export function CourseRunsAdminClient({
  initialRuns,
  occupancyByRunId,
  usingDefaultRuns = false,
  defaultPricing,
}: Props) {
  const router = useRouter();
  const initial = buildClientState(initialRuns);
  const [runs, setRuns] = useState<CourseRun[]>(initialRuns);
  const [editorState, setEditorState] = useState(initial.editor);
  const [savedSnapshots, setSavedSnapshots] = useState(initial.snapshots);
  const clientKeys = editorState.clientKeys;
  const manualCopyByKey = editorState.manualCopyByKey;
  const [selectedKey, setSelectedKey] = useState<string | null>(
    initial.selectedKey,
  );
  const [advancedOpenByKey, setAdvancedOpenByKey] = useState<
    Record<string, boolean>
  >({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const dirtyByKey = useMemo(() => {
    const map: Record<string, boolean> = {};
    runs.forEach((run, i) => {
      const key = clientKeys[i];
      if (!key) return;
      const saved = savedSnapshots[key];
      map[key] = saved
        ? runFingerprint(run) !== runFingerprint(saved)
        : true;
    });
    return map;
  }, [runs, clientKeys, savedSnapshots]);

  const dirtyCount = Object.values(dirtyByKey).filter(Boolean).length;

  const selectedIndex = selectedKey
    ? clientKeys.indexOf(selectedKey)
    : -1;

  useEffect(() => {
    const next = buildClientState(initialRuns);
    setRuns(initialRuns);
    setEditorState(next.editor);
    setSavedSnapshots(next.snapshots);
    setSelectedKey((prev) =>
      prev && next.editor.clientKeys.includes(prev)
        ? prev
        : next.selectedKey,
    );
  }, [initialRuns]);

  useEffect(() => {
    if (dirtyCount === 0) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirtyCount]);

  const occupancyCountByRunId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const run of runs) {
      const rows = (occupancyByRunId[run.id] ?? []).filter(
        (row) => row.format === run.format,
      );
      map[run.id] = rows.filter((r) =>
        registrationCountsTowardRunCapacity(r.status),
      ).length;
    }
    return map;
  }, [runs, occupancyByRunId]);

  async function reloadFromServer(keysHint: string[]) {
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
      setEditorState((prev) => {
        const nextKeys =
          savedRuns.length === keysHint.length
            ? keysHint
            : savedRuns.map((_, i) => prev.clientKeys[i] ?? newClientKey());
        const manual: Record<string, boolean> = {};
        savedRuns.forEach((run, i) => {
          manual[nextKeys[i]] = !labelMatchesAuto(run);
        });
        return { clientKeys: nextKeys, manualCopyByKey: manual };
      });
      const nextKeys =
        savedRuns.length === keysHint.length
          ? keysHint
          : savedRuns.map((_, i) => keysHint[i] ?? newClientKey());
      setSavedSnapshots(snapshotsFromRuns(savedRuns, nextKeys));
    }
  }

  async function persistRuns(
    successLabel: string,
    runsOverride?: CourseRun[],
    keysOverride?: string[],
  ) {
    setMessage(null);
    setError(null);
    const sourceRuns = runsOverride ?? runs;
    const keys = keysOverride ?? clientKeys;
    const prepared = prepareRunsForSave(sourceRuns);
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
        const o = data as { error?: string };
        setError(typeof o.error === "string" ? o.error : "Uložení se nezdařilo.");
        return;
      }
      setRuns(prepared);
      setSavedSnapshots(snapshotsFromRuns(prepared, keys));
      const storage =
        typeof data === "object" &&
        data &&
        "storage" in data &&
        typeof (data as { storage?: string }).storage === "string"
          ? (data as { storage: string }).storage
          : null;
      setMessage(
        `${successLabel}${storage ? ` (${storage})` : ""}. Zobrazí se na webu a v registraci.`,
      );
      await reloadFromServer(keys);
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

  function discardAt(index: number) {
    const key = clientKeys[index];
    const saved = savedSnapshots[key];
    if (!saved) return;
    if (
      !window.confirm(
        "Zahodit neuložené změny u tohoto termínu a vrátit poslední uloženou verzi?",
      )
    ) {
      return;
    }
    updateAt(index, { ...saved });
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

  async function removeAt(index: number) {
    const run = runs[index];
    if (!run) return;
    const key = clientKeys[index];
    const regRows = occupancyByRunId[run.id] ?? [];
    const label = run.label.trim() || `Termín ${index + 1}`;
    const confirmed = window.confirm(
      regRows.length > 0
        ? `Termín „${label}“ má ${regRows.length} přihlášek. Odebráním zmizí z nabídky — přihlášky zůstanou bez propojení. Pokračovat?`
        : `Odebrat termín „${label}"?`,
    );
    if (!confirmed) return;

    const nextRuns = runs.filter((_, i) => i !== index);
    const nextKeys = clientKeys.filter((_, i) => i !== index);
    const nextManual = Object.fromEntries(
      Object.entries(manualCopyByKey).filter(([k]) => k !== key),
    );

    setRuns(nextRuns);
    setEditorState({
      clientKeys: nextKeys,
      manualCopyByKey: nextManual,
    });
    setSavedSnapshots((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    const nextSelected = selectedKey === key ? (nextKeys[0] ?? null) : selectedKey;
    setSelectedKey(nextSelected);

    await persistRuns(`Termín „${label}“ odebrán`, nextRuns, nextKeys);
  }

  function addRun(run: CourseRun) {
    const key = newClientKey();
    setRuns((prev) => [...prev, run]);
    setEditorState((prev) => ({
      clientKeys: [...prev.clientKeys, key],
      manualCopyByKey: { ...prev.manualCopyByKey, [key]: false },
    }));
    setSelectedKey(key);
    requestAnimationFrame(() => {
      document.getElementById(`run-editor-${key}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function selectRun(key: string) {
    if (
      selectedKey &&
      selectedKey !== key &&
      dirtyByKey[selectedKey] &&
      !window.confirm(
        "U tohoto termínu máte neuložené změny. Přepnout bez uložení?",
      )
    ) {
      return;
    }
    setSelectedKey(key);
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

  const selectedRun = selectedIndex >= 0 ? runs[selectedIndex] : null;
  const selectedRowKey = selectedIndex >= 0 ? clientKeys[selectedIndex] : null;

  return (
    <div className="mt-8 space-y-6">
      {usingDefaultRuns ? (
        <div className="portal-card border-l-4 border-amber-400 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 sm:px-5">
          <p className="font-bold">Web zobrazuje ukázkové termíny</p>
          <p className="mt-1 leading-relaxed">
            Upravte termín níže a klikněte <strong>Uložit termín</strong> — pak
            se na webu objeví vaše nabídka.
          </p>
        </div>
      ) : null}

      <div className="portal-card border-violet-100 p-4 text-sm leading-relaxed text-slate-700 sm:p-5">
        <p>
          Vyberte termín v tabulce, upravte ho v editoru a uložte tlačítkem{" "}
          <strong>Uložit termín</strong> dole u karty. Skupina startuje až po
          100 % kapacity.
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
        {dirtyCount > 1 ? (
          <button
            type="button"
            onClick={() => void persistRuns(`Uloženo ${dirtyCount} termínů`)}
            disabled={pending}
            className="btn-portal-primary max-w-xs"
          >
            {pending ? "Ukládám…" : `Uložit vše (${dirtyCount})`}
          </button>
        ) : null}
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
        occupancyCountByRunId={occupancyCountByRunId}
        selectedKey={selectedKey}
        dirtyByKey={dirtyByKey}
        defaultPricing={defaultPricing}
        onSelect={selectRun}
      />

      {runs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-10 text-center text-sm text-slate-600">
          Zatím žádný termín. Přidejte skupinový běh nebo 1:1 slot výše.
        </p>
      ) : selectedRun && selectedRowKey && selectedIndex >= 0 ? (
        <CourseRunEditorPanel
          run={selectedRun}
          index={selectedIndex}
          rowKey={selectedRowKey}
          dirty={dirtyByKey[selectedRowKey] ?? false}
          pending={pending}
          manualCopy={manualCopyByKey[selectedRowKey] ?? false}
          advancedOpen={advancedOpenByKey[selectedRowKey] ?? false}
          regRows={(occupancyByRunId[selectedRun.id] ?? []).filter(
            (row) => row.format === selectedRun.format,
          )}
          defaultPricing={defaultPricing}
          onManualCopyChange={(manual) =>
            setEditorState((prev) => ({
              ...prev,
              manualCopyByKey: {
                ...prev.manualCopyByKey,
                [selectedRowKey]: manual,
              },
            }))
          }
          onAdvancedToggle={() =>
            setAdvancedOpenByKey((prev) => ({
              ...prev,
              [selectedRowKey]: !prev[selectedRowKey],
            }))
          }
          onChange={(patch) => updateAt(selectedIndex, patch)}
          onFormatChange={(format) => updateFormatAt(selectedIndex, format)}
          onSave={() =>
            void persistRuns(
              `Termín „${selectedRun.label.trim() || `Termín ${selectedIndex + 1}`}“ uložen`,
            )
          }
          onDiscard={() => discardAt(selectedIndex)}
          onToggleActive={() =>
            updateAt(selectedIndex, {
              active: selectedRun.active === false,
            })
          }
          onRemove={() => removeAt(selectedIndex)}
        />
      ) : (
        <p className="portal-card px-4 py-8 text-center text-sm text-slate-600">
          Vyberte termín v tabulce a klikněte na <strong>Upravit</strong>.
        </p>
      )}

      {orphanEntries.length > 0 ? (
        <div className="portal-card border-l-4 border-amber-400 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p className="font-bold">Přihlášky u smazaných termínů</p>
          <p className="mt-1 text-xs">
            Přiřaďte v detailu přihlášky platný termín.
          </p>
        </div>
      ) : null}
    </div>
  );
}
