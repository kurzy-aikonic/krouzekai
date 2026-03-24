import type { Metadata } from "next";
import { Prose } from "@/components/ui/Prose";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Obchodní podmínky",
  description: `Obchodní podmínky služby ${site.name} — registrace, platba, kurz.`,
  path: "/obchodni-podminky",
});

export default function ObchodniPodminkyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Prose>
        <h1>Obchodní podmínky</h1>
        <p>
          <strong>Upozornění:</strong> Tento text je kostra pro váš projekt.
          Před zveřejněním ho doplňte o údaje o poskytovateli (identifikace,
          kontakt, IČO), přesný popis služby, platební a storno podmínky a
          reklamační řád. Nechte text zkontrolovat právníkem.
        </p>
        <h2>1. Základní ustanovení</h2>
        <p>
          Tyto obchodní podmínky upravují vztah mezi poskytovatelem služby
          &bdquo;{site.name}&ldquo; (dále jen &bdquo;poskytovatel&ldquo;) a
          zákazníkem — zákonným zástupcem účastníka kurzu (dále jen
          &bdquo;zákazník&ldquo;).
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
        <h2>5. Odstoupení od smlouvy</h2>
        <p>
          Doplňte lhůty a podmínky pro odstoupení podle platné právní úpravy a
          vaší praxe (např. zda jde o vzdělávání s pevným termínem apod.).
        </p>
        <h2>6. Zrušení lekcí a náhrady</h2>
        <p>
          Doplňte pravidla pro zrušení lekce ze strany poskytovatele nebo
          účastníka, náhradní termíny a případné záznamy.
        </p>
        <h2>7. Ochrana osobních údajů</h2>
        <p>
          Zpracování osobních údajů se řídí dokumentem &bdquo;Ochrana osobních
          údajů&ldquo; zveřejněným na tomto webu.
        </p>
        <h2>8. Závěrečná ustanovení</h2>
        <p>
          Právní vztahy se řídí právním řádem České republiky. Kontakt na
          poskytovatele:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
      </Prose>
    </div>
  );
}
