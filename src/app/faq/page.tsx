import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { faqItems } from "@/data/faq";
import { metaDescriptions, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Časté otázky o kroužku (FAQ)",
  description: metaDescriptions.faq,
  path: "/faq",
});

export default function FaqPage() {
  const jsonLdItems = faqItems.map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Časté otázky", path: "/faq" },
        ]}
      />
      <FaqJsonLd items={jsonLdItems} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Časté otázky ❓</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Odpovědi můžeš doladit podle reálné praxe kurzu.
        </p>
        <dl className="mt-12 space-y-8">
          {faqItems.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-slate-900">{item.q}</dt>
              <dd className="mt-2 text-slate-600 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
