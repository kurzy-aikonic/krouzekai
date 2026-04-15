import { NextResponse } from "next/server";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  courseRunsPersistenceMode,
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
  return NextResponse.json({
    ok: true,
    runs,
    storage: courseRunsPersistenceMode(),
  });
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
    return NextResponse.json({
      ok: true,
      runs: parsed.data.runs,
      storage: courseRunsPersistenceMode(),
    });
  } catch (e) {
    console.error(e);
    const err = e as NodeJS.ErrnoException & { message?: string };
    const readOnly =
      err.code === "EROFS" ||
      err.code === "ENOTSUP" ||
      err.code === "EACCES" ||
      (typeof err.message === "string" &&
        err.message.toLowerCase().includes("read-only"));
    return NextResponse.json(
      {
        error: "Nepodařilo se uložit termíny.",
        hint: readOnly
          ? "Na Vercelu nejde zapisovat do souboru. Máte-li Supabase: spusťte SQL z web/supabase-course-runs.sql a používejte SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Bez Supabase lze použít Upstash (UPSTASH_REDIS_*)."
          : undefined,
      },
      { status: 500 },
    );
  }
}
