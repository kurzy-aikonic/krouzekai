import Link from "next/link";
import { ParentPortalLoginForms } from "@/components/rodic/ParentPortalLoginForms";
import { parentAuthSecretConfigured } from "@/lib/parent-auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ chyba?: string }>;
};

export default async function RodicPrihlaseniPage({ searchParams }: PageProps) {
  const q = await searchParams;
  const linkError = q.chyba === "odkaz";

  if (!parentAuthSecretConfigured()) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <div className="portal-card border-amber-200 bg-amber-50/95 p-6 text-sm text-amber-950">
          <p className="font-bold">Přihlášení rodičů není aktivní</p>
          <p className="mt-2 leading-relaxed">
            V <code className="rounded bg-white px-1">web/.env</code> nastavte{" "}
            <code className="rounded bg-white px-1">PARENT_AUTH_SECRET</code>{" "}
            (min. 16 znaků), restartujte server a obnovte stránku.
          </p>
        </div>
        <Link href="/" className="mt-8 block text-center text-sm text-violet-700 underline">
          Zpět na úvod
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-6 sm:py-10">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Přihlášení rodičů
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Zvolte <strong>odkaz e-mailem</strong> (rychlé, bez hesla) nebo si{" "}
        <strong>založte účet s heslem</strong> — vždy musíte použít stejný e-mail
        jako u přihlášky na kurz.
      </p>
      <div className="mt-8">
        <ParentPortalLoginForms linkError={linkError} />
      </div>
    </div>
  );
}
