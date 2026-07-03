import { Suspense } from "react";
import { AdminDashboardSummary } from "@/components/admin/AdminDashboardSummary";
import { AdminRegistrationsClient } from "@/components/admin/AdminRegistrationsClient";
import { computeAdminDashboardStats } from "@/lib/admin-dashboard-stats";
import { listCourseRuns } from "@/lib/course-runs-store";
import {
  isRegistrationsJsonlWritable,
  listRegistrationsMerged,
} from "@/lib/registrations-store";
import type { RegistrationRecord, RegistrationStatus } from "@/types/registration";
import { registrationStatuses } from "@/types/registration";

export const dynamic = "force-dynamic";

function registrationsLast7DaysCount(items: RegistrationRecord[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return items.filter((r) => {
    if (!r.receivedAt) return false;
    return new Date(r.receivedAt).getTime() >= cutoff;
  }).length;
}

function parseInitialStatus(
  raw: string | undefined,
): RegistrationStatus | "vse" {
  if (!raw) return "vse";
  return registrationStatuses.includes(raw as RegistrationStatus)
    ? (raw as RegistrationStatus)
    : "vse";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    format?: string;
    run?: string;
    from?: string;
    to?: string;
    q?: string;
    view?: string;
  }>;
}) {
  const q = await searchParams;
  const items = await listRegistrationsMerged();
  const courseRuns = await listCourseRuns();
  const writable = isRegistrationsJsonlWritable();
  const last7d = registrationsLast7DaysCount(items);
  const stats = computeAdminDashboardStats(items, courseRuns, last7d);
  const initialStatusFilter = parseInitialStatus(q.status);
  const initialAwaitingPayment = q.view === "ceka_platbu";

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-slate-900">
        Přihlášky
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Přehled kontaktů, stavů plateb, poznámek a přiřazení ke skupinovému
        termínu.
      </p>
      <div className="mt-6">
        <AdminDashboardSummary stats={stats} />
      </div>
      <Suspense fallback={<p className="mt-8 text-sm text-slate-500">Načítám filtry…</p>}>
        <AdminRegistrationsClient
          initialItems={items}
          writable={writable}
          courseRuns={courseRuns}
          initialStatusFilter={initialStatusFilter}
          initialFormat={q.format === "skupina" || q.format === "individual" ? q.format : "vse"}
          initialRunFilter={q.run ?? "vse"}
          initialDateFrom={q.from ?? ""}
          initialDateTo={q.to ?? ""}
          initialQuery={q.q ?? ""}
          initialAwaitingPayment={initialAwaitingPayment}
        />
      </Suspense>
    </div>
  );
}
