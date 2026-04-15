import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { listCourseRuns } from "@/lib/course-runs-store";
import {
  findRegistrationById,
  isRegistrationsJsonlWritable,
} from "@/lib/registrations-store";
import { AdminRegistrationDetailForm } from "@/components/admin/AdminRegistrationDetailForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminRegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const record = await findRegistrationById(id);
  if (!record) notFound();

  const writable = isRegistrationsJsonlWritable();
  const courseRuns = await listCourseRuns();

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
      <p className="mt-1 font-mono text-xs text-slate-500">
        Technické ID: {record.id}
      </p>
      <AdminRegistrationDetailForm
        key={`${getPublicRegistrationCode(record)}-${record.updatedAt ?? ""}-${record.status}-${record.runId ?? ""}`}
        record={record}
        writable={writable}
        courseRuns={courseRuns}
      />
    </div>
  );
}
