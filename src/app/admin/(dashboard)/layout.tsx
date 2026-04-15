import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  adminSecretConfigured,
  verifyAdminCookie,
} from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!adminSecretConfigured()) {
    return (
      <div className="portal-shell px-4 py-16 text-slate-800">
        <div className="portal-card mx-auto max-w-lg border-amber-200 bg-amber-50/95 p-6 text-sm leading-relaxed">
          <p className="font-bold text-amber-900">Admin není aktivní</p>
          <p className="mt-2">
            Do souboru <code className="rounded bg-white px-1">web/.env</code>{" "}
            doplň proměnnou{" "}
            <code className="rounded bg-white px-1">ADMIN_SECRET</code> (min.
            16 znaků), restartuj dev server a otevři znovu{" "}
            <Link className="font-bold text-violet-700 underline" href="/admin/login">
              přihlášení
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const jar = await cookies();
  if (!verifyAdminCookie(jar.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div className="portal-shell text-slate-900">
      <header className="portal-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-display text-sm font-extrabold tracking-tight text-violet-800"
            >
              Kroužek — admin
            </Link>
            <nav
              className="flex flex-wrap gap-1 text-xs font-medium text-slate-600 sm:text-sm"
              aria-label="Admin navigace"
            >
              <Link
                href="/admin"
                className="rounded-lg px-2 py-1.5 hover:bg-violet-50 hover:text-violet-800"
              >
                Přihlášky
              </Link>
              <Link
                href="/admin/course-runs"
                className="rounded-lg px-2 py-1.5 hover:bg-violet-50 hover:text-violet-800"
              >
                Termíny
              </Link>
              <Link
                href="/admin/nastroje"
                className="rounded-lg px-2 py-1.5 hover:bg-violet-50 hover:text-violet-800"
              >
                Nástroje
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
