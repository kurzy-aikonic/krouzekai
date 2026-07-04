import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Prose } from "@/components/ui/Prose";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Odstoupení od smlouvy",
  description: metaDescriptions.odstoupeni,
  path: "/odstoupeni-od-smlouvy",
});

export default function OdstoupeniOdSmlouvyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Odstoupení od smlouvy", path: "/odstoupeni-od-smlouvy" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <Prose>
          <h1>Odstoupení od smlouvy (vzorový formulář)</h1>
          <p>
            Tento formulář můžete použít při odstoupení od smlouvy uzavřené na
            dálku. Použití formuláře není povinné.
          </p>

          <h2>Jak formulář podat</h2>
          <ul>
            <li>
              E-mailem na <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </li>
            <li>
              V předmětu zprávy uveďte: <strong>Odstoupení od smlouvy</strong>.
            </li>
            <li>Do textu vložte formulář níže a doplňte své údaje.</li>
          </ul>

          <h2>Formulář</h2>
          <pre>
{`Adresát:
${site.company.legalName}
${site.company.addressLine} (${site.company.addressNote})
E-mail: ${site.contactEmail}

Oznamuji, že tímto odstupuji od smlouvy o poskytování služby:
${site.name}

Datum objednání / uzavření smlouvy:

Jméno a příjmení zákonného zástupce (spotřebitele):

E-mail použitý při registraci:

Telefon:

Jméno dítěte (účastníka kurzu):

Číslo přihlášky (pokud máte):

Důvod odstoupení (nepovinné):

Datum:

Podpis (pouze pokud formulář posíláte v listinné podobě):
`}
          </pre>

          <p>
            Podrobnosti k právu odstoupit najdete v{" "}
            <a href="/obchodni-podminky">obchodních podmínkách</a>.
          </p>
        </Prose>
      </div>
    </>
  );
}
