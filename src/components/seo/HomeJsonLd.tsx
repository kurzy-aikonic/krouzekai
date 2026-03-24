import { site } from "@/lib/site-config";
import { coursePriceCzk, productFromFormat } from "@/lib/payment";
import { getSiteUrl } from "@/lib/seo";

/** Strukturovaná data (Course + Organization) pro hlavní stránku. */
export function HomeJsonLd() {
  const url = getSiteUrl().toString() as string;
  const skupina = coursePriceCzk(productFromFormat("skupina"));
  const individual = coursePriceCzk(productFromFormat("individual"));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}#organization`,
        name: site.shortName,
        description: rootDescription(),
        url,
        email: site.contactEmail,
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: site.shortName,
        description: rootDescription(),
        publisher: { "@id": `${url}#organization` },
        inLanguage: "cs-CZ",
      },
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: site.name,
        description: rootDescription(),
        provider: { "@id": `${url}#organization` },
        educationalLevel: "děti 10–15 let",
        teaches: [
          "vibecoding",
          "prompt engineering",
          "tvorba her a aplikací s AI",
        ],
        offers: [
          {
            "@type": "Offer",
            name: "Skupinový kurz (max. 6)",
            price: skupina,
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
            url: `${url}registrace`,
          },
          {
            "@type": "Offer",
            name: "Individuální kurz 1:1",
            price: individual,
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
            url: `${url}registrace`,
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

function rootDescription(): string {
  return `Online kroužek ${site.pricing.lessonMinutes} min týdně, ${site.pricing.lessons} lekcí. Děti tvoří vlastní hru, appku nebo web s AI — bez klasického programování.`;
}
