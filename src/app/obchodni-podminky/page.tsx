import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Prose } from "@/components/ui/Prose";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Obchodní podmínky",
  description: metaDescriptions.obchodniPodminky,
  path: "/obchodni-podminky",
});

export default function ObchodniPodminkyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Obchodní podmínky", path: "/obchodni-podminky" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Prose>
        <h1>Obchodní podmínky</h1>
        <p>
          Tyto obchodní podmínky upravují smluvní vztah mezi poskytovatelem
          online kurzu a zákazníkem (zákonným zástupcem účastníka kurzu).
          Spotřebitelská práva podle právních předpisů tím nejsou dotčena.
        </p>
        <h2>1. Základní ustanovení</h2>
        <p>
          Tyto obchodní podmínky upravují vztah mezi poskytovatelem služby
          &bdquo;{site.name}&ldquo; (dále jen &bdquo;poskytovatel&ldquo;) a
          zákazníkem — zákonným zástupcem účastníka kurzu (dále jen
          &bdquo;zákazník&ldquo;).
        </p>
        <p>
          <strong>Identifikace poskytovatele:</strong>{" "}
          {site.company.legalName}, IČO {site.company.ic}, sídlo{" "}
          {site.company.addressLine} ({site.company.addressNote}).{" "}
          {site.company.registryMark}. Služba &bdquo;{site.name}&ldquo; je
          nabízena v návaznosti na značku{" "}
          <a
            href={site.parentSite.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.parentSite.name}
          </a>
          . Kontakt:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>, tel.{" "}
          <a href={`tel:${site.company.phoneTel}`}>
            {site.company.phoneDisplay}
          </a>
          .
        </p>
        <h2>2. Předmět služby</h2>
        <p>
          Předmětem je online vzdělávací kurz v rozsahu a formě uvedené na tomto
          webu (délka lekcí, počet lekcí, skupinový nebo individuální formát).
          Konkrétní termíny a kapacity jsou uvedeny u registrace.
        </p>
        <h2>3. Objednávka a uzavření smlouvy</h2>
        <p>
          Objednávka vzniká odesláním registračního formuláře. Smlouva je
          uzavřena potvrzením objednávky ze strany poskytovatele (e-mailem),
          není-li sjednáno jinak.
        </p>
        <h2>4. Cena a platba</h2>
        <p>
          Ceny jsou uvedeny na webu. Způsob platby a splatnost budou sděleny v
          potvrzení objednávky. Poskytovatel není plátcem DPH, pokud je to u
          ceny výslovně uvedeno.
        </p>
        <h2>5. Práva spotřebitele při smlouvě na dálku</h2>
        <p>
          Zákazník jako spotřebitel má zpravidla právo odstoupit od smlouvy
          uzavřené na dálku do 14 dnů. Pokud však zákazník výslovně požádá o
          zahájení plnění služby před uplynutím lhůty pro odstoupení, může být
          právo na odstoupení omezeno nebo zaniknout v rozsahu stanoveném
          právními předpisy.
        </p>
        <p>
          Konkrétní podmínky odstoupení a případného poměrného vyúčtování budou
          vždy uvedeny v potvrzení objednávky a v komunikaci se zákazníkem.
        </p>
        <h2>6. Zrušení lekcí a náhrady</h2>
        <p>
          Pokud dojde ke zrušení lekce ze strany poskytovatele, bude nabídnut
          náhradní termín nebo jiná přiměřená forma náhrady. Pokud účastník
          lekci zmešká, individuální náhrada není nároková, ledaže se strany
          dohodnou jinak.
        </p>
        <h2>7. Reklamace a odpovědnost</h2>
        <p>
          Případné vady služby nebo reklamace může zákazník uplatnit na e-mailu{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Podnět
          vyřídíme bez zbytečného odkladu, nejpozději ve lhůtě stanovené
          právními předpisy.
        </p>
        <h2>8. Ochrana osobních údajů</h2>
        <p>
          Zpracování osobních údajů se řídí dokumentem &bdquo;Ochrana osobních
          údajů&ldquo; zveřejněným na tomto webu.
        </p>
        <h2>9. Mimosoudní řešení sporů</h2>
        <p>
          Spotřebitel má právo na mimosoudní řešení spotřebitelského sporu.
          Subjektem mimosoudního řešení je Česká obchodní inspekce (
          <a
            href="https://www.coi.cz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            coi.cz
          </a>
          ).
        </p>
        <h2>10. Závěrečná ustanovení</h2>
        <p>
          Právní vztahy se řídí právním řádem České republiky. Kontakt na
          poskytovatele:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
      </Prose>
    </div>
    </>
  );
}
