import { site } from "@/lib/site-config";
import { coursePriceCzk } from "@/lib/course-pricing-store";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";
import { productFromFormat } from "@/lib/payment";
import { absoluteUrl, getSiteUrl, rootSchemaDescription } from "@/lib/seo";

/** Google doporučuje u Offer nabídek s pevnou cenou uvádět, do kdy platí. */
function priceValidUntil(): string {
  const until = new Date();
  until.setMonth(until.getMonth() + 6);
  return until.toISOString().slice(0, 10);
}

const recurrenceToRepeatFrequency: Record<string, string> = {
  weekly: "P1W",
  biweekly: "P2W",
  none: "P2W",
};

/** Strukturovaná data kurzu na hlavní stránce (doplňuje globální Organization + WebSite). */
export async function HomeJsonLd() {
  const origin = getSiteUrl().toString().replace(/\/$/, "");
  const orgId = `${origin}/#organization`;
  const skupina = await coursePriceCzk(productFromFormat("skupina"));
  const individual = await coursePriceCzk(productFromFormat("individual"));
  const maxG = site.pricing.groupMaxStudents;
  const registraceUrl = absoluteUrl("/registrace");
  const validUntil = priceValidUntil();

  const runs = await listOfferedCourseRuns();
  const hasCourseInstance = runs
    .filter((run) => {
      const parsed = new Date(run.startsOn);
      return !Number.isNaN(parsed.getTime());
    })
    .map((run) => ({
      "@type": "CourseInstance",
      name: run.label,
      courseMode: "Online",
      startDate: run.startsOn,
      courseWorkload: `PT${site.pricing.lessons}H`,
      courseSchedule: {
        "@type": "Schedule",
        startDate: run.startsOn,
        repeatFrequency:
          recurrenceToRepeatFrequency[run.recurrence ?? "biweekly"] ?? "P2W",
        repeatCount: site.pricing.lessons,
      },
    }));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${origin}/#course`,
        name: site.name,
        description: rootSchemaDescription(),
        provider: { "@id": orgId },
        educationalLevel: `děti ${site.audience.ageMin}–${site.audience.ageMax} let`,
        teaches: [
          "vibecoding",
          "prompt engineering",
          "tvorba her a aplikací s AI",
        ],
        ...(hasCourseInstance.length > 0
          ? { hasCourseInstance }
          : {
              hasCourseInstance: [
                {
                  "@type": "CourseInstance",
                  courseMode: "Online",
                  courseWorkload: `PT${site.pricing.lessons}H`,
                  courseSchedule: {
                    "@type": "Schedule",
                    repeatFrequency: "P2W",
                    repeatCount: site.pricing.lessons,
                  },
                },
              ],
            }),
        offers: [
          {
            "@type": "Offer",
            name: `Skupinový kurz (max. ${maxG})`,
            price: skupina,
            priceCurrency: "CZK",
            category: "Paid",
            priceValidUntil: validUntil,
            availability: "https://schema.org/InStock",
            url: registraceUrl,
          },
          {
            "@type": "Offer",
            name: "Individuální kurz 1:1",
            price: individual,
            priceCurrency: "CZK",
            category: "Paid",
            priceValidUntil: validUntil,
            availability: "https://schema.org/InStock",
            url: registraceUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
