import Link from "next/link";
import { AdminEmailToolsClient } from "@/components/admin/AdminEmailToolsClient";

export default function AdminNastrojePage() {
  return (
    <div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
      >
        ← Zpět na přihlášky
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
        Nástroje
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Pomůcky pro provoz — bez vlivu na data přihlášek (kromě záměrných akcí na
        stránce přihlášek).
      </p>
      <div className="mt-8 max-w-2xl">
        <AdminEmailToolsClient />
      </div>
    </div>
  );
}
