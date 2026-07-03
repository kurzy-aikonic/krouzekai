import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { spotsLeftEffective } from "@/data/course-runs";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
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
              const full = free <= 0;
              return (
                <li
                  key={run.id}
                  className={`card-playful border-2 p-5 sm:p-6 ${
                    full
                      ? "border-slate-200 bg-slate-50/90"
                      : "border-violet-100"
                  }`}
                >
                  {!full ? (
                    <span className="mb-3 inline-flex rounded-full border-2 border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-900">
                      Volná místa
                    </span>
                  ) : (
                    <span className="mb-3 inline-flex rounded-full border-2 border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700">
                      Plně obsazeno
                    </span>
                  )}
                  <h2 className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                    {run.label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {run.description}
                  </p>
                  <p className="mt-3 text-xs font-medium text-slate-600">
                    {formatScheduleSummary(run)}
                    {" · "}
                    Kapacita {run.capacity} · odhad volných míst:{" "}
                    <strong>{free}</strong>
                  </p>
                  <Link
                    href={
                      full
                        ? "/registrace"
                        : `/registrace?run=${encodeURIComponent(run.id)}`
                    }
                    className={`mt-5 inline-flex w-full justify-center rounded-xl border-2 px-4 py-2.5 text-sm font-extrabold transition sm:w-auto ${
                      full
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-[var(--magic-ink)] bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[3px_3px_0_#312e81] hover:-translate-y-0.5"
                    }`}
                    aria-disabled={full}
                  >
                    {full ? "Termín je plný — obecná přihláška" : "Přihlásit na tento termín →"}
                  </Link>
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
