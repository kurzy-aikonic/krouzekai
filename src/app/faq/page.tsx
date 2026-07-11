import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { buildFaqItems } from "@/data/faq";
import { getCoursePricing } from "@/lib/course-pricing-store";
import { metaDescriptions, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Časté otázky — AI kroužek pro děti",
  description: metaDescriptions.faq,
  path: "/faq",
  keywords: ["AI kroužek otázky", "bezpečnost AI pro děti", "cena AI kroužku"],
});

export const revalidate = 300;

export default async function FaqPage() {
  const pricing = await getCoursePricing();
  const faqItems = buildFaqItems(pricing);
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
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Časté otázky</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Přehled nejčastějších dotazů rodičů k průběhu, bezpečnosti a organizaci
          kurzu.
        </p>
        <dl className="mt-12 space-y-4">
          {faqItems.map((item) => (
            <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <dt className="font-display text-lg font-extrabold text-slate-900">{item.q}</dt>
              <dd className="mt-2 text-slate-600 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
