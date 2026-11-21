import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Section } from "@/components/ui/Section";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Jak probíhá online kroužek AI",
  description: metaDescriptions.jakProbiha,
  path: "/jak-probiha",
  keywords: ["jak probíhá online kroužek AI", "online výuka AI děti"],
});

const blocks = [
  {
    title: "Délka a režim",
    body: `Každá lekce trvá ${site.pricing.lessonMinutes} minut a probíhá online. Jarní skupiny 2027 se scházejí každý týden, v úterý nebo ve čtvrtek od 16:00. Kurz má ${site.pricing.lessons} lekcí. Týdny jarních prázdnin a Velikonoc vynecháváme. Odkaz na hovor dostanete před začátkem.`,
  },
  {
    title: "Co dítě potřebuje u sebe",
    body: `${site.equipment} Kamera podle domluvy a pohodlí rodiny.`,
  },
  {
    title: "Jak lekce strukturujeme",
    body: "Krátké zadání nebo opakování, pak hlavní tvorba s AI (hra, appka, web…), na závěr sdílení pokroku a domácí „malý krok“ jen pokud to dává smysl — bez přetěžování.",
  },
  {
    title: "Role rodiče",
    body: "U mladších dětí občas pomůže přihlášení do nástroje nebo technický drobný problém. Není potřeba sedět u obrazovky celou hodinu — důležitá je domluva a podpora.",
  },
];

export default function JakProbihaPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Jak kroužek probíhá", path: "/jak-probiha" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Jak kroužek probíhá</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Stručně a srozumitelně pro rodiče i děti — aby bylo jasné, co čekat před
          první hodinou.
        </p>
        <div className="mt-12 space-y-5">
          {blocks.map((b) => (
            <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Section title={b.title}>
                <p className="text-slate-600 leading-relaxed">{b.body}</p>
              </Section>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
