import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Jak probíhá lekce",
  description:
    "Formát online lekce AI kroužku: délka 60 minut, co mít připravené, role rodiče. Kurz pro děti 10–15 let.",
  path: "/jak-probiha",
});

const blocks = [
  {
    title: "Délka a režim",
    body: `Každá lekce trvá ${site.pricing.lessonMinutes} minut, jednou týdně. Kurz má ${site.pricing.lessons} lekcí (pilotní běh zhruba tři měsíce). Probíhá online — odkaz na hovor dostanete před začátkem.`,
  },
  {
    title: "Co dítě potřebuje u sebe",
    body: "Notebook nebo tablet, stabilnější připojení, klid na soustředění. Mikrofon je užitečný; kamera podle domluvy a pohodlí rodiny.",
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-h1">Jak probíhá lekce ⚡</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Stručně a srozumitelně pro rodiče i děti — aby bylo jasné, co čekat před
        první hodinou.
      </p>
      <div className="mt-12 space-y-12">
        {blocks.map((b) => (
          <Section key={b.title} title={b.title}>
            <p className="text-slate-600 leading-relaxed">{b.body}</p>
          </Section>
        ))}
      </div>
    </div>
  );
}
