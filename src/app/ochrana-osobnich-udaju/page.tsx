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
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <Prose>
          <h1>Ochrana osobních údajů</h1>
          <p>
            Tento dokument vás informuje o zpracování osobních údajů při službě{" "}
            {site.name} v souladu s nařízením Evropského parlamentu a Rady (EU)
            2016/679 (obecné nařízení o ochraně osobních údajů, &bdquo;GDPR&ldquo;)
            a se zákonem č. 110/2019 Sb., o zpracování osobních údajů, ve znění
            pozdějších předpisů, a souvisejícími předpisy České republiky a EU.
          </p>
          <h2>1. Správce osobních údajů</h2>
          <p>
            Správcem je {site.company.legalName}, IČO {site.company.ic}, sídlo{" "}
            {site.company.addressLine} ({site.company.addressNote}).{" "}
            {site.company.registryMark}. Službu {site.name} provozujeme v
            návaznosti na značku {site.parentSite.name}. Kontakt správce:{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>, tel.{" "}
            <a href={`tel:${site.company.phoneTel}`}>
              {site.company.phoneDisplay}
            </a>
            .
          </p>
          <p>
            Pověřence pro ochranu osobních údajů (DPO) jsme nejmenovali; nejsme
            povinni jej mít podle čl. 37 GDPR. Dotazy ke zpracování osobních
            údajů vyřizujeme na výše uvedeném kontaktu.
          </p>
          <h2>2. Jaké osobní údaje zpracováváme</h2>
          <p>Zpracováváme zejména tyto kategorie údajů:</p>
          <ul>
            <li>
              <strong>Údaje zákonného zástupce (rodiče / objednatele):</strong>{" "}
              jméno, e-mail, telefon.
            </li>
            <li>
              <strong>Údaje o účastníkovi kurzu (dítěti):</strong> jméno, věk.
            </li>
            <li>
              <strong>Údaje o objednávce:</strong> zvolený formát kurzu
              (skupina / individuální výuka), vybraný termín, cena,
              souhlas s obchodními podmínkami a s tímto dokumentem, stav přihlášky,
              interní identifikátor přihlášky.
            </li>
            <li>
              <strong>Přístup rodiče k přehledu přihlášky:</strong> pro ověření
              identity při přihlášení přes odkaz v e-mailu zpracováváme údaje
              nezbytné k vydání přístupu (např. kontrola jednorázového tokenu /
              odkazu spojeného s vaší přihláškou a e-mailovou adresou).
            </li>
            <li>
              <strong>Provozní a bezpečnostní údaje:</strong> technické údaje o
              přístupu k webu (např. IP adresa v rozsahu nutném pro rate limiting,
              logy serveru v nezbytném rozsahu), údaje související s ochranou
              formuláře před zneužitím (viz Cloudflare Turnstile u registrace).
            </li>
            <li>
              <strong>Interní poznámky správce:</strong> textové poznámky k
              přihlášce vedené v administraci (nezveřejňujeme je účastníkům ani
              návštěvníkům webu).
            </li>
            <li>
              <strong>Záznamy online lekcí (audio/video):</strong> pokud je
              nahrávání aktivní, pořizujeme záznam v rozsahu nezbytném pro
              bezpečnost účastníků, kontrolu kvality výuky a případné řešení
              reklamací nebo sporů.
            </li>
          </ul>
          <p>
            Zvláštní kategorie osobních údajů ve smyslu čl. 9 GDPR (&bdquo;citlivé&ldquo; údaje) záměrně nevyžadujeme a nezpracováváme,
            ledaže byste nám je dobrovolně sdělili v komunikaci; takové údaje
            nebudeme dále zpracovávat bez zákonného důvodu.
          </p>
          <h2>3. Účely zpracování a právní základ (čl. 6 GDPR)</h2>
          <ul>
            <li>
              <strong>Registrace, uzavření a plnění smlouvy o kurzu</strong>{" "}
              (vyřízení objednávky, komunikace, organizace lekcí, potvrzení
              účasti): právní základ{" "}
              <strong>čl. 6 odst. 1 písm. b) GDPR</strong> (plnění smlouvy / kroky
              před uzavřením smlouvy na žádost subjektu údajů).
            </li>
            <li>
              <strong>Účetní a daňové povinnosti</strong> (vystavení a evidence
              dokladů): právní základ{" "}
              <strong>čl. 6 odst. 1 písm. c) GDPR</strong> (právní povinnost).
            </li>
            <li>
              <strong>Ochrana webu, prevence podvodů a zneužití</strong> (např.
              omezení počtu požadavků z jedné IP, ověření lidského přístupu u
              formuláře): právní základ{" "}
              <strong>čl. 6 odst. 1 písm. f) GDPR</strong> (oprávněný zájem
              správce na bezpečném provozu služby); oprávněný zájem jsme
              vyhodnotili v souladu s čl. 6 odst. 1 písm. f) GDPR a případně
              provedli test proporcionality.
            </li>
            <li>
              <strong>Volitelná analytika nebo marketing</strong> (pokud je na
              webu zapnuto až po vašem souhlasu): právní základ{" "}
              <strong>čl. 6 odst. 1 písm. a) GDPR</strong> (souhlas), který můžete
              kdykoli odvolat bez vlivu na zákonnost zpracování před odvoláním.
            </li>
            <li>
              <strong>Nahrávání online lekcí</strong> (bezpečnost, kvalita výuky,
              řešení reklamací a ochrana právních nároků): právní základ{" "}
              <strong>čl. 6 odst. 1 písm. a) GDPR</strong> (souhlas zákonného
              zástupce), který lze kdykoli odvolat pro budoucnost.
            </li>
          </ul>
          <p>
            Poskytnutí údajů nutných pro registraci je smluvním a zákonným
            požadavkem; bez nich objednávku nelze řádně vyřídit.
          </p>
          <h2>4. Doba uchování</h2>
          <ul>
            <li>
              Údaje z přihlášky a související komunikaci uchováváme po dobu
              trvání kurzu a následně nejdéle <strong>3 roky</strong>, pokud
              zákon nevyžaduje delší dobu (řešení sporů, reklamace, ochrana
              právních nároků).
            </li>
            <li>
              Účetní a daňové doklady uchováváme po dobu stanovenou právními
              předpisy ČR (obvykle <strong>10 let</strong>).
            </li>
            <li>
              Technické a bezpečnostní logy uchováváme po nezbytně nutnou dobu,
              zpravidla <strong>řádově týdny až měsíce</strong>, podle nastavení
              infrastruktury a bezpečnostních politik.
            </li>
            <li>
              Záznamy online lekcí uchováváme zpravidla nejdéle{" "}
              <strong>6 měsíců od konání lekce</strong>; delší uchování je možné
              pouze po dobu nezbytnou pro řešení konkrétní reklamace, stížnosti
              nebo právního sporu.
            </li>
          </ul>
          <h2>5. Příjemci a zpracovatelé</h2>
          <p>
            Údaje zpracováváme my a naši <strong>zpracovatelé</strong> podle čl.
            28 GDPR, s nimiž máme uzavřené smlouvy o zpracování osobních údajů
            nebo obdobné závazky. Mezi typické kategorie patří:
          </p>
          <ul>
            <li>
              <strong>Provoz webu a hosting</strong> (poskytovatel cloudové
              infrastruktury, např. platforma pro nasazení aplikace).
            </li>
            <li>
              <strong>Odesílání e-mailů</strong> — služba{" "}
              <strong>Resend</strong> (transakční e-maily k přihlášce, přístupu
              rodiče, případně interní notifikace).
            </li>
            <li>
              <strong>Ochrana formuláře před spamem</strong> —{" "}
              <strong>Cloudflare Turnstile</strong> při odeslání registrace
              (ověření, že za odesláním stojí člověk).
            </li>
            <li>
              <strong>Omezení zneužití rozhraní (rate limiting)</strong> — např.
              služba <strong>Supabase</strong>, pokud je v projektu nakonfigurována.
            </li>
            <li>
              <strong>Platební brána</strong> — pokud bude u aktivní platby zpracování
              provádět třetí strana, budete informováni v pokynech k platbě a v
              zásadách příslušného poskytovatele plateb.
            </li>
          </ul>
          <p>
            Seznam konkrétních dodavatelů vám na požádání sdělíme u jednotlivých
            zpracování, pokud to bude potřebné k uplatnění vašich práv.
          </p>
          <p>
            Záznamy lekcí neposkytujeme třetím osobám pro marketingové účely a
            neprodáváme je. Přístup k nim mají jen oprávněné osoby v rámci
            interního provozu správce a smluvní zpracovatelé v nezbytném rozsahu.
          </p>
          <h2>6. Předávání do třetích zemí (mimo EU/EHP)</h2>
          <p>
            Někteří zpracovatelé mohou osobní údaje zpracovávat i mimo Evropský
            hospodářský prostor. Předání probíhá vždy v souladu s kapitolou V GDPR
            — zejména na základě rozhodnutí Komise o odpovídající ochraně,
            standardních smluvních doložek schválených Komisí, případně jiných
            mechanismů stanovených GDPR.
          </p>
          <h2>7. Automatizované individuální rozhodování a profilování</h2>
          <p>
            Neprovádíme automatizované rozhodování ve smyslu čl. 22 GDPR ani
            profilování, které by mělo pro vás právní účinky nebo se vás obdobně
            významně dotýkalo.
          </p>
          <h2>8. Vaše práva</h2>
          <p>V souladu s GDPR máte zejména tato práva:</p>
          <ul>
            <li>právo na přístup k osobním údajům (čl. 15 GDPR),</li>
            <li>právo na opravu nepřesných údajů (čl. 16 GDPR),</li>
            <li>
              právo na výmaz (&bdquo;být zapomenut&ldquo;), omezení zpracování,
              přenositelnost údajů, kde to předpisy připouštějí (čl. 17–20 GDPR),
            </li>
            <li>
              právo vznést námitku proti zpracování založenému na oprávněném zájmu
              (čl. 21 GDPR),
            </li>
            <li>
              právo odvolat souhlas se zpracováním založeným na souhlasu, pokud ho
              používáme (čl. 7 odst. 3 GDPR),
            </li>
            <li>
              právo podat stížnost u Úřadu pro ochranu osobních údajů (viz oddíl
              10 níže).
            </li>
          </ul>
          <p>
            Žádosti o výkon práv podávejte na{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. O
            opatřeních vám odpovíme bez zbytečného odkladu, obvykle do jednoho
            měsíce; u složitých žádostí může být lhůta prodloužena v souladu s
            GDPR.
          </p>
          <p>
            Pokud je zpracování založeno na souhlasu (např. nahrávání lekcí),
            můžete souhlas kdykoli odvolat. Odvolání nemá zpětný účinek na již
            zákonně provedené zpracování před okamžikem odvolání.
          </p>
          <h2>9. Cookies a podobné technologie</h2>
          <p>
            Podrobnosti o cookies a ukládání v prohlížeči najdete na stránce{" "}
            <a href="/cookies">Cookies</a>.
          </p>
          <h2>10. Dozorový úřad</h2>
          <p>
            Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7,{" "}
            <a
              href="https://www.uoou.cz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.uoou.cz
            </a>
            .
          </p>
        </Prose>
      </div>
    </>
  );
}
