import { NextResponse } from "next/server";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";

export const dynamic = "force-dynamic";

/** Veřejný seznam skupinových termínů pro registraci. */
export async function GET() {
  const runs = await listOfferedCourseRuns();
  return NextResponse.json({ ok: true, runs });
}
