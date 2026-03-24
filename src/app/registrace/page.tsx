import type { Metadata } from "next";
import { RegistrationForm } from "@/components/registrace/RegistrationForm";
import { courseRuns } from "@/data/course-runs";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Registrace na kurz",
  description: `Přihláška na ${site.name}: výběr termínu skupiny nebo kurzu 1:1, ceny a platební kroky.`,
  path: "/registrace",
});

export default function RegistracePage() {
  const skupinaRuns = courseRuns.filter((r) => r.format === "skupina");
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-h1">Registrace 📝</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Vyplňte údaje o dítěti a zákonném zástupci. Po odeslání vás budeme
        kontaktovat s potvrzením a platebními instrukcemi.
      </p>
      <div className="mt-10">
        <RegistrationForm runs={skupinaRuns} />
      </div>
    </div>
  );
}
