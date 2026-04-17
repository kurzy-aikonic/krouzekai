import { apiJson } from "@/lib/api-response";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Veřejný seznam termínů pro registraci (skupina + individuální sloty). */
export async function GET(request: Request) {
  const limited = await rateLimitResponse(request, "courseRunsPublic");
  if (limited) return limited;

  const runs = await listOfferedCourseRuns();
  return apiJson({ ok: true, runs });
}
