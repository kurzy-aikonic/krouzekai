import type { Metadata } from "next";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt a informace",
  description: metaDescriptions.kontakt,
  path: "/kontakt",
});

export default function KontaktPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Kontakt", path: "/kontakt" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Kontakt ✉️</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Máte dotaz k termínům, formátu nebo vhodnosti kurzu pro vaše dítě?
          Napište nám — stejné kontakty jako u{" "}
          <a
            href={site.parentSite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-600 underline hover:text-violet-800"
          >
            {site.parentSite.name}
          </a>
          .
        </p>
        <div className="card-playful mt-10 space-y-6 bg-gradient-to-br from-sky-50 to-violet-50 p-6 sm:p-8">
          <div>
            <p className="text-sm font-medium text-slate-500">E-mail</p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-1 inline-block text-lg font-semibold text-[var(--accent)] hover:underline"
            >
              {site.contactEmail}
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Telefon</p>
            <a
              href={`tel:${site.company.phoneTel}`}
              className="mt-1 inline-block text-lg font-semibold text-[var(--accent)] hover:underline"
            >
              {site.company.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Provozovatel</p>
            <p className="mt-1 font-medium text-slate-800">
              {site.company.legalName}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              IČO {site.company.ic}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {site.company.registryMark}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Zápis v obchodním rejstříku od{" "}
              {new Date(site.company.registryRegisteredAt).toLocaleDateString(
                "cs-CZ",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
              .
            </p>
            <p className="mt-3 font-medium text-slate-800">
              Sídlo / fakturace
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {site.company.addressLine}
              <span className="block text-slate-600">
                ({site.company.addressNote})
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Sociální sítě</p>
            <SocialIcons className="mt-3" />
          </div>
        </div>
      </div>
    </>
  );
}
