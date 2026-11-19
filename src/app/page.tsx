import type { Metadata } from "next";
import { HomeCourseRunsSection } from "@/components/home/HomeCourseRunsSection";
import { HomeFaq } from "@/components/home/HomeFaq";
import { LecturerSection } from "@/components/home/LecturerSection";
import {
  AfterSignup,
  FinalCta,
  HomeHero,
  LearnSection,
  PilotStory,
  PricingCards,
  SafetySection,
} from "@/components/home/HomeSections";
import { SpringTermsPanel } from "@/components/home/SpringTermsPanel";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { buildFaqItems } from "@/data/faq";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { listPublicCourseRuns } from "@/lib/course-runs-store";
import { getPublicCoursePricing } from "@/lib/course-pricing-store";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { listRegistrationsMerged } from "@/lib/registrations-store";

export const metadata: Metadata = pageMetadata({
  title: "Kroužek umělé inteligence pro teenagery — hra nebo web s AI",
  description: metaDescriptions.home,
  path: "/",
  keywords: [
    "kroužek umělé inteligence pro děti",
    "AI kroužek online",
    "kurz AI pro děti",
  ],
});

export const revalidate = 300;

const homeFaqQuestions = [
  "Potřebuje dítě umět programovat?",
  "Co když dítě lekci zmešká?",
  "Jaké AI nástroje děti používají a jsou pro jejich věk vhodné?",
  "Můžu přihlášku zrušit?",
];

export default async function HomePage() {
  const [prices, runs, merged] = await Promise.all([
    getPublicCoursePricing(),
    listPublicCourseRuns(),
    listRegistrationsMerged(),
  ]);
  const occupancyByRunId: Record<string, number> = {};
  for (const run of runs) {
    occupancyByRunId[run.id] = countedOccupancyForRun(run.id, run.format, merged);
  }
  const hasRuns = runs.length > 0;
  const faq = buildFaqItems(prices);
  const homeFaq = homeFaqQuestions
    .map((question) => faq.find((item) => item.q === question))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <HomeJsonLd />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14">
        <HomeHero hasRuns={hasRuns} />

        <section id="terminy" className="mt-14 scroll-mt-24" aria-label="Termíny a ceny">
          {hasRuns ? (
            <HomeCourseRunsSection
              runs={runs}
              occupancyByRunId={occupancyByRunId}
              priceDefaults={{
                skupinaCourseCzk: prices.skupinaCourseCzk,
                individualCourseCzk: prices.individualCourseCzk,
              }}
            />
          ) : (
            <SpringTermsPanel />
          )}
          <PricingCards prices={prices} />
        </section>

        <LecturerSection />
        <SafetySection />
        <LearnSection />
        <PilotStory />
        <AfterSignup />
        <HomeFaq items={homeFaq} />
        <FinalCta hasRuns={hasRuns} />
      </div>
    </>
  );
}
