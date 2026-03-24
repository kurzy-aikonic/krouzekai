import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt",
  description: `Kontakt a e-mail na kurz ${site.name} — dotazy k termínům a registraci.`,
  path: "/kontakt",
});

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-h1">Kontakt ✉️</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Máte dotaz k termínům, formátu nebo vhodnosti kurzu pro vaše dítě?
        Napište nám.
      </p>
      <div className="card-playful mt-10 bg-gradient-to-br from-sky-50 to-violet-50 p-6 sm:p-8">
        <p className="text-sm font-medium text-slate-500">E-mail</p>
        <a
          href={`mailto:${site.contactEmail}`}
          className="mt-1 inline-block text-lg font-semibold text-[var(--accent)] hover:underline"
        >
          {site.contactEmail}
        </a>
        <p className="mt-6 text-sm text-slate-500">
          Do patičky webu doplníš IČO, sídlo a další údaje podle skutečného
          provozovatele služby.
        </p>
      </div>
    </div>
  );
}
