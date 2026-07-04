import type { Metadata } from "next";
import Link from "next/link";
import { CourseRunCapacityStatus } from "@/components/course-run/CourseRunCapacityStatus";
import { CourseRunPriceLabel } from "@/components/course-run/CourseRunPriceLabel";
import { CourseRunPublicMeta } from "@/components/course-run/CourseRunPublicMeta";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";
import { getPublicCoursePricing } from "@/lib/course-pricing-store";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { listRegistrationsMerged } from "@/lib/registrations-store";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Aktuální termíny kroužku",
  description: metaDescriptions.aktualniBehy,
  path: "/aktualni-behy",
});

export const dynamic = "force-dynamic";

export default async function AktualniBehyPage() {
  const runs = (await listOfferedCourseRuns()).filter(
    (r) => r.format === "skupina",
  );
  const merged = await listRegistrationsMerged();
  const pricing = await getPublicCoursePricing();
  const priceDefaults = {
    skupinaCourseCzk: pricing.skupinaCourseCzk,
    individualCourseCzk: pricing.individualCourseCzk,
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Aktuální termíny", path: "/aktualni-behy" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Aktuální termíny 📅</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Skupinové termíny, které právě nabízíme. Kurz startuje až po naplnění
          kapacity (100 % míst) — do té doby sbíráme nezávazné přihlášky a u
          každého termínu vidíte průběh obsazenosti.
        </p>
        {runs.length === 0 ? (
          <div className="card-playful mt-10 p-6 text-sm leading-relaxed text-slate-700">
            <p>
              Momentálně nemáme vypsané konkrétní termíny — přihlášku ale můžete
              poslat kdykoli, domluvíme se individuálně.
            </p>
            <Link
              href="/registrace"
              className="btn-magic-outline mt-6 inline-flex text-sm"
            >
              Registrace na kurz
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {runs.map((run) => {
              const occ = countedOccupancyForRun(run.id, "skupina", merged);
              const status = courseRunPublicStatus(run, occ);
              return (
                <li
                  key={run.id}
                  className={`card-playful border-2 p-5 sm:p-6 ${
                    status.isGroupLaunchReady
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-violet-100"
                  }`}
                >
                  <h2 className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                    {run.label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {run.description}
                  </p>
                  <CourseRunPublicMeta run={run} />
                  <CourseRunPriceLabel run={run} defaults={priceDefaults} />
                  <p className="mt-3 text-xs font-medium text-slate-600">
                    {formatScheduleSummary(run)}
                  </p>
                  <div className="mt-4">
                    <CourseRunCapacityStatus run={run} registrationCount={occ} />
                  </div>
                  {status.acceptsRegistration ? (
                    <Link
                      href={`/registrace?run=${encodeURIComponent(run.id)}`}
                      className="mt-5 inline-flex w-full justify-center rounded-xl border-2 border-[var(--magic-ink)] bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-[3px_3px_0_#312e81] transition hover:-translate-y-0.5 sm:w-auto"
                    >
                      Přihlásit na tento termín →
                    </Link>
                  ) : (
                    <Link
                      href="/registrace"
                      className="mt-5 inline-flex w-full justify-center rounded-xl border-2 border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-extrabold text-slate-600 sm:w-auto"
                    >
                      Kapacita naplněna — jiný termín
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-10 text-sm text-slate-600">
          Dotazy?{" "}
          <a
            className="font-bold text-violet-600 underline"
            href={`mailto:${site.contactEmail}`}
          >
            {site.contactEmail}
          </a>
        </p>
        <Link
          href="/registrace"
          className="btn-magic mt-8 inline-flex w-full max-w-md justify-center text-sm sm:w-auto"
        >
          Přihlásit se na kurz
        </Link>
      </div>
    </>
  );
}
