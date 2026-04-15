import type { Metadata } from "next";
import { RegistrationForm } from "@/components/registrace/RegistrationForm";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";
import { listRegistrationsMerged } from "@/lib/registrations-store";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Registrace na kurz",
  description: metaDescriptions.registrace,
  path: "/registrace",
});

export const dynamic = "force-dynamic";

export default async function RegistracePage() {
  const groupRuns = await listOfferedCourseRuns();
  const merged = await listRegistrationsMerged();
  const occupancyByRunId: Record<string, number> = {};
  for (const run of groupRuns) {
    occupancyByRunId[run.id] = countedOccupancyForRun(run.id, merged);
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Registrace", path: "/registrace" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Registrace 📝</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Vyplňte údaje o dítěti ({site.audience.ageMin}–{site.audience.ageMax}{" "}
          let) a zákonném zástupci. První běhy právě otevíráme — díky věku na
          přihlášce vás zařadíme do správného tempa a konkrétní termín s vámi
          domluvíme individuálně podle zájmu. Po odeslání vás kontaktujeme,
          domluvíme podmínky a pak zašleme fakturu — platbu řešíme až po této
          domluvě (faktury zatím neposíláme automaticky z webu).
        </p>
        <div className="mt-10">
          <RegistrationForm
            groupRuns={groupRuns}
            occupancyByRunId={occupancyByRunId}
          />
        </div>
      </div>
    </>
  );
}
