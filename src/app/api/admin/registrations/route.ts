import { NextResponse } from "next/server";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  isRegistrationsJsonlWritable,
  listRegistrationsMerged,
} from "@/lib/registrations-store";

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

  const items = await listRegistrationsMerged();
  return NextResponse.json({
    ok: true,
    writable: isRegistrationsJsonlWritable(),
    items,
  });
}
