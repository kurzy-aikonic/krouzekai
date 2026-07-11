import Link from "next/link";
import { notFound } from "next/navigation";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { listCourseRuns } from "@/lib/course-runs-store";
import {
  findRegistrationInList,
  isRegistrationsJsonlWritable,
  listRegistrationsMerged,
} from "@/lib/registrations-store";
import { AdminRegistrationDetailForm } from "@/components/admin/AdminRegistrationDetailForm";
import { AdminRegistrationActivity } from "@/components/admin/AdminRegistrationActivity";
import { RegistrationTechnicalId } from "@/components/admin/RegistrationTechnicalId";
import { findParentAccountByEmail } from "@/lib/parent-accounts-store";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminRegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [allItems, courseRuns] = await Promise.all([
    listRegistrationsMerged(),
    listCourseRuns(),
  ]);
  const record = findRegistrationInList(allItems, id);
  if (!record) notFound();

  const writable = isRegistrationsJsonlWritable();
  const occupancyByRunId: Record<string, number> = {};
  for (const run of courseRuns) {
    occupancyByRunId[run.id] = countedOccupancyForRun(
      run.id,
      run.format,
      allItems,
    );
  }

  const parentAccount = await findParentAccountByEmail(record.parentEmail);

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
      >
        ← Zpět na seznam
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
        Přihláška
      </h1>
      <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-slate-900">
        {getPublicRegistrationCode(record)}
      </p>
      <RegistrationTechnicalId recordId={record.id} />
      <AdminRegistrationDetailForm
        key={`${getPublicRegistrationCode(record)}-${record.updatedAt ?? ""}-${record.status}-${record.runId ?? ""}`}
        record={record}
        writable={writable}
        courseRuns={courseRuns}
        occupancyByRunId={occupancyByRunId}
        parentHasAccount={parentAccount != null}
      />
      <div className="mt-8">
        <AdminRegistrationActivity
          adminHistory={record.adminHistory}
          emailLog={record.emailLog}
        />
      </div>
    </div>
  );
}
