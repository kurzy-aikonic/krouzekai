import { NextResponse } from "next/server";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  courseRunsPutSchema,
  listCourseRuns,
  replaceCourseRuns,
} from "@/lib/course-runs-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: "ADMIN_SECRET není nastaven." },
      { status: 503 },
    );
  }
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  const runs = await listCourseRuns();
  return NextResponse.json({ ok: true, runs });
}

export async function PUT(request: Request) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: "ADMIN_SECRET není nastaven." },
      { status: 503 },
    );
  }
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = courseRunsPutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Neplatná data.",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    await replaceCourseRuns(parsed.data.runs);
    return NextResponse.json({ ok: true, runs: parsed.data.runs });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Nepodařilo se uložit termíny." },
      { status: 500 },
    );
  }
}
