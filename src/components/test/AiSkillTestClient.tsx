"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AI_SKILL_PRO_CONFIRMATION_QUESTIONS,
  AI_SKILL_LEVEL_HINTS,
  AI_SKILL_LEVEL_LABELS,
  AI_SKILL_TEST_QUESTIONS,
  type AiSkillLevel,
  aiSkillProConfirmationMaxScore,
  aiSkillMaxScore,
  confirmProfessionalLevel,
  evaluateAiSkillLevel,
} from "@/lib/ai-skill-test";

const STORAGE_KEY = "krouzekai.aiSkillTestResult";

function shuffleArray<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function shuffleQuestions(
  questions: readonly {
    id: string;
    prompt: string;
    answers: readonly { id: string; text: string; points: number }[];
  }[],
) {
  return questions.map((q) => ({
    ...q,
    answers: shuffleArray(q.answers),
  }));
}

export function AiSkillTestClient() {
  const [baseQuestions, setBaseQuestions] = useState(() =>
    shuffleQuestions(AI_SKILL_TEST_QUESTIONS),
  );
  const [proQuestions, setProQuestions] = useState(() =>
    shuffleQuestions(AI_SKILL_PRO_CONFIRMATION_QUESTIONS),
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [proAnswers, setProAnswers] = useState<Record<string, number>>({});
  const [showProConfirmation, setShowProConfirmation] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const completed = answeredCount === baseQuestions.length;

  const baseResult = useMemo(() => {
    if (!completed) return null;
    const score = Object.values(answers).reduce((sum, x) => sum + x, 0);
    const level = evaluateAiSkillLevel(score);
    return { score, level };
  }, [answers, completed]);

  const needsProConfirmation = baseResult?.level === "professional";
  const proAnsweredCount = Object.keys(proAnswers).length;
  const proCompleted = proAnsweredCount === proQuestions.length;

  const finalResult = useMemo<{
    level: AiSkillLevel;
    score: number;
    maxScore: number;
    confirmed: boolean;
    baseScore?: number;
  } | null>(() => {
    if (!baseResult) return null;
    if (baseResult.level !== "professional") {
      return {
        level: baseResult.level,
        score: baseResult.score,
        maxScore: aiSkillMaxScore(),
        confirmed: true,
      };
    }
    if (!showProConfirmation || !proCompleted) return null;
    const proScore = Object.values(proAnswers).reduce((sum, x) => sum + x, 0);
    const confirmed = confirmProfessionalLevel(proScore);
    return {
      level: confirmed ? "professional" : "advanced",
      score: proScore,
      maxScore: aiSkillProConfirmationMaxScore(),
      confirmed,
      baseScore: baseResult.score,
    };
  }, [baseResult, proAnswers, proCompleted, showProConfirmation]);

  function selectAnswer(questionId: string, points: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
  }

  function selectProAnswer(questionId: string, points: number) {
    setProAnswers((prev) => ({ ...prev, [questionId]: points }));
  }

  function resetAll() {
    setAnswers({});
    setProAnswers({});
    setShowProConfirmation(false);
    setBaseQuestions(shuffleQuestions(AI_SKILL_TEST_QUESTIONS));
    setProQuestions(shuffleQuestions(AI_SKILL_PRO_CONFIRMATION_QUESTIONS));
  }

  useEffect(() => {
    if (!finalResult) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          level: finalResult.level,
          score: finalResult.score,
          answeredAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Bezpečně ignorujeme (private mode / omezení browseru).
    }
  }, [finalResult]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-sm text-violet-950">
        Test má {baseQuestions.length} krátkých otázek. Na konci dostanete
        doporučenou úroveň: <strong>Začátečník</strong>, <strong>Pokročilý</strong> nebo{" "}
        <strong>Profesionál</strong>. Pokud vyjde profesionál, otevře se ještě
        náročný potvrzovací test.
      </div>

      <div className="space-y-4">
        {baseQuestions.map((q, index) => (
          <section key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              {index + 1}. {q.prompt}
            </h2>
            <div className="mt-3 space-y-2">
              {q.answers.map((a) => {
                const active = answers[q.id] === a.points;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => selectAnswer(q.id, a.points)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                      active
                        ? "border-violet-400 bg-violet-50 text-violet-950"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/40"
                    }`}
                  >
                    {a.text}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">
          Vyplněno: <strong>{answeredCount}</strong> / {baseQuestions.length}
        </p>

        {baseResult ? (
          <div className="mt-4 space-y-3">
            <p className="font-display text-xl font-extrabold text-violet-900">
              První vyhodnocení: {AI_SKILL_LEVEL_LABELS[baseResult.level]}
            </p>
            <p className="text-sm text-slate-700">
              Skóre: <strong>{baseResult.score}</strong> / {aiSkillMaxScore()}
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {AI_SKILL_LEVEL_HINTS[baseResult.level]}
            </p>

            {needsProConfirmation && !showProConfirmation ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-950">
                  Vyšla úroveň profesionál. Ještě potřebujeme potvrzení přes
                  náročný doplňkový test.
                </p>
                <button
                  type="button"
                  className="btn-magic mt-3"
                  onClick={() => setShowProConfirmation(true)}
                >
                  Spustit náročný potvrzovací test
                </button>
              </div>
            ) : null}

            {showProConfirmation ? (
              <div className="space-y-4 rounded-xl border border-violet-200 bg-violet-50/40 p-4">
                <h3 className="font-display text-lg font-extrabold text-violet-900">
                  Potvrzovací test úrovně Profesionál
                </h3>
                {proQuestions.map((q, index) => (
                  <section key={q.id} className="rounded-xl border border-violet-100 bg-white p-4">
                    <h4 className="font-semibold text-slate-900">
                      {index + 1}. {q.prompt}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {q.answers.map((a) => {
                        const active = proAnswers[q.id] === a.points;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => selectProAnswer(q.id, a.points)}
                            className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                              active
                                ? "border-violet-400 bg-violet-50 text-violet-950"
                                : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/40"
                            }`}
                          >
                            {a.text}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
                <p className="text-sm text-slate-700">
                  Vyplněno: <strong>{proAnsweredCount}</strong> / {proQuestions.length}
                </p>
              </div>
            ) : null}

            {finalResult ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-display text-lg font-extrabold text-emerald-900">
                  Finální úroveň: {AI_SKILL_LEVEL_LABELS[finalResult.level]}
                </p>
                {needsProConfirmation ? (
                  <p className="mt-1 text-sm text-emerald-900">
                    Potvrzovací skóre: <strong>{finalResult.score}</strong> /{" "}
                    {finalResult.maxScore}
                  </p>
                ) : null}
                {needsProConfirmation && !finalResult.confirmed ? (
                  <p className="mt-2 text-sm text-emerald-900">
                    Náročný test úroveň profesionál nepotvrdil, doporučujeme
                    zařazení jako pokročilý.
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    href={`/registrace?aiLevel=${encodeURIComponent(finalResult.level)}`}
                    className="btn-magic"
                  >
                    Použít výsledek v registraci
                  </Link>
                  <button type="button" className="btn-magic-outline" onClick={resetAll}>
                    Vyplnit test znovu
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn-magic-outline" onClick={resetAll}>
                Vyplnit test znovu
              </button>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Pro vyhodnocení je potřeba zodpovědět všechny otázky.
          </p>
        )}
      </div>
    </div>
  );
}
