import Link from "next/link";
import type { AdminDashboardStats } from "@/lib/admin-dashboard-stats";

type Props = {
  stats: AdminDashboardStats;
};

export function AdminDashboardSummary({ stats }: Props) {
  const hasAlerts =
    stats.novaCount > 0 ||
    stats.fullRuns.length > 0 ||
    stats.orphanCount > 0 ||
    stats.awaitingPaymentCount > 0 ||
    stats.duplicateGroups.length > 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Link
          href="/admin?status=nova"
          className="portal-card block p-4 transition hover:border-violet-300 hover:bg-violet-50/40"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Nové k vyřízení
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-violet-800">
            {stats.novaCount}
          </p>
        </Link>
        <div className="portal-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Za posledních 7 dní
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">
            {stats.last7d}
          </p>
        </div>
        <Link
          href="/admin/course-runs"
          className="portal-card block p-4 transition hover:border-violet-300 hover:bg-violet-50/40"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Plné termíny
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-amber-800">
            {stats.fullRuns.length}
          </p>
        </Link>
        <Link
          href="/admin/course-runs"
          className="portal-card block p-4 transition hover:border-violet-300 hover:bg-violet-50/40"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Sirotčí přihlášky
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-slate-700">
            {stats.orphanCount}
          </p>
        </Link>
        <Link
          href="/admin?view=ceka_platbu"
          className="portal-card block p-4 transition hover:border-violet-300 hover:bg-violet-50/40"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Čeká na platbu
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-sky-800">
            {stats.awaitingPaymentCount}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            cca {stats.awaitingPaymentCzk.toLocaleString("cs-CZ")} Kč
          </p>
        </Link>
        <div className="portal-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Možné duplicity
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-orange-800">
            {stats.duplicateGroups.length}
          </p>
        </div>
      </div>

      {hasAlerts ? (
        <div className="portal-card space-y-4 p-4 sm:p-5">
          <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
            Vyžaduje pozornost
          </p>
          {stats.recentNova.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Nové přihlášky
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {stats.recentNova.map((r) => (
                  <li key={r.code}>
                    <Link
                      href={`/admin/registrations/${encodeURIComponent(r.code)}`}
                      className="font-semibold text-violet-800 underline decoration-violet-200 underline-offset-2 hover:text-violet-950"
                    >
                      {r.code}
                    </Link>
                    <span className="text-slate-600">
                      {" "}
                      — {r.childName}
                      {r.receivedAt
                        ? ` · ${new Date(r.receivedAt).toLocaleDateString("cs-CZ")}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {stats.fullRuns.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Plné termíny
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {stats.fullRuns.map((run) => (
                  <li key={run.id}>
                    <span className="font-medium">{run.label}</span>
                    <span className="text-xs text-slate-500"> ({run.format})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {stats.orphanCount > 0 ? (
            <p className="text-sm text-amber-900">
              {stats.orphanCount} přihlášek ukazuje na termín, který v seznamu
              není — opravte v{" "}
              <Link href="/admin/course-runs" className="font-bold underline">
                Termínech
              </Link>
              .
            </p>
          ) : null}
          {stats.duplicateGroups.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Stejný rodič + dítě (≥ 2×)
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {stats.duplicateGroups.slice(0, 5).map((g) => (
                  <li key={g.key} className="text-slate-700">
                    <span className="font-medium">{g.childName}</span>
                    <span className="text-slate-500"> · {g.parentEmail}</span>
                    <span className="text-xs text-slate-500">
                      {" "}
                      — kódy {g.codes.join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {stats.awaitingPaymentCount > 0 ? (
            <p className="text-sm text-sky-900">
              <Link href="/admin?view=ceka_platbu" className="font-bold underline">
                {stats.awaitingPaymentCount} přihlášek
              </Link>{" "}
              čeká na platbu (nová / kontaktováno).
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 text-xs">
        <Link href="/admin/course-runs" className="btn-portal-outline py-2 text-xs">
          Termíny
        </Link>
        <Link href="/admin/nastroje" className="btn-portal-outline py-2 text-xs">
          Nástroje
        </Link>
        <Link href="/registrace" className="btn-portal-ghost py-2 text-xs">
          Veřejná registrace ↗
        </Link>
      </div>
    </div>
  );
}
