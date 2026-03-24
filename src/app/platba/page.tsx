import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutButton } from "@/components/platba/CheckoutButton";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";
import { variableSymbolFromRegistrationId } from "@/lib/payment";
import { findRegistrationById } from "@/lib/registrations-store";

export const metadata: Metadata = pageMetadata({
  title: "Platba kurzovného",
  description:
    "Platební instrukce po přihlášce — bankovní převod a variabilní symbol.",
  path: "/platba",
  noIndex: true,
});

const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PageProps = {
  searchParams: Promise<{ registrace?: string }>;
};

export default async function PlatbaPage({ searchParams }: PageProps) {
  const q = await searchParams;
  const rawId = q.registrace?.trim() ?? "";

  if (!rawId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Platba 💳</h1>
        <p className="mt-4 font-medium leading-relaxed text-slate-700">
          Tato stránka se zobrazí po registraci z odkazu v potvrzení. Pokud jste
          odkaz ztratili, napište nám na{" "}
          <a
            href={`mailto:${site.contactEmail}`}
            className="font-bold text-violet-600 underline"
          >
            {site.contactEmail}
          </a>{" "}
          — pošleme znovu.
        </p>
        <Link
          href="/registrace"
          className="btn-magic-outline mt-6 inline-flex text-sm"
        >
          ← Registrace
        </Link>
      </div>
    );
  }

  if (!uuidRe.test(rawId)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Neplatný odkaz 😕</h1>
        <p className="mt-4 font-medium text-slate-700">
          Odkaz na platbu je poškozený. Kontaktujte nás e-mailem.
        </p>
      </div>
    );
  }

  const record = await findRegistrationById(rawId);
  const vs = variableSymbolFromRegistrationId(rawId);
  const amount = record?.amountCzk;
  const formatLabel =
    record?.format === "individual"
      ? "Individuální 1:1"
      : record?.format === "skupina"
        ? "Skupinový kurz"
        : "Kurz";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="page-h1">Platba kurzovného 💰</h1>
      <p className="mt-2 text-sm font-semibold text-slate-600">
        Číslo přihlášky:{" "}
        <span className="font-mono text-slate-700">{rawId}</span>
      </p>

      <div className="card-playful mt-8 space-y-6 bg-gradient-to-b from-white to-violet-50">
        <div>
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Souhrn
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <span className="text-slate-500">Formát:</span> {formatLabel}
            </li>
            {amount != null ? (
              <li>
                <span className="text-slate-500">Částka:</span>{" "}
                <strong>{amount} Kč</strong> ({site.pricing.vatNote})
              </li>
            ) : (
              <li className="text-slate-600">
                Částku doplníme podle typu kurzu ze smlouvy / e-mailu. Skupina{" "}
                {site.pricing.skupinaCourse} Kč, 1:1 {site.pricing.individualCourse}{" "}
                Kč za {site.pricing.lessons} lekcí.
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Bankovní převod
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Doplň číslo účtu a název příjemce do administrace (proměnné prostředí
            nebo CMS). Do poznámky uveďte číslo přihlášky nebo variabilní symbol.
          </p>
          <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Variabilní symbol</dt>
              <dd className="font-mono font-semibold text-slate-900">{vs}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Číslo účtu</dt>
              <dd className="text-right text-slate-700">
                {process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "— doplnit —"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">IBAN</dt>
              <dd className="text-right font-mono text-xs text-slate-700 break-all">
                {process.env.NEXT_PUBLIC_BANK_IBAN ?? "— doplnit —"}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Online platba
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Po napojení platební brány tlačítko přesměruje na bezpečnou platbu.
          </p>
          <div className="mt-4">
            <CheckoutButton registrationId={rawId} />
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Dotazy?{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-bold text-violet-600 underline"
        >
          {site.contactEmail}
        </a>
      </p>
    </div>
  );
}
