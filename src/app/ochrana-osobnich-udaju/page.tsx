import type { Metadata } from "next";
import { Prose } from "@/components/ui/Prose";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Ochrana osobních údajů (GDPR)",
  description: `Zásady zpracování osobních údajů při registraci na ${site.name}.`,
  path: "/ochrana-osobnich-udaju",
});

export default function OchranaOsobnichUdajuPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Prose>
        <h1>Ochrana osobních údajů</h1>
        <p>
          <strong>Upozornění:</strong> Text doplňte o správce (identifikace,
          kontakt), právní základ zpracování, doby uchování, příjemce,
          předávání do třetích zemí, práva subjektů údajů a kontakt na DPO
          (pokud ho máte). Tato kostra slouží jen jako výchozí bod.
        </p>
        <h2>1. Kdo zpracovává údaje</h2>
        <p>
          Správcem osobních údajů je provozovatel služby {site.name}. Kontakt:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
        <h2>2. Jaké údaje zpracováváme</h2>
        <ul>
          <li>Údaje zákonného zástupce: jméno, e-mail, telefon.</li>
          <li>Údaje o účastníkovi kurzu: jméno, věk.</li>
          <li>Údaje o zvoleném termínu a formátu kurzu.</li>
          <li>Technické údaje nutné pro provoz webu (např. logy serveru).</li>
        </ul>
        <h2>3. Účel a právní základ</h2>
        <p>
          Údaje zpracováváme za účelem registrace na kurz, komunikace ohledně
          průběhu a plnění smlouvy, případně v souladu se zájmem správce nebo
          oprávněným zájmem (např. bezpečnost). Konkrétní právní základy doplňte
          podle skutečného nastavení (čl. 6 GDPR).
        </p>
        <h2>4. Doba uchování</h2>
        <p>
          Údaje uchováváme po dobu nezbytnou k naplnění účelu, případně po dobu
          stanovenou zákonem (účetnictví apod.). Po uplynutí doby údaje smažeme
          nebo anonymizujeme.
        </p>
        <h2>5. Příjemci a zpracovatelé</h2>
        <p>
          Údaje mohou zpracovávat zpracovatelé (např. poskytovatel hostingu,
          e-mailové služby, platební brány), s nimiž má správce uzavřenou smlouvu
          o zpracování podle čl. 28 GDPR. Seznam doplňte podle reálných dodavatelů.
        </p>
        <h2>6. Práva subjektů údajů</h2>
        <p>
          Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost
          a vznést námitku, kde to předpisy připouštějí. Máte právo podat stížnost
          u Úřadu pro ochranu osobních údajů.
        </p>
        <h2>7. Cookies</h2>
        <p>
          Informace o cookies najdete na stránce{" "}
          <a href="/cookies">Cookies</a>.
        </p>
      </Prose>
    </div>
  );
}
