import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { spotsLeftEffective } from "@/data/course-runs";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
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
          Přehled skupinových termínů, které právě nabízíme na webu. Přihlášku
          vyplníte na stránce registrace — tam můžete (volitelně) vybrat konkrétní
          termín, pokud je v nabídce volno.
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
              const free = spotsLeftEffective(run, occ);
              return (
                <li
                  key={run.id}
                  className="card-playful border-2 border-violet-100 p-5 sm:p-6"
                >
                  <h2 className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                    {run.label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {run.description}
                  </p>
                  <p className="mt-3 text-xs font-medium text-slate-600">
                    Start:{" "}
                    <strong>
                      {new Date(run.startsOn + "T12:00:00").toLocaleDateString(
                        "cs-CZ",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </strong>
                    {" · "}
                    Kapacita {run.capacity} · odhad volných míst:{" "}
                    <strong>{free}</strong>
                  </p>
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
