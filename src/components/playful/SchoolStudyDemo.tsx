"use client";

import { useMemo, useState } from "react";
import {
  getPresetById,
  getSubjects,
  getTopicsForSubject,
  type StudyPreset,
} from "@/data/study-demo-presets";

const GEN_MS = 1900;

export function SchoolStudyDemo() {
  const subjects = useMemo(() => getSubjects(), []);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "math");

  const topics = useMemo(
    () => getTopicsForSubject(subjectId),
    [subjectId],
  );

  const [presetId, setPresetId] = useState(() => topics[0]?.presetId ?? "");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyPreset | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  function clearOutput() {
    setResult(null);
    setShowResults(false);
    setAnswers([]);
  }

  function onSubjectChange(nextSubjectId: string) {
    setSubjectId(nextSubjectId);
    const t = getTopicsForSubject(nextSubjectId);
    if (t[0]) setPresetId(t[0].presetId);
    clearOutput();
  }

  function onPresetChange(nextPresetId: string) {
    setPresetId(nextPresetId);
    clearOutput();
  }

  function generate() {
    const preset = getPresetById(presetId);
    if (!preset) return;
    setResult(null);
    setShowResults(false);
    setAnswers(preset.questions.map(() => null));
    setLoading(true);
    window.setTimeout(() => {
      setResult(preset);
      setLoading(false);
    }, GEN_MS);
  }

  function setAnswer(qi: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = optionIndex;
      return next;
    });
  }

  const correctCount = useMemo(() => {
    if (!result || !showResults) return 0;
    return result.questions.reduce((acc, q, i) => {
      return acc + (answers[i] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [result, showResults, answers]);

  return (
    <details className="snake-details card-playful mt-12 overflow-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50">
      <summary className="snake-summary flex cursor-pointer list-none flex-col gap-2 p-5 pr-12 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-br from-sky-300 to-indigo-400 text-3xl shadow-[3px_3px_0_#312e81]"
            aria-hidden
          >
            📚
          </span>
          <div>
            <p className="font-display text-xl font-extrabold text-[var(--magic-ink)] sm:text-2xl">
              AI a škola — příprava na zkoušku
            </p>
            <p className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">
              Ukázka toho, jak si můžeš nechat připravit shrnutí, procvičovací
              otázky a plán učení — třeba na test z přírodopisu nebo zlomků. Na
              kroužku si podobné věci postavíš s AI podle vlastního rozvrhu.
            </p>
          </div>
        </div>
        <span className="font-display snake-closed-hint text-sm font-bold text-violet-600 sm:mt-0 sm:text-right">
          Rozbal ▼
        </span>
        <span className="snake-open-hint font-display text-sm font-bold text-emerald-700 sm:text-right">
          Zavři ▲
        </span>
      </summary>

      <div className="border-t-[3px] border-dashed border-violet-200 px-5 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="block flex-1 min-w-[140px]">
              <span className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
                Předmět
              </span>
              <select
                className="input-playful mt-1"
                value={subjectId}
                onChange={(e) => onSubjectChange(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block flex-[2] min-w-[200px]">
              <span className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
                Téma
              </span>
              <select
                className="input-playful mt-1"
                value={presetId}
                onChange={(e) => onPresetChange(e.target.value)}
              >
                {topics.map((t) => (
                  <option key={t.presetId} value={t.presetId}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn-magic shrink-0 px-5 py-2.5 text-sm disabled:opacity-60"
              disabled={loading || !presetId}
              onClick={generate}
            >
              {loading ? "Generuji… ✨" : "Vygenerovat ukázku"}
            </button>
          </div>

          {loading ? (
            <div
              className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-300 bg-white/80 py-12"
              aria-live="polite"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              <p className="mt-4 font-display text-lg font-extrabold text-[var(--magic-ink)]">
                AI připravuje přípravu…
              </p>
              <p className="mt-1 text-center text-sm font-medium text-slate-600">
                (Na webu je to ukázka — na kurzu se naučíš, jak si podobný výstup
                opravdu vyžádat od ChatGPT nebo jiného nástroje.)
              </p>
            </div>
          ) : null}

          {result && !loading ? (
            <div className="mt-8 space-y-8">
              <section className="rounded-2xl border-2 border-violet-200 bg-white/90 p-5 shadow-[4px_4px_0_#c4b5fd]">
                <h3 className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                  Shrnutí (5 bodů)
                </h3>
                <ul className="mt-3 list-none space-y-2">
                  {result.summary.map((line, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm font-medium leading-relaxed text-slate-800"
                    >
                      <span
                        className="font-display font-extrabold text-violet-600"
                        aria-hidden
                      >
                        {i + 1}.
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-5">
                <h3 className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                  Procvičovací otázky
                </h3>
                <ol className="mt-4 space-y-5">
                  {result.questions.map((question, qi) => (
                    <li key={qi}>
                      <p className="text-sm font-bold text-slate-900">
                        {qi + 1}. {question.q}
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {question.options.map((opt, oi) => {
                          const id = `q${qi}-o${oi}`;
                          const selected = answers[qi] === oi;
                          let ring = "border-violet-200 bg-white";
                          if (showResults) {
                            if (oi === question.correctIndex) {
                              ring = "border-emerald-500 bg-emerald-50";
                            } else if (selected && oi !== question.correctIndex) {
                              ring = "border-red-400 bg-red-50";
                            }
                          } else if (selected) {
                            ring = "border-[var(--magic-ink)] bg-violet-50";
                          }
                          return (
                            <label
                              key={oi}
                              className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors ${ring}`}
                            >
                              <input
                                type="radio"
                                className="h-4 w-4 border-2 border-[var(--magic-ink)] text-violet-600"
                                name={`q-${qi}`}
                                id={id}
                                checked={selected}
                                disabled={showResults}
                                onChange={() => setAnswer(qi, oi)}
                              />
                              <span>
                                {String.fromCharCode(65 + oi)}) {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {!showResults ? (
                    <button
                      type="button"
                      className="btn-magic-outline px-5 py-2 text-sm"
                      onClick={() => setShowResults(true)}
                    >
                      Zkontrolovat odpovědi
                    </button>
                  ) : (
                    <p className="font-display text-base font-extrabold text-[var(--magic-ink)]">
                      Výsledek: {correctCount} / {result.questions.length}{" "}
                      správně
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5">
                <h3 className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                  Návrh plánu učení (3 dny)
                </h3>
                <ul className="mt-4 space-y-4">
                  {result.studyPlan.map((day, di) => (
                    <li
                      key={di}
                      className="rounded-xl border border-emerald-200 bg-white/90 p-4"
                    >
                      <p className="font-display font-extrabold text-emerald-800">
                        {day.label}
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium text-slate-800">
                        {day.tasks.map((t, ti) => (
                          <li key={ti}>{t}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="text-center text-xs font-semibold text-slate-500">
                Obsah je předpřipravený jako ukázka — na kurzu řešíš vlastní
                předměty a texty z učebnic.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}
