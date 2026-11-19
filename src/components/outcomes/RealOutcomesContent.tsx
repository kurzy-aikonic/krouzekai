import { Gamepad2, Globe, Map, PenLine, Search, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  pilotCourseMeta,
  pilotFeedbackQuotes,
  pilotFeedbackRatings,
  pilotFeedbackSummary,
  realOutcomeProjects,
  type OutcomeIcon,
} from "@/data/real-student-outcomes";

const outcomeIcons: Record<OutcomeIcon, LucideIcon> = {
  "gamepad-2": Gamepad2,
  "pen-line": PenLine,
  map: Map,
  globe: Globe,
  search: Search,
};

function OutcomeIconChip({ name, accent }: { name: OutcomeIcon; accent: "orange" | "violet" }) {
  const Icon = outcomeIcons[name];
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] ${
        accent === "orange" ? "text-orange-400" : "text-violet-300"
      }`}
    >
      <Icon strokeWidth={1.75} className="h-5 w-5" aria-hidden />
    </span>
  );
}

type Props = {
  /** Kratší verze pro homepage; plná stránka zobrazí i hodnocení a citace. */
  variant?: "compact" | "full";
};

function RatingBar({ label, score, max = 5 }: { label: string; score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-white/80">{label}</span>
        <span className="shrink-0 font-display text-sm font-extrabold text-orange-400">
          {score}/{max}
        </span>
      </div>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10"
        role="presentation"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-violet-400 transition-all"
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
      <div className="rounded-3xl border border-white/10 bg-[#100d18] p-6 sm:p-8">
        <p className="font-display text-xs font-extrabold uppercase tracking-wide text-orange-400">
          Z pilotního kurzu
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
          Níže je reálný přehled z individuálního kurzu ({pilotCourseMeta.lessons}{" "}
          lekcí, {pilotCourseMeta.period}). Bez jmen — jen to, co dítě skutečně
          vytvořilo, naučilo se a jak kurz hodnotilo.
        </p>
        <ul className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-white/80">
          <li className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
            {pilotCourseMeta.format}
          </li>
          <li className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-violet-200">
            {pilotCourseMeta.participantLabel}
          </li>
        </ul>
      </div>

      <ul className="grid items-start gap-5 sm:grid-cols-2">
        {projects.map((project, index) => {
          const avif = project.imageSrc?.replace(/\.webp$/, ".avif");
          return (
          <li
            key={project.title}
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#100d18] shadow-sm"
          >
            {project.imageSrc ? (
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#07060f]">
                <picture>
                  {avif ? <source type="image/avif" srcSet={avif} /> : null}
                  <source type="image/webp" srcSet={project.imageSrc} />
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt ?? project.title}
                    width={1152}
                    height={864}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/80">
                  Ilustrační náhled
                </span>
              </div>
            ) : null}
            <div className="flex h-full flex-col p-5 sm:p-6">
              <OutcomeIconChip name={project.icon} accent={index % 2 === 0 ? "orange" : "violet"} />
              <h3 className="font-display mt-3 text-lg font-extrabold text-white">
                {project.title}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white/85">
                {project.summary}
              </p>
              {variant === "full" ? (
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {project.detail}
                </p>
              ) : null}
            </div>
          </li>
          );
        })}
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
          className="rounded-[2rem] border border-white/10 bg-[#100d18] p-6 shadow-sm sm:p-8"
        >
          <h2
            id="feedback-heading"
            className="font-display text-2xl font-extrabold text-white"
          >
            Hodnocení absolventa kurzu
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Anonymní zpětná vazba po absolvování kurzu. Škála 1–5, kde 5 znamená
            nejvyšší spokojenost.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-orange-300">
                Celková spokojenost
              </p>
              <p className="font-display mt-2 text-4xl font-extrabold text-white">
                {pilotFeedbackSummary.overallScore}/5
              </p>
            </div>
            <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-violet-300">
                Průměr hodnocení
              </p>
              <p className="font-display mt-2 text-4xl font-extrabold text-white">
                {pilotFeedbackSummary.averageScore}/5
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-violet-300">
                Doporučil by kurz
              </p>
              <p className="font-display mt-2 text-2xl font-extrabold text-white sm:text-3xl">
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-white/55">
                  Tempo kurzu
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-white">
                  {pilotFeedbackSummary.pace}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-white/55">
                  Počet a délka lekcí
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-white">
                  {pilotFeedbackSummary.lessonLength}
                </p>
              </div>
              <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-violet-300">
                  Nejpřínosnější téma
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-white">
                  {pilotFeedbackSummary.topTopic}
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {pilotFeedbackQuotes.map((q) => (
              <li
                key={q.question}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-xs font-extrabold uppercase tracking-wide text-orange-300">
                  {q.question}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/85 sm:text-base">
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
