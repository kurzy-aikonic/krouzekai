import type { Metadata } from "next";
import Link from "next/link";
import { CourseRunPublicCard } from "@/components/course-run/CourseRunPublicCard";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { getPublicCoursePricing } from "@/lib/course-pricing-store";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { listRegistrationsMerged } from "@/lib/registrations-store";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Termíny AI kroužku pro děti — aktuální běhy",
  description: metaDescriptions.aktualniBehy,
  path: "/aktualni-behy",
  keywords: ["termíny AI kroužku", "AI kroužek zápis 2026"],
});

export const revalidate = 300;

export default async function AktualniBehyPage() {
  const [runs, merged, pricing] = await Promise.all([
    listOfferedCourseRuns(),
    listRegistrationsMerged(),
    getPublicCoursePricing(),
  ]);
  const groupRuns = runs.filter((r) => r.format === "skupina");
  const individualRuns = runs.filter((r) => r.format === "individual");
  const priceDefaults = {
    skupinaCourseCzk: pricing.skupinaCourseCzk,
    individualCourseCzk: pricing.individualCourseCzk,
  };

  function occupancyForRun(runId: string, format: "skupina" | "individual") {
    return countedOccupancyForRun(runId, format, merged);
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Aktuální termíny", path: "/aktualni-behy" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Aktuální termíny</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Všechny termíny, které právě nabízíme — skupinové i individuální 1:1.
          Skupinový kurz startuje až po naplnění kapacity (100 % míst) — do té
          doby sbíráme nezávazné přihlášky a u každého termínu vidíte průběh
          obsazenosti.
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
              Nezávazně přihlásit dítě
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {groupRuns.length > 0 ? (
              <section aria-labelledby="group-runs-heading">
                {individualRuns.length > 0 ? (
                  <h2
                    id="group-runs-heading"
                    className="font-display text-lg font-extrabold text-[var(--magic-ink)]"
                  >
                    Skupinové termíny
                  </h2>
                ) : null}
                <ul
                  className={`grid gap-4 ${individualRuns.length > 0 ? "mt-4" : ""} sm:grid-cols-2`}
                >
                  {groupRuns.map((run) => (
                    <li key={run.id}>
                      <CourseRunPublicCard
                        run={run}
                        registrationCount={occupancyForRun(run.id, run.format)}
                        priceDefaults={priceDefaults}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {individualRuns.length > 0 ? (
              <section aria-labelledby="individual-runs-heading">
                <h2
                  id="individual-runs-heading"
                  className="font-display text-lg font-extrabold text-[var(--magic-ink)]"
                >
                  Individuální termíny 1:1
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {individualRuns.map((run) => (
                    <li key={run.id}>
                      <CourseRunPublicCard
                        run={run}
                        registrationCount={occupancyForRun(run.id, run.format)}
                        priceDefaults={priceDefaults}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
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
          Nezávazně přihlásit dítě
        </Link>
      </div>
    </>
  );
}
