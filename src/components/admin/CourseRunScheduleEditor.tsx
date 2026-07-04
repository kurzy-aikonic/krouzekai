"use client";

import type { CourseRun } from "@/data/course-runs";
import {
  applySchedulePatch,
  buildAutoCopyFromSchedule,
  formatScheduleDescription,
  formatScheduleLabel,
  formatScheduleSummary,
  RECURRENCE_OPTIONS,
  suggestStartsOn,
  WEEKDAYS_CS,
  withScheduleDefaults,
  type CourseRecurrence,
  type WeekdayIso,
} from "@/lib/course-run-schedule";
import { COURSE_DIFFICULTY_OPTIONS } from "@/lib/course-run-difficulty";

type Props = {
  scheduleKey: string;
  run: CourseRun;
  /** Termín už má přihlášky — neměnit technické id automaticky. */
  lockId?: boolean;
  onChange: (patch: Partial<CourseRun>) => void;
  manualCopy: boolean;
  onManualCopyChange: (manual: boolean) => void;
};

export function CourseRunScheduleEditor({
  scheduleKey,
  run,
  lockId = false,
  onChange,
  manualCopy,
  onManualCopyChange,
}: Props) {
  const schedule = withScheduleDefaults(run);

  function commitSchedule(patch: Partial<CourseRun>) {
    const next = applySchedulePatch(run, patch);
    if (manualCopy) {
      onChange({
        startsOn: next.startsOn,
        weekday: next.weekday,
        lessonTime: next.lessonTime,
        recurrence: next.recurrence,
      });
      return;
    }
    onChange(buildAutoCopyFromSchedule(next, { lockId }));
  }

  function setWeekday(weekday: WeekdayIso) {
    commitSchedule({ weekday });
  }

  function setLessonTime(lessonTime: string) {
    commitSchedule({ lessonTime });
  }

  function setRecurrence(recurrence: CourseRecurrence) {
    commitSchedule({ recurrence });
  }

  function setStartsOn(startsOn: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startsOn)) return;
    commitSchedule({ startsOn });
  }

  function alignStartToWeekday() {
    commitSchedule({
      startsOn: suggestStartsOn(schedule.weekday as WeekdayIso),
    });
  }

  function regenerateCopy() {
    onChange(buildAutoCopyFromSchedule(schedule, { lockId }));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 sm:p-5">
        <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-900">
          Rozvrh lekcí
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Vyberte den, čas a opakování — texty pro rodiče se doplní automaticky.
          Datum a den v týdnu se navzájem synchronizují.
        </p>

        <div className="mt-4">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Den v týdnu
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {WEEKDAYS_CS.map((day) => {
              const selected = schedule.weekday === day.value;
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setWeekday(day.value)}
                  title={day.label}
                  className={`min-w-[2.75rem] rounded-lg border-2 px-3 py-2 text-sm font-bold transition ${
                    selected
                      ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                      : "border-violet-200 bg-white text-violet-900 hover:border-violet-400"
                  }`}
                >
                  {day.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`lesson-time-${scheduleKey}`}
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Čas lekce
            </label>
            <input
              id={`lesson-time-${scheduleKey}`}
              type="time"
              value={schedule.lessonTime}
              onChange={(e) => setLessonTime(e.target.value)}
              className="input-portal mt-1.5"
            />
          </div>
          <div>
            <label
              htmlFor={`starts-on-${scheduleKey}`}
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Datum první lekce
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <input
                id={`starts-on-${scheduleKey}`}
                type="date"
                value={schedule.startsOn}
                onChange={(e) => setStartsOn(e.target.value)}
                className="input-portal min-w-0 flex-1"
              />
              <button
                type="button"
                onClick={alignStartToWeekday}
                className="btn-portal-ghost shrink-0 text-xs"
                title={`Navrhnout nejbližší ${WEEKDAYS_CS.find((d) => d.value === schedule.weekday)?.label ?? "den"}`}
              >
                Navrhnout datum
              </button>
            </div>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Opakování
          </legend>
          <div className="mt-2 space-y-2">
            {RECURRENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-3 py-2.5 transition ${
                  schedule.recurrence === opt.value
                    ? "border-violet-500 bg-white"
                    : "border-violet-100 bg-white/70 hover:border-violet-300"
                }`}
              >
                <input
                  type="radio"
                  name={`recurrence-${scheduleKey}`}
                  checked={schedule.recurrence === opt.value}
                  onChange={() => setRecurrence(opt.value)}
                  className="mt-1 h-4 w-4 border-2 border-violet-400 text-violet-600"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    {opt.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Náhled pro rodiče
        </p>
        <p className="mt-2 font-display text-base font-extrabold text-violet-950">
          {manualCopy ? run.label || "—" : formatScheduleLabel(schedule)}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          {manualCopy
            ? run.description || "—"
            : formatScheduleDescription(schedule)}
        </p>
        {run.topic?.trim() || run.difficulty ? (
          <p className="mt-2 text-xs text-slate-600">
            {run.topic?.trim() ? (
              <>
                <strong>Téma:</strong> {run.topic.trim()}
              </>
            ) : null}
            {run.difficulty ? (
              <>
                {run.topic?.trim() ? " · " : ""}
                <strong>
                  {COURSE_DIFFICULTY_OPTIONS.find(
                    (o) => o.value === run.difficulty,
                  )?.label ?? run.difficulty}
                </strong>
              </>
            ) : null}
          </p>
        ) : null}
        <p className="mt-2 text-xs font-medium text-slate-500">
          {formatScheduleSummary(schedule)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={manualCopy}
            onChange={(e) => onManualCopyChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-violet-600"
          />
          Upravovat nadpis a popis ručně
        </label>
        {manualCopy ? (
          <button
            type="button"
            onClick={regenerateCopy}
            className="text-xs font-bold text-violet-800 underline decoration-violet-300 underline-offset-2 hover:text-violet-950"
          >
            Znovu vygenerovat z rozvrhu
          </button>
        ) : null}
      </div>
    </div>
  );
}
