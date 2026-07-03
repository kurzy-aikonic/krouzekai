import type { Metadata } from "next";
import { RegistrationForm } from "@/components/registrace/RegistrationForm";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";
import { listRegistrationsMerged } from "@/lib/registrations-store";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Registrace na AI kroužek",
  description: metaDescriptions.registrace,
  path: "/registrace",
});

export const dynamic = "force-dynamic";

export default async function RegistracePage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string }>;
}) {
  const q = await searchParams;
  const offered = await listOfferedCourseRuns();
  const groupRuns = offered.filter((r) => r.format === "skupina");
  const individualRuns = offered.filter((r) => r.format === "individual");
  const merged = await listRegistrationsMerged();
  const occupancyByRunId: Record<string, number> = {};
  for (const run of offered) {
    occupancyByRunId[run.id] = countedOccupancyForRun(
      run.id,
      run.format,
      merged,
    );
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Registrace", path: "/registrace" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Registrace 📝</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Vyplňte údaje o dítěti ({site.audience.ageMin}–{site.audience.ageMax}{" "}
          let) a zákonném zástupci.
          {offered.length > 0 ? (
            <>
              {" "}
              Níže můžete vybrat konkrétní termín — nebo nechat domluvu na
              později.
            </>
          ) : (
            <>
              {" "}
              První termíny právě otevíráme — konkrétní termín s vámi domluvíme
              po registraci.
            </>
          )}{" "}
          Po odeslání vás kontaktujeme, domluvíme podmínky a pak zašleme fakturu.
        </p>
        <div className="mt-10">
          <RegistrationForm
            groupRuns={groupRuns}
            individualRuns={individualRuns}
            occupancyByRunId={occupancyByRunId}
            preferredRunId={q.run}
          />
        </div>
      </div>
    </>
  );
}
