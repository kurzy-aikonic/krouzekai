import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Prose } from "@/components/ui/Prose";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Ochrana osobních údajů (GDPR)",
  description: metaDescriptions.ochrana,
  path: "/ochrana-osobnich-udaju",
});

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Ochrana osobních údajů", path: "/ochrana-osobnich-udaju" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Prose>
          <h1>Ochrana osobních údajů</h1>
          <p>
            Tento dokument popisuje, jak při provozu služby {site.name}{" "}
            zpracováváme osobní údaje v souladu s GDPR a souvisejícími předpisy.
          </p>
          <h2>1. Kdo zpracovává údaje</h2>
          <p>
            Správcem osobních údajů je {site.company.legalName}, IČO{" "}
            {site.company.ic}, sídlo {site.company.addressLine} (
            {site.company.addressNote}). {site.company.registryMark}. Službu{" "}
            {site.name} provozujeme jako součást nabídky skupiny{" "}
            {site.parentSite.name}. Kontakt:{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>, tel.{" "}
            <a href={`tel:${site.company.phoneTel}`}>
              {site.company.phoneDisplay}
            </a>
            .
          </p>
          <p>
            Pověřence pro ochranu osobních údajů jsme nejmenovali; veškeré
            dotazy ke zpracování můžete směřovat na výše uvedený kontakt.
          </p>
          <h2>2. Jaké údaje zpracováváme</h2>
          <ul>
            <li>Údaje zákonného zástupce: jméno, e-mail, telefon.</li>
            <li>Údaje o účastníkovi kurzu: jméno, věk.</li>
            <li>Údaje o zvoleném termínu a formátu kurzu.</li>
            <li>Technické údaje nutné pro provoz webu (např. logy serveru).</li>
          </ul>
          <h2>3. Účel a právní základ</h2>
          <ul>
            <li>
              Vyřízení registrace, komunikace a realizace kurzu: čl. 6 odst. 1
              písm. b) GDPR (plnění smlouvy).
            </li>
            <li>
              Účetní a daňové povinnosti: čl. 6 odst. 1 písm. c) GDPR (splnění
              právní povinnosti).
            </li>
            <li>
              Ochrana webu a prevence zneužití (rate limit, bezpečnostní logy):
              čl. 6 odst. 1 písm. f) GDPR (oprávněný zájem).
            </li>
            <li>
              Marketingová nebo volitelná analytika pouze se souhlasem: čl. 6
              odst. 1 písm. a) GDPR.
            </li>
          </ul>
          <h2>4. Doba uchování</h2>
          <ul>
            <li>
              Registrační a komunikační údaje uchováváme po dobu trvání kurzu a
              následně maximálně 3 roky pro řešení dotazů a případných sporů.
            </li>
            <li>
              Účetní a daňové doklady uchováváme po dobu stanovenou právními
              předpisy (obvykle 10 let).
            </li>
            <li>
              Technické bezpečnostní logy uchováváme po nezbytně nutnou dobu,
              zpravidla v řádu týdnů až měsíců.
            </li>
          </ul>
          <h2>5. Příjemci a zpracovatelé</h2>
          <p>Údaje mohou zpracovávat naši smluvní zpracovatelé, zejména:</p>
          <ul>
            <li>hosting a infrastruktura webu,</li>
            <li>e-mailová služba pro potvrzení registrace,</li>
            <li>platební služby (pokud je aktivní online platba),</li>
            <li>Supabase pro bezpečnostní omezení požadavků (rate limiting).</li>
          </ul>
          <p>
            Se zpracovateli máme uzavřené odpovídající smluvní závazky dle čl.
            28 GDPR.
          </p>
          <h2>6. Předávání do třetích zemí</h2>
          <p>
            Pokud některý dodavatel zpracovává data mimo EU/EHP, předání
            probíhá pouze při splnění podmínek GDPR (např. standardní smluvní
            doložky nebo rozhodnutí o odpovídající ochraně).
          </p>
          <h2>7. Práva subjektů údajů</h2>
          <p>
            Máte právo na přístup, opravu, výmaz, omezení zpracování,
            přenositelnost a vznést námitku, kde to předpisy připouštějí. Máte
            právo podat stížnost u Úřadu pro ochranu osobních údajů.
          </p>
          <h2>8. Cookies</h2>
          <p>
            Informace o cookies najdete na stránce <a href="/cookies">Cookies</a>.
          </p>
          <h2>9. Kontaktní údaje dozorového úřadu</h2>
          <p>
            Úřad pro ochranu osobních údajů:{" "}
            <a
              href="https://www.uoou.cz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              uoou.cz
            </a>
            .
          </p>
        </Prose>
      </div>
    </>
  );
}
