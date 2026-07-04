"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AI_SKILL_LEVEL_HINTS,
  AI_SKILL_LEVEL_LABELS,
  AI_SKILL_TEST_QUESTIONS,
  aiSkillMaxScore,
  evaluateAiSkillLevel,
} from "@/lib/ai-skill-test";

const STORAGE_KEY = "krouzekai.aiSkillTestResult";

export function AiSkillTestClient() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answeredCount = Object.keys(answers).length;
  const completed = answeredCount === AI_SKILL_TEST_QUESTIONS.length;

  const result = useMemo(() => {
    if (!completed) return null;
    const score = Object.values(answers).reduce((sum, x) => sum + x, 0);
    const level = evaluateAiSkillLevel(score);
    return { score, level };
  }, [answers, completed]);

  function selectAnswer(questionId: string, points: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
  }

  useEffect(() => {
    if (!result) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          level: result.level,
          score: result.score,
          answeredAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Bezpečně ignorujeme (private mode / omezení browseru).
    }
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-sm text-violet-950">
        Test má {AI_SKILL_TEST_QUESTIONS.length} krátkých otázek. Na konci dostanete
        doporučenou úroveň: <strong>Začátečník</strong>, <strong>Pokročilý</strong> nebo{" "}
        <strong>Profesionál</strong>.
      </div>

      <div className="space-y-4">
        {AI_SKILL_TEST_QUESTIONS.map((q, index) => (
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
          Vyplněno: <strong>{answeredCount}</strong> / {AI_SKILL_TEST_QUESTIONS.length}
        </p>

        {result ? (
          <div className="mt-4 space-y-3">
            <p className="font-display text-xl font-extrabold text-violet-900">
              Doporučená úroveň: {AI_SKILL_LEVEL_LABELS[result.level]}
            </p>
            <p className="text-sm text-slate-700">
              Skóre: <strong>{result.score}</strong> / {aiSkillMaxScore()}
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {AI_SKILL_LEVEL_HINTS[result.level]}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={`/registrace?aiLevel=${encodeURIComponent(result.level)}`}
                className="btn-magic"
              >
                Použít výsledek v registraci
              </Link>
              <button
                type="button"
                className="btn-magic-outline"
                onClick={() => setAnswers({})}
              >
                Vyplnit test znovu
              </button>
            </div>
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
