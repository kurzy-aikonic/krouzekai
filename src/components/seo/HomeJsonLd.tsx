import { site } from "@/lib/site-config";
import { coursePriceCzk, productFromFormat } from "@/lib/payment";
import { absoluteUrl, getSiteUrl, rootSchemaDescription } from "@/lib/seo";

/** Strukturovaná data kurzu na hlavní stránce (doplňuje globální Organization + WebSite). */
export function HomeJsonLd() {
  const origin = getSiteUrl().toString().replace(/\/$/, "");
  const orgId = `${origin}/#organization`;
  const skupina = coursePriceCzk(productFromFormat("skupina"));
  const individual = coursePriceCzk(productFromFormat("individual"));
  const maxG = site.pricing.groupMaxStudents;
  const registraceUrl = absoluteUrl("/registrace");

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
        offers: [
          {
            "@type": "Offer",
            name: `Skupinový kurz (max. ${maxG})`,
            price: skupina,
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
            url: registraceUrl,
          },
          {
            "@type": "Offer",
            name: "Individuální kurz 1:1",
            price: individual,
            priceCurrency: "CZK",
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
