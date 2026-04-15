import { listCourseRuns } from "@/lib/course-runs-store";
import {
  isRegistrationsJsonlWritable,
  listRegistrationsMerged,
} from "@/lib/registrations-store";
import { AdminRegistrationsClient } from "@/components/admin/AdminRegistrationsClient";
import type { RegistrationRecord } from "@/types/registration";

export const dynamic = "force-dynamic";

function registrationsLast7DaysCount(items: RegistrationRecord[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return items.filter((r) => {
    if (!r.receivedAt) return false;
    return new Date(r.receivedAt).getTime() >= cutoff;
  }).length;
}

export default async function AdminDashboardPage() {
  const items = await listRegistrationsMerged();
  const courseRuns = await listCourseRuns();
  const writable = isRegistrationsJsonlWritable();
  const last7d = registrationsLast7DaysCount(items);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-slate-900">
        Přihlášky
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Přehled kontaktů, stavů plateb, poznámek a přiřazení ke skupinovému
        termínu. Úpravy se ukládají do lokálního souboru{" "}
        <code className="rounded bg-slate-200/80 px-1 text-xs">data/registrations.jsonl</code>
        .
      </p>
      <AdminRegistrationsClient
        initialItems={items}
        writable={writable}
        courseRuns={courseRuns}
        registrationsLast7d={last7d}
      />
    </div>
  );
}
