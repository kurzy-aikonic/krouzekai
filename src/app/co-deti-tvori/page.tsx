import type { Metadata } from "next";
import Link from "next/link";
import { RealOutcomesContent } from "@/components/outcomes/RealOutcomesContent";
import { SnakeShowcase } from "@/components/playful/SnakeShowcase";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Section } from "@/components/ui/Section";
import { metaDescriptions, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Co děti tvoří s AI — reálné projekty z kurzu",
  description: metaDescriptions.coDetiTvori,
  path: "/co-deti-tvori",
  keywords: ["co se děti naučí s AI", "dětské AI projekty", "tvorba her s AI"],
});

export default function CoDetiTvoriPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Co děti reálně tvoří", path: "/co-deti-tvori" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Co v kroužku vzniká</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
          Konkrétní výstupy z pilotního kurzu: hra, zadání pro AI, učební
          materiály a vlastní web. Plus zpětná vazba absolventa.
        </p>

        <Section className="mt-10">
          <RealOutcomesContent variant="full" />
        </Section>

        <SnakeShowcase />

        <div className="mt-14 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-900 to-indigo-900 px-6 py-10 text-center sm:px-10">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Chcete podobný výsledek pro své dítě?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-violet-200 sm:text-base">
            Do potvrzení objednávky nic neplatíte. Formát, termín i tempo
            domluvíme podle věku a úrovně dítěte.
          </p>
          <Link
            href="/registrace"
            className="btn-magic mt-6 inline-flex min-h-11 items-center justify-center px-8"
          >
            Přihlásit dítě
          </Link>
        </div>
      </div>
    </>
  );
}
