import type { Metadata } from "next";
import { SpringTermsPanel } from "@/components/home/SpringTermsPanel";
import { RegistrationForm } from "@/components/registrace/RegistrationForm";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { getPublicCoursePricing } from "@/lib/course-pricing-store";
import { listPublicCourseRuns } from "@/lib/course-runs-store";
import { listRegistrationsMerged } from "@/lib/registrations-store";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";
import { parseAiSkillLevel } from "@/lib/ai-skill-test";

export const metadata: Metadata = pageMetadata({
  title: "Registrace na AI kroužek",
  description: metaDescriptions.registrace,
  path: "/registrace",
  keywords: ["přihláška AI kroužek", "registrace kurz AI děti"],
});

export const dynamic = "force-dynamic";

export default async function RegistracePage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string; aiLevel?: string }>;
}) {
  const [q, pricing, offered, merged] = await Promise.all([
    searchParams,
    getPublicCoursePricing(),
    listPublicCourseRuns(),
    listRegistrationsMerged(),
  ]);
  const groupRuns = offered.filter((r) => r.format === "skupina");
  const individualRuns = offered.filter((r) => r.format === "individual");
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
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Přihláška dítěte</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
          Vyplňte údaje o účastníkovi ({site.audience.ageMin}–{site.audience.ageMax}{" "}
          let) a o zákonném zástupci. Odesláním vzniká návrh smlouvy. Smlouva
          vzniká až naším potvrzením a do té doby nic neplatíte.
        </p>
        {offered.length === 0 ? (
          <div className="mt-8">
            <SpringTermsPanel />
          </div>
        ) : (
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Níže můžete vybrat konkrétní termín. Skupinu otevřeme až po naplnění
            kapacity.
          </p>
        )}
        <p className="mt-3 rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-sm font-medium text-violet-900">
          Doporučení: před registrací vyplňte{" "}
          <a href="/test-urovne-ai" className="font-bold underline">
            AI test úrovně zdarma
          </a>
          , aby bylo zařazení dítěte co nejpřesnější.
        </p>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-sm sm:p-3">
          <RegistrationForm
            groupRuns={groupRuns}
            individualRuns={individualRuns}
            occupancyByRunId={occupancyByRunId}
            preferredRunId={q.run}
            initialAiSkillLevel={parseAiSkillLevel(q.aiLevel)}
            pricing={pricing}
          />
        </div>
      </div>
    </>
  );
}
