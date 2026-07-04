import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getCourseRunById } from "@/lib/course-runs-store";
import { pageMetadata } from "@/lib/seo";
import { findRegistrationById } from "@/lib/registrations-store";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Přihláška odeslána",
  description:
    "Potvrzení o odeslání přihlášky do AI kroužku včetně dalších kroků, platebních informací a doporučení před první lekcí.",
  path: "/registrace/potvrzeni",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function RegistracePotvrzeniPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const q = await searchParams;
  const code = q.code?.trim() ?? "";
  const record = code ? await findRegistrationById(code) : null;
  const run = record?.runId ? await getCourseRunById(record.runId) : null;

  const formatLabel =
    record?.format === "individual" ? "Individuální 1:1" : "Skupinový kurz";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Registrace", path: "/registrace" },
          { name: "Přihláška odeslána", path: "/registrace/potvrzeni" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-emerald-800">
            Přihláška byla úspěšně odeslána
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-emerald-950 sm:text-4xl">
            Mise zahájena! 🚀
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-900 sm:text-base">
            Děkujeme za registraci do {site.name}. Ozveme se vám do 24 hodin a
            společně doladíme finální zařazení, termín i organizační detaily.
          </p>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            Shrnutí přihlášky
          </h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Kód přihlášky
              </dt>
              <dd className="mt-1 font-mono text-base font-bold text-violet-900">
                {(record?.registrationCode ?? code) || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Formát
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {record ? formatLabel : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Zvolený termín
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {run?.label ?? (record?.runId ? "Vybraný termín" : "Bude domluven")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Cena
              </dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {record?.amountCzk
                  ? `${record.amountCzk.toLocaleString("cs-CZ")} Kč`
                  : "Upřesníme po domluvě"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50/60 p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-violet-950">
            Co bude následovat
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-violet-950">
            <li>
              <strong>1)</strong> Potvrdíme přijetí přihlášky e-mailem.
            </li>
            <li>
              <strong>2)</strong> Doporučíme finální úroveň dítěte (začátečník /
              pokročilý / profesionál) a domluvíme konkrétní termín.
            </li>
            <li>
              <strong>3)</strong> Zašleme fakturu a po úhradě organizační informace
              k první lekci.
            </li>
          </ol>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            Co připravit před první lekcí
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
            <li>Notebook nebo počítač se stabilním internetem.</li>
            <li>Klidné místo a funkční mikrofon.</li>
            <li>
              Chuť tvořit — technické věci i práci s AI dítě provedeme krok za
              krokem.
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          {code ? (
            <Link
              href={`/platba?registrace=${encodeURIComponent(code)}`}
              className="btn-magic"
            >
              Přehled k platbě 💳
            </Link>
          ) : null}
          <Link href="/rodic/prihlaseni" className="btn-magic-outline">
            Přehled pro rodiče
          </Link>
          <Link href="/" className="btn-magic-outline">
            Zpět na úvod
          </Link>
        </div>
      </div>
    </>
  );
}
