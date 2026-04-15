import { NextResponse } from "next/server";
import { listOfferedCourseRuns } from "@/lib/course-runs-store";

export const dynamic = "force-dynamic";

/** Veřejný seznam termínů pro registraci (skupina + individuální sloty). */
export async function GET() {
  const runs = await listOfferedCourseRuns();
  return NextResponse.json({ ok: true, runs });
}
