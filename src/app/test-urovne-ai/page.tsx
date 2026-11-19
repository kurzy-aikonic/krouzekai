import type { Metadata } from "next";
import { AiSkillTestClient } from "@/components/test/AiSkillTestClient";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI test zdarma — zjistěte úroveň",
  description:
    "Krátký test zdarma, který doporučí úroveň pro kroužek: začátečník, pokročilý nebo tvůrce.",
  path: "/test-urovne-ai",
  keywords: ["test AI dovedností pro děti", "úroveň dítěte AI"],
});

export default function TestUrovneAiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "AI test úrovně", path: "/test-urovne-ai" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">AI test úrovně</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
          Zdarma a během pár minut. Výsledek pomůže zařadit účastníka do úrovně
          kurzu a zvolit tempo, které mu sedí.
        </p>

        <div className="mt-10">
          <AiSkillTestClient />
        </div>
      </div>
    </>
  );
}
