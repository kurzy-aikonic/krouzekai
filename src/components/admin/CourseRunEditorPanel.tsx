"use client";

import Link from "next/link";
import type { CourseFormat, CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import { CourseRunScheduleEditor } from "@/components/admin/CourseRunScheduleEditor";
import {
  type RunRegistrationRow,
  registrationCountsTowardRunCapacity,
} from "@/lib/course-run-registrations";
import { COURSE_DIFFICULTY_OPTIONS } from "@/lib/course-run-difficulty";
import {
  effectiveRunPriceCzk,
  runPriceScopeLabel,
  type DefaultCoursePrices,
} from "@/lib/course-run-pricing";
import { registrationStatusPillClassName } from "@/lib/registration-status-ui";
import { registrationStatusLabelsCs } from "@/types/registration";

type Props = {
  run: CourseRun;
  index: number;
  rowKey: string;
  dirty: boolean;
  pending: boolean;
  manualCopy: boolean;
  advancedOpen: boolean;
  regRows: RunRegistrationRow[];
  defaultPricing: DefaultCoursePrices;
  onManualCopyChange: (manual: boolean) => void;
  onAdvancedToggle: () => void;
  onChange: (patch: Partial<CourseRun>) => void;
  onFormatChange: (format: CourseFormat) => void;
  onSave: () => void;
  onDiscard: () => void;
  onToggleActive: () => void;
  onRemove: () => void;
};

function countedTowardCapacity(rows: RunRegistrationRow[]): number {
  return rows.filter((r) => registrationCountsTowardRunCapacity(r.status))
    .length;
}

export function CourseRunEditorPanel({
  run,
  index,
  rowKey,
  dirty,
  pending,
  manualCopy,
  advancedOpen,
  regRows,
  defaultPricing,
  onManualCopyChange,
  onAdvancedToggle,
  onChange,
  onFormatChange,
  onSave,
  onDiscard,
  onToggleActive,
  onRemove,
}: Props) {
  const counted = countedTowardCapacity(regRows);
  const free = spotsLeftEffective(run, counted);
  const active = run.active !== false;
  const defaultPrice =
    run.format === "individual"
      ? defaultPricing.individualCourseCzk
      : defaultPricing.skupinaCourseCzk;
  const effectivePrice = effectiveRunPriceCzk(run, defaultPricing);
  const priceScope = runPriceScopeLabel(run);

  return (
    <div
      id={`run-editor-${rowKey}`}
      className="portal-card scroll-mt-24 overflow-hidden border-violet-200 p-0"
    >
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/90 to-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-violet-700">
              Úprava termínu {index + 1}
            </p>
            <h2 className="font-display mt-1 text-lg font-extrabold text-slate-900">
              {run.label.trim() || "Nový termín"}
            </h2>
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
                {active ? "V nabídce" : "Skrytý"}
              </span>
              {dirty ? (
                <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-900">
                  Neuloženo
                </span>
              ) : (
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
                  Uloženo
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggleActive}
              className="btn-portal-ghost text-xs"
            >
              {active ? "Skrýt z webu" : "Zobrazit na webu"}
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-bold text-red-700 underline decoration-red-300 underline-offset-2 hover:text-red-900"
            >
              Odstranit
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-4 py-5 sm:px-6 sm:py-6">
        <section className="space-y-3">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-slate-700">
            1 · Formát nabídky
          </h3>
          <select
            value={run.format}
            onChange={(e) => onFormatChange(e.target.value as CourseFormat)}
            className="input-portal block max-w-md"
          >
            <option value="skupina">Skupinový kurz</option>
            <option value="individual">Individuální 1:1</option>
          </select>
        </section>

        <section className="space-y-3">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-slate-700">
            2 · Rozvrh
          </h3>
          <CourseRunScheduleEditor
            scheduleKey={rowKey}
            run={run}
            lockId={regRows.length > 0}
            manualCopy={manualCopy}
            onManualCopyChange={onManualCopyChange}
            onChange={onChange}
          />
        </section>

        <section className="space-y-4 rounded-xl border border-violet-100 bg-violet-50/30 p-4 sm:p-5">
          <div>
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-slate-700">
              3 · Obsah kurzu
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Téma a náročnost uvidí rodiče u termínu na webu a v registraci.
            </p>
          </div>

          <div>
            <label
              htmlFor={`topic-${rowKey}`}
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Téma / zaměření
            </label>
            <textarea
              id={`topic-${rowKey}`}
              value={run.topic ?? ""}
              onChange={(e) => onChange({ topic: e.target.value })}
              rows={3}
              placeholder="Např. Vibecoding her v Roblox stylu, tvorba chatbotů pro školu, pixelové hry s AI…"
              className="input-portal mt-1.5 min-h-[5rem] resize-y"
            />
          </div>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Náročnost
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 has-[:checked]:border-violet-500">
                <input
                  type="radio"
                  name={`difficulty-${rowKey}`}
                  checked={!run.difficulty}
                  onChange={() => onChange({ difficulty: undefined })}
                  className="mt-0.5 h-4 w-4 text-violet-600"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Neuvedeno
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Bez badge na webu
                  </span>
                </span>
              </label>
              {COURSE_DIFFICULTY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl border-2 px-3 py-2.5 has-[:checked]:border-violet-500 ${opt.badgeClass}`}
                >
                  <input
                    type="radio"
                    name={`difficulty-${rowKey}`}
                    checked={run.difficulty === opt.value}
                    onChange={() => onChange({ difficulty: opt.value })}
                    className="mt-0.5 h-4 w-4 text-violet-600"
                  />
                  <span>
                    <span className="block text-sm font-bold">{opt.label}</span>
                    <span className="mt-0.5 block text-xs opacity-90">
                      {opt.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {manualCopy ? (
            <div className="grid gap-4 border-t border-violet-100 pt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Vlastní nadpis
                </label>
                <input
                  value={run.label}
                  onChange={(e) => onChange({ label: e.target.value })}
                  className="input-portal mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Vlastní popis
                </label>
                <textarea
                  value={run.description}
                  onChange={(e) => onChange({ description: e.target.value })}
                  rows={2}
                  className="input-portal mt-1.5 min-h-[4.5rem] resize-y"
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
          <div>
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-slate-700">
              4 · Cena termínu
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {run.format === "individual"
                ? "Celková cena individuálního kurzu 1:1 pro jednoho účastníka."
                : "Cena skupinového kurzu za jedno dítě."}{" "}
              Nechte prázdné pro výchozí cenu z{" "}
              <strong>Nástroje → Ceny kurzů</strong> (
              {defaultPrice.toLocaleString("cs-CZ")} Kč).
            </p>
          </div>
          <div className="max-w-xs">
            <label
              htmlFor={`price-${rowKey}`}
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Vlastní cena (Kč)
            </label>
            <input
              id={`price-${rowKey}`}
              type="number"
              min={100}
              max={500000}
              step={100}
              value={run.priceCzk ?? ""}
              onChange={(e) => {
                const raw = e.target.value.trim();
                onChange({
                  priceCzk: raw === "" ? undefined : Number(raw) || undefined,
                });
              }}
              placeholder={String(defaultPrice)}
              className="input-portal mt-1.5"
            />
          </div>
          <p className="text-sm font-semibold text-emerald-950">
            Rodič uvidí:{" "}
            <strong>{effectivePrice.toLocaleString("cs-CZ")} Kč</strong> (
            {priceScope})
            {run.priceCzk != null && run.priceCzk >= 100 ? (
              <span className="ml-2 text-xs font-bold text-amber-800">
                · vlastní cena termínu
              </span>
            ) : (
              <span className="ml-2 text-xs font-medium text-slate-600">
                · výchozí globální cena
              </span>
            )}
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-slate-700">
            5 · Kapacita
          </h3>
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
                  onChange({ capacity: Number(e.target.value) || 1 })
                }
                className="input-portal mt-1.5"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Skupina startuje až po {run.capacity}/{run.capacity} místech.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Ruční obsazenost (volitelné)
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                value={run.filled}
                onChange={(e) =>
                  onChange({ filled: Number(e.target.value) || 0 })
                }
                className="input-portal mt-1.5"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Z přihlášek: {counted} · volno cca {free}
              </p>
            </div>
          </div>
        </section>

        {regRows.length > 0 ? (
          <section className="space-y-3">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wide text-slate-700">
              Přihlášky k termínu
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Kód</th>
                    <th className="px-3 py-2">Dítě</th>
                    <th className="px-3 py-2">Rodič</th>
                    <th className="px-3 py-2">Stav</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {regRows.map((row) => (
                    <tr key={row.id} className="bg-white">
                      <td className="px-3 py-2 font-mono font-semibold">
                        {row.publicCode}
                      </td>
                      <td className="px-3 py-2 font-medium">{row.childName}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {row.parentName}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase ${registrationStatusPillClassName(row.status)}`}
                        >
                          {registrationStatusLabelsCs[row.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/admin/registrations/${encodeURIComponent(row.publicCode)}`}
                          className="font-bold text-violet-700 underline"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <div>
          <button
            type="button"
            onClick={onAdvancedToggle}
            className="text-xs font-bold text-slate-600 underline decoration-slate-300 underline-offset-2"
          >
            {advancedOpen ? "Skrýt technické id" : "Technické id termínu"}
          </button>
          {advancedOpen ? (
            <div className="mt-3 max-w-lg">
              <input
                value={run.id}
                onChange={(e) => onChange({ id: e.target.value })}
                className="input-portal font-mono text-sm"
                autoComplete="off"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Propojuje přihlášky s termínem. Neměňte, pokud už někdo přihlášený
                je.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-violet-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <button
          type="button"
          disabled={pending || !dirty}
          onClick={onSave}
          className={`btn-portal-primary max-w-xs ${dirty ? "ring-2 ring-violet-400 ring-offset-2" : ""}`}
        >
          {pending ? "Ukládám…" : dirty ? "Uložit termín" : "Termín uložen"}
        </button>
        <button
          type="button"
          disabled={pending || !dirty}
          onClick={onDiscard}
          className="btn-portal-outline max-w-xs py-2 text-xs"
        >
          Zrušit úpravy
        </button>
        {dirty ? (
          <p className="w-full text-xs text-amber-800 sm:w-auto sm:flex-1">
            Změny se projeví na webu až po uložení.
          </p>
        ) : null}
      </div>
    </div>
  );
}
