import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Prose } from "@/components/ui/Prose";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Pravidla online kroužku",
  description: metaDescriptions.pravidlaOnlineKrouzku,
  path: "/pravidla-online-krouzku",
});

export default function PravidlaOnlineKrouzkuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Pravidla online kroužku", path: "/pravidla-online-krouzku" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <Prose>
          <h1>Pravidla online kroužku</h1>
          <p>
            Tento dokument doplňuje <a href="/obchodni-podminky">obchodní podmínky</a>{" "}
            a platí pro všechny účastníky kurzu {site.name} a jejich zákonné
            zástupce.
          </p>

          <h2>1. Bezpečné a respektující chování</h2>
          <ul>
            <li>Chováme se slušně k lektorovi i ostatním účastníkům.</li>
            <li>Netolerujeme šikanu, urážky, zastrašování ani zesměšňování.</li>
            <li>
              Nepředáváme ostatním účastníkům citlivé osobní údaje (hesla,
              adresy, telefonní čísla apod.).
            </li>
          </ul>

          <h2>2. Nahrávání a sdílení obsahu</h2>
          <ul>
            <li>
              Bez souhlasu lektora a zákonného zástupce dotčené osoby je zakázáno
              pořizovat a sdílet záznamy lekcí nebo obrazovek ostatních účastníků.
            </li>
            <li>
              Záznamy pořízené poskytovatelem slouží pouze pro interní účely
              bezpečnosti, kvality výuky a řešení stížností či reklamací.
            </li>
          </ul>

          <h2>3. Pravidla pro práci s AI</h2>
          <ul>
            <li>
              Je zakázáno vytvářet přes AI nelegální, nenávistný, sexuálně
              explicitní (NSFW) nebo jinak škodlivý obsah.
            </li>
            <li>
              Je zakázáno používat AI ke kyberšikaně, podvodům, vydávání se za
              jiné osoby nebo tvorbě deepfake materiálů jiných účastníků.
            </li>
            <li>
              Účastník i zákonný zástupce respektují podmínky a věkové limity
              konkrétních AI služeb třetích stran.
            </li>
          </ul>

          <h2>4. Důsledky porušení pravidel</h2>
          <p>
            Při porušení pravidel může poskytovatel přijmout přiměřená opatření:
            upozornění, omezení účasti v konkrétní lekci, kontaktování zákonného
            zástupce nebo v závažných případech vyloučení z kurzu bez náhrady.
          </p>

          <h2>5. Kontakt</h2>
          <p>
            Dotazy k pravidlům směřujte na{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </Prose>
      </div>
    </>
  );
}
