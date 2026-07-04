import type { Metadata } from "next";
import { AiSkillTestClient } from "@/components/test/AiSkillTestClient";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI test úrovně dítěte",
  description:
    "Krátký zábavný test zdarma, který doporučí úroveň dítěte pro kurz: začátečník, pokročilý nebo profesionál.",
  path: "/test-urovne-ai",
});

export default function TestUrovneAiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "AI test úrovně dítěte", path: "/test-urovne-ai" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">AI test úrovně dítěte 🧠</h1>
        <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
          Zdarma a během pár minut. Výsledek pomůže dítě správně zařadit do
          úrovně kurzu a zvolit tempo, které mu bude sedět.
        </p>

        <div className="mt-10">
          <AiSkillTestClient />
        </div>
      </div>
    </>
  );
}
