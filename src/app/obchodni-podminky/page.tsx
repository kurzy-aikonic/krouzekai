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
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
      <Prose>
        <h1>Obchodní podmínky</h1>
        <p>
          Tyto obchodní podmínky (dále jen &bdquo;OP&ldquo;) upravují smluvní
          vztah mezi poskytovatelem online kurzu &bdquo;{site.name}&ldquo; a
          zákazníkem. <strong>Zákazníkem</strong> se rozumí fyzická osoba —
          zákonný zástupce dítěte, který v jeho prospěch objednává kurz.
          <strong>Účastníkem</strong> kurzu se rozumí dítě ve věku{" "}
          {site.audience.ageMin} až {site.audience.ageMax} let, které se kurzu
          účastní. Je-li zákazník spotřebitel ve smyslu zákona č. 89/2012 Sb.,
          občanský zákoník, ve znění pozdějších předpisů (dále jen &bdquo;OZ&ldquo;),
          a zákona č. 634/1992 Sb., o ochraně spotřebitele, ve znění pozdějších
          předpisů, použijí se na něj i zvláštní ustanovení těchto předpisů;
          odchylná ujednání v neprospěch spotřebitele nemají účinky.
        </p>
        <h2>1. Identifikace poskytovatele</h2>
        <p>
          Poskytovatelem je {site.company.legalName}, IČO {site.company.ic},
          sídlo {site.company.addressLine} ({site.company.addressNote}).{" "}
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
          Předmětem je <strong>online vzdělávací kurz</strong> zaměřený na
          praktické využití umělé inteligence (programování a tvorba s AI —
          &bdquo;vibecoding&ldquo;), probíhající v českém jazyce distančním
          způsobem (videohovor). Kurz sestává z {site.pricing.lessons} lekcí po{" "}
          {site.pricing.lessonMinutes} minutách, obvykle jednou za 14 dní, vždy
          online; podrobnosti o průběhu jsou na stránce{" "}
          <a href="/jak-probiha">Jak to u nás funguje</a>.
        </p>
        <p>
          Nabízíme tyto formáty:{" "}
          <strong>skupinový kurz</strong> (maximálně {site.pricing.groupMaxStudents}{" "}
          účastníků ve skupině) a <strong>individuální výuka 1:1</strong>.
          Konkrétní termíny a dostupná kapacita jsou uvedeny na webu (např.{" "}
          <a href="/aktualni-behy">Aktuální termíny</a>
          ) a v průběhu objednávky.
        </p>
        <h2>3. Objednávka a uzavření smlouvy</h2>
        <p>
          Objednávka vzniká vyplněním a odesláním registračního formuláře na
          tomto webu se souhlasem s těmito OP a se zásadami ochrany osobních
          údajů (GDPR). Účastník kurzu je ve věku {site.audience.ageMin} až{" "}
          {site.audience.ageMax} let; objednávku proto činí výhradně jeho zákonný
          zástupce, který odpovídá za správnost údajů a za účast účastníka v
          kurzu.
        </p>
        <p>
          Smlouva mezi poskytovatelem a zákazníkem je uzavřena{" "}
          <strong>potvrzením objednávky</strong> ze strany poskytovatele, zpravidla
          e-mailem, nebo jiným projevem vůle, kterým poskytovatel objednávku
          přijme. Do doby potvrzení jde o návrh smlouvy.
        </p>
        <h2>4. Cena</h2>
        <p>
          Ceny jsou uváděny v <strong>českých korunách (Kč)</strong>. Aktuální
          ceny za celý kurz: skupinový formát{" "}
          <strong>{site.pricing.skupinaCourse.toLocaleString("cs-CZ")} Kč</strong>
          , individuální formát{" "}
          <strong>
            {site.pricing.individualCourse.toLocaleString("cs-CZ")} Kč
          </strong>
          . {site.pricing.vatNote}
        </p>
        <p>
          Poskytovatel je oprávněn ceny jednostranně upravit pro nové objednávky;
          pro již uzavřenou smlouvu zůstává cena dle potvrzení objednávky.
        </p>
        <h2>5. Platba</h2>
        <p>
          Způsob platby a splatnost vám sdělíme v potvrzení objednávky a v
          následné komunikaci. Obvykle probíhá platba{" "}
          <strong>bankovním převodem</strong> na účet uvedený na stránce{" "}
          <a href="/platba">Platba</a> (s variabilním symbolem podle pokynů).
          Fakturace probíhá v souladu s účetními předpisy; konkrétní fakturační
          údaje domlouváme individuálně. Pokud bude na webu dostupná online
          platební brána, platí pro ni totéž potvrzení objednávky a tyto OP,
          včetně informací uvedených u platby.
        </p>
        <h2>6. Právo spotřebitele odstoupit od smlouvy (smlouva uzavřená na dálku)</h2>
        <p>
          Jste-li spotřebitel, máte podle § 1829 a násl. OZ právo odstoupit od
          smlouvy uzavřené distančním způsobem bez udání důvodu ve lhůtě{" "}
          <strong>14 dnů</strong> ode dne uzavření smlouvy, není-li stanoveno
          jinak zákonem.
        </p>
        <p>
          Právo na odstoupení může být podle § 1837 a násl. OZ vyloučeno nebo
          omezeno u některých smluv o službách (např. služby v oblasti volného
          času na určité období) anebo pokud bylo plnění zahájeno na{" "}
          <strong>výslovnou žádost</strong> spotřebitele před uplynutím lhůty a
          spotřebitel byl řádně poučen o zániku práva na odstoupení — podle
          konkrétního znění OZ. Odstoupíte-li včas v případě, kdy vám právo
          náleží, vrátíme uhrazené platby obvyklým způsobem, nejpozději do 14 dnů
          od odstoupení, pokud zákon nestanoví jinak.
        </p>
        <p>
          Odstoupení můžete uplatnit jednoznačným projevem vůle zaslaným na{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. K
          odstoupení můžete použít vzorový formulář (není povinný), který najdete
          např. na stránkách České obchodní inspekce.
        </p>
        <h2>7. Zrušení lekcí, nedostavení se, změny rozvrhu</h2>
        <p>
          Zruší-li poskytovatel lekci z vážného důvodu, nabídne náhradní termín
          nebo jiné přiměřené řešení. Účastník, který se bez omluvy nedostaví,
          nemá nárok na náhradní termín, ledaže se strany dohodnou jinak.
        </p>
        <h2>8. Reklamace a odpovědnost</h2>
        <p>
          Reklamaci služby uplatněte bez zbytečného odkladu na{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. O
          vyřízení reklamace vás budeme informovat; lhůty a postup se řídí OZ a
          zákonem o ochraně spotřebitele. Poskytovatel neodpovídá za přerušení
          spojení, technické problémy na straně zákazníka nebo třetích osob
          mimo rozumnou kontrolu poskytovatele.
        </p>
        <h2>9. Chování účastníka, bezpečnost a ochrana mládeže</h2>
        <p>
          Účastník se zavazuje chovat v online lekcích slušně, nešířit nevhodný
          obsah a dodržovat pokyny lektora. Zákonný zástupce odpovídá za to, že
          prostředí pro účast dítěte je vhodné.
        </p>
        <h2>10. Nahrávání online lekcí (bezpečnost, kvalita, reklamace)</h2>
        <p>
          Za účelem ochrany dítěte, lektora a poskytovatele, zajištění kvality
          výuky a doložení průběhu při řešení reklamací nebo sporných situací
          může poskytovatel pořizovat <strong>audio/video záznam online lekcí</strong>.
          Právním základem je <strong>souhlas zákonného zástupce</strong>, který
          je udělován při registraci.
        </p>
        <p>
          Záznamy slouží výhradně pro <strong>interní účely</strong> poskytovatele
          (zejména bezpečnost, kontrola kvality, řešení stížností a reklamací).
          Nejsou určeny k veřejnému zveřejnění, marketingu ani prodeji třetím
          osobám.
        </p>
        <p>
          Záznamy uchováváme po dobu nezbytně nutnou, zpravidla nejdéle{" "}
          <strong>6 měsíců od konání lekce</strong>, pokud delší dobu nevyžaduje
          ochrana právních nároků v konkrétním případě (např. probíhající
          reklamace nebo spor). Po uplynutí doby uchování záznam bezpečně
          odstraníme.
        </p>
        <h2>11. Duševní vlastnictví</h2>
        <p>
          Materiály poskytnuté v kurzu (texty, ukázky, struktura lekcí) jsou
          chráněny právy duševního vlastnictví. Slouží pouze pro osobní potřebu
          účastníka v rámci kurzu; další šíření, komerční využití nebo zpřístupnění
          třetím osobám bez souhlasu poskytovatele není přípustné.
        </p>
        <h2>12. Ochrana osobních údajů</h2>
        <p>
          Zpracování osobních údajů upravuje dokument{" "}
          <a href="/ochrana-osobnich-udaju">Ochrana osobních údajů</a> na tomto
          webu, včetně informací podle čl. 13 a 14 nařízení Evropského parlamentu
          a Rady (EU) 2016/679 (GDPR).
        </p>
        <h2>13. Mimosoudní řešení sporů</h2>
        <p>
          Spotřebitel má právo obrátit se na Českou obchodní inspekci (
          <a
            href="https://www.coi.cz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            coi.cz
          </a>
          ) s návrhem na zahájení mimosoudního řešení spotřebitelského sporu.
          Platformu pro řešení sporů on-line v rámci EU najdete na{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
        <h2>14. Závěrečná ustanovení</h2>
        <p>
          Právní vztahy se řídí právem České republiky. Soudní příslušnost se
          řídí obecnými ustanoveními; u spotřebitele platí zákonná příslušnost
          soudu dle jeho bydliště, pokud tak stanoví kogentní normy. Tyto OP
          nabývají účinnosti zveřejněním na tomto webu. Aktuální znění je vždy
          dostupné na stránce Obchodní podmínky tohoto webu. Kontakt:{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
      </Prose>
    </div>
    </>
  );
}
