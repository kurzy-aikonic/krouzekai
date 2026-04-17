import type { Metadata } from "next";
import { CookiesPageClient } from "@/components/cookies/CookiesPageClient";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Prose } from "@/components/ui/Prose";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { COOKIE_CONSENT_POLICY_VERSION } from "@/lib/cookie-consent";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Zásady cookies",
  description: metaDescriptions.cookies,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Zásady cookies", path: "/cookies" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <Prose>
        <h1>Cookies a podobné technologie</h1>
        <p>
          Tento web používá cookies a obdobná úložiště v zařízení (zejména{" "}
          <strong>localStorage</strong> v doméně webu). Zpracování probíhá v
          souladu s <strong>směrnicí ePrivacy</strong> (implementovanou v českém
          právu) a <strong>nařízením GDPR</strong>. Jako provozovatel určujeme
          účely a prostředky zpracování; u nástrojů třetích stran odkazujeme na
          jejich dokumentaci.
        </p>
        <h2>Správce a kontakt</h2>
        <p>
          Správce osobních údajů v rozsahu identifikátorů souvisejících s
          cookies / měřením je provozovatel uvedený v{" "}
          <a href="/ochrana-osobnich-udaju">zásadách ochrany osobních údajů</a>.
          Dotazy k cookies:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
        <h2>Nezbytné cookies a technologie</h2>
        <p>
          Nutné pro základní funkce webu (např. technický provoz aplikace,
          bezpečnost, zobrazení stránky). Zahrnují také uložení{" "}
          <strong>evidence vaší volby</strong> v cookie liště (kategorie souhlasu,
          čas rozhodnutí, verze textu zásad) — bez toho by nebylo možné prokázat
          dodržení pravidel ani respektovat vaše „ne“ u volitelných nástrojů.
          Právní základ: <strong>oprávněný zájem</strong> a/nebo{" "}
          <strong>plnění smlouvy</strong> (čl. 6 odst. 1 písm. f) a b) GDPR) a
          příslušná ustanovení o elektronických komunikacích pro nezbytné
          ukládání.
        </p>
        <p>
          Pro přihlášení do <strong>interního adminu</strong> (
          <a href="/admin/login">/admin</a>) a do{" "}
          <strong>rodičovského přehledu</strong> (
          <a href="/rodic/prihlaseni">/rodic/prihlaseni</a>) používáme{" "}
          <strong>technické cookies relace</strong> (httpOnly, vázané na doménu
          webu). Slouží výhradně k udržení přihlášení a bezpečnosti relace;{" "}
          <strong>není je možné vypnout v cookie liště</strong>, protože nejsou
          volitelné — bez nich by přihlášení nefungovalo. Právní základ obdobně
          jako u ostatních nezbytných technologií (plnění smluvního vztahu /
          oprávněný zájem na zabezpečení přístupu).
        </p>
        <p>
          Na stránce <a href="/registrace">Registrace</a> může být pro ochranu
          formuláře před roboty načten widget <strong>Cloudflare Turnstile</strong>.
          Turnstile může v souvislosti s ověřením uložit vlastní cookies nebo
          podobné identifikátory v doméně Cloudflare; jde o zpracování podle
          pravidel společnosti Cloudflare a podle našich zásad ochrany osobních
          údajů (oprávněný zájem / plnění smlouvy a bezpečnost). Bez úspěšného
          ověření (pokud je Turnstile v prostředí zapnuto) nelze formulář v některých
          konfiguracích odeslat.
        </p>
        <h2>Analytické cookies</h2>
        <p>
          Slouží ke statistikám návštěvnosti (např. Google Analytics 4).{" "}
          <strong>Nenačítáme je předem:</strong> aktivují se až po vašem{" "}
          <strong>výslovném souhlasu</strong> (čl. 6 odst. 1 písm. a) GDPR a
          související pravidla ePrivacy). Souhlas je svobodný, konkrétní,
          informovaný a jednoznačný; můžete ho kdykoli stáhnout se stejnou
          lehkostí, jako byl udělen.
        </p>
        <h2>Marketingové cookies</h2>
        <p>
          Slouží k personalizaci reklamy, remarketingu apod. V této verzi webu{" "}
          <strong>nenasazujeme žádný marketingový pixel</strong>; přesto vám
          nástroj pro souhlas umožňuje kategorii oddělit — až ji začneme
          používat, rozšíříme tento text a verzi zásad (viz níže), čímž se u
          uložených souhlasů může znovu objevit výzva k potvrzení.
        </p>
        <h2>Jak ukládáme vaši volbu (CMP)</h2>
        <p>
          Údaje o souhlasu ukládáme v prohlížeči v <strong>localStorage</strong>{" "}
          pod klíčem{" "}
          <code className="rounded bg-slate-100 px-1">krouzek-cookie-consent</code>{" "}
          jako JSON s poli: verze zásad (<code className="rounded bg-slate-100 px-1">
            policyVersion
          </code>{" "}
          = aktuálně {COOKIE_CONSENT_POLICY_VERSION}), čas rozhodnutí (
          <code className="rounded bg-slate-100 px-1">decidedAt</code>) a příznaky
          kategorií (<code className="rounded bg-slate-100 px-1">analytics</code>,{" "}
          <code className="rounded bg-slate-100 px-1">marketing</code>). Po
          zvýšení <code className="rounded bg-slate-100 px-1">policyVersion</code> v
          kódu webu se výzva k souhlasu může znovu zobrazit, aby odpovídala novému
          znění.
        </p>
        <h2>Jaké nástroje aktuálně používáme</h2>
        <ul>
          <li>
            Cookie / consent lišta a úložiště volby (viz výše).
          </li>
          <li>
            Google Analytics — pouze po souhlasu s analytikou; návod ke
            zpracování dat poskytuje Google.
          </li>
          <li>
            Na stránce <a href="/registrace">Registrace</a> může být widget{" "}
            <strong>Cloudflare Turnstile</strong> (nezbytná ochrana před zneužitím);
            může ukládat vlastní cookies v doméně Cloudflare podle jejich
            zásad.
          </li>
          <li>
            Transakční e-maily (potvrzení přihlášky, odkazy pro rodiče) zpracovává
            dodavatel (např. Resend); nejde o cookies tohoto webu, ale o předání
            údajů příjemci podle smlouvy o zpracování.
          </li>
        </ul>
        <h2>Doba uložení a vaše práva</h2>
        <p>
          Záznam o souhlasu uchováváme v úložišti prohlížeče, dokud ho nevymažete
          nebo ho nepřepíšete novou volbou. Máte právo souhlas odvolat, vznést
          námitku, požadovat přístup nebo výmaz v rozsahu možností technologie
          (vyčištění úložiště pro tento web). Podrobněji v informacích pro
          subjekty údajů.
        </p>
        <h2>Jak volbu změnit</h2>
        <p>
          Kdykoli použijte odkaz <strong>Nastavení cookies</strong> v patičce
          nebo tlačítko níže — otevře se stejné rozhraní jako při první návštěvě
          (režim úprav). Alternativně můžete vymazat údaje pro tuto doménu v
          nastavení prohlížeče; poté uvidíte úvodní výzvu znovu.
        </p>
        <CookiesPageClient />
        <h2>Kontakt</h2>
        <p>
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </p>
        </Prose>
      </div>
    </>
  );
}
