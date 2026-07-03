import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  adminSecretConfigured,
  getAdminSessionEmail,
  verifyAdminCookie,
} from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";

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
            Přístup administrace není nakonfigurovaný. Obraťte se na správce
            webu, nebo otevřete{" "}
            <Link className="font-bold text-violet-700 underline" href="/admin/login">
              přihlášení
            </Link>{" "}
            po dokončení nastavení.
          </p>
        </div>
      </div>
    );
  }

  const jar = await cookies();
  const sessionRaw = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminCookie(sessionRaw)) {
    redirect("/admin/login");
  }
  const sessionEmail = getAdminSessionEmail(sessionRaw);

  return (
    <div className="portal-shell text-slate-900">
      <header className="portal-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Link
              href="/admin"
              className="font-display shrink-0 text-sm font-extrabold tracking-tight text-violet-800"
            >
              Kroužek — admin
            </Link>
            <AdminNav />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
            {sessionEmail && sessionEmail !== "legacy" ? (
              <p className="max-w-[14rem] truncate text-[11px] font-medium text-slate-500 sm:max-w-xs sm:text-xs">
                {sessionEmail}
              </p>
            ) : null}
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
