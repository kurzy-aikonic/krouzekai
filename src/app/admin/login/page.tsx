import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  adminEmailsConfigured,
  adminSecretConfigured,
  verifyAdminCookie,
} from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ chyba?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const q = await searchParams;

  if (!adminSecretConfigured()) {
    return (
      <div className="portal-shell mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <div className="portal-card border-amber-200 bg-amber-50/95 p-6 text-sm text-amber-950">
          <p className="font-bold">Chybí ADMIN_SECRET</p>
          <p className="mt-2 leading-relaxed">
            V souboru <code className="rounded bg-white px-1">web/.env</code>{" "}
            nastav <code className="rounded bg-white px-1">ADMIN_SECRET</code>{" "}
            (min. 16 znaků) a restartuj server.
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 text-center text-sm font-semibold text-violet-700 underline"
        >
          ← Na úvod webu
        </Link>
      </div>
    );
  }

  const jar = await cookies();
  if (verifyAdminCookie(jar.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin");
  }

  const magicEnabled = adminEmailsConfigured();

  return (
    <div className="portal-shell mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-center text-2xl font-extrabold tracking-tight text-slate-900">
        Interní admin
      </h1>
      <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
        {magicEnabled
          ? "Přihlaste se e-mailem administrátora — pošleme vám bezpečný odkaz. Záložně lze použít tajný klíč z .env."
          : "Zadejte sdílené tajemství z prostředí serveru. Pro přihlášení e-mailem doplňte ADMIN_EMAILS v .env."}
      </p>
      <div className="portal-card mt-8 p-6 sm:p-8">
        <AdminLoginForm
          magicEnabled={magicEnabled}
          linkError={q.chyba === "odkaz"}
        />
      </div>
      <Link
        href="/"
        className="mt-8 text-center text-sm font-semibold text-slate-500 underline hover:text-violet-700"
      >
        Zavřít a zpět na web
      </Link>
    </div>
  );
}
