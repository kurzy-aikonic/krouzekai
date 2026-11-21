import Link from "next/link";
import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import {
  effectiveRunPriceCzk,
  formatRunPriceCzk,
  type DefaultCoursePrices,
} from "@/lib/course-run-pricing";
import {
  formatIsoDateLongCs,
  weekdayLabel,
  withScheduleDefaults,
} from "@/lib/course-run-schedule";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";
import { site } from "@/lib/site-config";

function addMinutes(hhmm: string, minutes: number): string {
  const [hour, minute] = hhmm.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return hhmm;
  const total = hour * 60 + minute + minutes;
  const endHour = Math.floor(total / 60) % 24;
  const endMinute = total % 60;
  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
}

type Props = {
  run: CourseRun;
  registrationCount: number;
  priceDefaults: DefaultCoursePrices;
};

function spotsPhrase(free: number, capacity: number): string {
  if (free <= 0) return "Termín je plný.";
  if (free === 1) return `Zbývá 1 místo z ${capacity}.`;
  if (free >= 2 && free <= 4) return `Zbývají ${free} místa z ${capacity}.`;
  return `Zbývá ${free} míst z ${capacity}.`;
}

export function CourseRunPublicCard({
  run,
  registrationCount,
  priceDefaults,
}: Props) {
  const schedule = withScheduleDefaults(run);
  const day = weekdayLabel(schedule.weekday);
  const endTime = addMinutes(schedule.lessonTime, site.pricing.lessonMinutes);
  const span = `${schedule.lessonTime}–${endTime}`;
  const when = day ? `${day} ${span}` : span;
  const status = courseRunPublicStatus(run, registrationCount);
  const free = spotsLeftEffective(run, registrationCount);
  const price = formatRunPriceCzk(effectiveRunPriceCzk(run, priceDefaults));
  const priceNote =
    run.format === "individual" ? "za celý kurz" : "za dítě, celý kurz";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#100d18] p-5 text-white shadow-sm sm:p-6">
      <p className="text-sm font-semibold text-orange-300">
        {run.format === "skupina" ? "Skupina" : "Individuálně 1:1"}
      </p>
      <h3 className="font-display mt-1 text-2xl font-extrabold text-white">
        {when}
      </h3>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-base sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold text-white/60">Den a čas</dt>
          <dd className="font-bold text-white">{when}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-white/60">Plánovaný start</dt>
          <dd className="font-bold text-white">
            {formatIsoDateLongCs(run.startsOn)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-white/60">Cena</dt>
          <dd className="font-bold text-white">
            {price}{" "}
            <span className="font-semibold text-white/60">{priceNote}</span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-white/60">Volná místa</dt>
          <dd className="font-bold text-white">
            {spotsPhrase(free, run.capacity)}
          </dd>
        </div>
      </dl>
      {status.acceptsRegistration ? (
        <Link
          href={`/registrace?run=${encodeURIComponent(run.id)}`}
          className="btn-magic mt-5 w-full"
        >
          Přihlásit na tento termín
        </Link>
      ) : (
        <Link
          href={`/cekaci-listina?run=${encodeURIComponent(run.id)}`}
          className="btn-magic-outline mt-5 w-full"
        >
          Termín je plný, chci vědět o dalším
        </Link>
      )}
    </article>
  );
}
