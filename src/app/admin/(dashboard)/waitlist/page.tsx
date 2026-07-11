import Link from "next/link";
import { AdminWaitlistClient } from "@/components/admin/AdminWaitlistClient";
import { listWaitlistEntries } from "@/lib/waitlist-store";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  const items = await listWaitlistEntries();

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
      >
        ← Zpět na přihlášky
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
        Čekací listina
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Zájemci, kteří narazili na plný termín. Až se uvolní místo nebo otevřete
        nový termín stejného formátu, ozvěte se jim a záznam si oznámkujte.
      </p>
      <AdminWaitlistClient initialItems={items} />
    </div>
  );
}
