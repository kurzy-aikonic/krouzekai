import Link from "next/link";
import { CourseRunsAdminClient } from "@/components/admin/CourseRunsAdminClient";
import { buildRunOccupancyMap } from "@/lib/course-run-registrations";
import {
  courseRunsPersistenceMode,
  listCourseRuns,
} from "@/lib/course-runs-store";
import { listRegistrationsMerged } from "@/lib/registrations-store";

export const dynamic = "force-dynamic";

export default async function AdminCourseRunsPage() {
  const runs = await listCourseRuns();
  const persistence = courseRunsPersistenceMode();
  const merged = await listRegistrationsMerged();
  const occupancyByRunId = buildRunOccupancyMap(merged);

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
      >
        ← Zpět na přihlášky
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
        Termíny — skupina a 1:1
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Skupinové běhy se nabízejí u přihlášky ve formátu skupina; individuální
        sloty u formátu 1:1. Výběr na webu je vždy volitelný — rodič může nechat
        domluvu na později.
      </p>
      <CourseRunsAdminClient
        initialRuns={runs}
        occupancyByRunId={occupancyByRunId}
        persistence={persistence}
      />
    </div>
  );
}
