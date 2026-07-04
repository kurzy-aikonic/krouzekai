import Link from "next/link";
import {
  pilotCourseMeta,
  pilotFeedbackQuotes,
  pilotFeedbackRatings,
  pilotFeedbackSummary,
  realOutcomeProjects,
} from "@/data/real-student-outcomes";

type Props = {
  /** Kratší verze pro homepage; plná stránka zobrazí i hodnocení a citace. */
  variant?: "compact" | "full";
};

function RatingBar({ label, score, max = 5 }: { label: string; score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="shrink-0 font-display text-sm font-extrabold text-violet-800">
          {score}/{max}
        </span>
      </div>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"
        role="presentation"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function RealOutcomesContent({ variant = "full" }: Props) {
  const projects =
    variant === "compact" ? realOutcomeProjects.slice(0, 4) : realOutcomeProjects;

  return (
    <div className="space-y-12">
      <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50/80 via-white to-violet-50/60 p-6 sm:p-8">
        <p className="font-display text-xs font-extrabold uppercase tracking-wide text-sky-800">
          Z pilotního kurzu
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-800 sm:text-lg">
          Níže je reálný přehled z individuálního kurzu ({pilotCourseMeta.lessons}{" "}
          lekcí, {pilotCourseMeta.period}). Bez jmen — jen to, co dítě skutečně
          vytvořilo, naučilo se a jak kurz hodnotilo.
        </p>
        <dl className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
          <div className="rounded-full border border-sky-200 bg-white px-3 py-1.5">
            {pilotCourseMeta.format}
          </div>
          <div className="rounded-full border border-sky-200 bg-white px-3 py-1.5">
            {pilotCourseMeta.participantLabel}
          </div>
        </dl>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <li
            key={project.title}
            className="card-playful flex h-full flex-col border-2 border-violet-100 bg-white p-5 sm:p-6"
          >
            <span className="text-3xl" aria-hidden>
              {project.emoji}
            </span>
            <h3 className="font-display mt-3 text-lg font-extrabold text-[var(--magic-ink)]">
              {project.title}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
              {project.summary}
            </p>
            {variant === "full" ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {project.detail}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {variant === "compact" ? (
        <p className="text-center text-sm font-semibold text-violet-800">
          <Link href="/co-deti-tvori" className="underline decoration-violet-300 underline-offset-4 hover:text-violet-950">
            Celý příběh kurzu a hodnocení absolventa →
          </Link>
        </p>
      ) : null}

      {variant === "full" ? (
        <section
          aria-labelledby="feedback-heading"
          className="rounded-[2rem] border border-violet-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2
            id="feedback-heading"
            className="font-display text-2xl font-extrabold text-[var(--magic-ink)]"
          >
            Hodnocení absolventa kurzu
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Anonymní zpětná vazba po absolvování kurzu. Škála 1–5, kde 5 znamená
            nejvyšší spokojenost.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-800">
                Celková spokojenost
              </p>
              <p className="font-display mt-2 text-4xl font-extrabold text-emerald-900">
                {pilotFeedbackSummary.overallScore}/5
              </p>
            </div>
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/70 p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-violet-800">
                Průměr hodnocení
              </p>
              <p className="font-display mt-2 text-4xl font-extrabold text-violet-900">
                {pilotFeedbackSummary.averageScore}/5
              </p>
            </div>
            <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/70 p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-sky-800">
                Doporučil by kurz
              </p>
              <p className="font-display mt-2 text-2xl font-extrabold text-sky-900 sm:text-3xl">
                {pilotFeedbackSummary.wouldRecommend ? "Ano" : "Ne"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {pilotFeedbackRatings.map((r) => (
                <RatingBar key={r.label} label={r.label} score={r.score} />
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Tempo kurzu
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-slate-900">
                  {pilotFeedbackSummary.pace}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Počet a délka lekcí
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-slate-900">
                  {pilotFeedbackSummary.lessonLength}
                </p>
              </div>
              <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-violet-700">
                  Nejpřínosnější téma
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-violet-950">
                  {pilotFeedbackSummary.topTopic}
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {pilotFeedbackQuotes.map((q) => (
              <li
                key={q.question}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  {q.question}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800 sm:text-base">
                  {'„'}
                  {q.answer}
                  {'“'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
