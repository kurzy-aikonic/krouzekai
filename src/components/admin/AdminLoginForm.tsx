"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const secret = String(fd.get("secret") ?? "");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : "Přihlášení se nezdařilo.";
        setError(msg);
        setPending(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Síťová chyba. Zkuste znovu.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="admin-secret"
          className="block text-xs font-bold uppercase tracking-wide text-slate-500"
        >
          Tajný klíč
        </label>
        <input
          id="admin-secret"
          name="secret"
          type="password"
          autoComplete="off"
          required
          className="input-portal mt-1.5"
          placeholder="ADMIN_SECRET z .env"
        />
      </div>
      {error ? (
        <p className="alert-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="btn-portal-primary"
      >
        {pending ? "Ověřuji…" : "Přihlásit"}
      </button>
    </form>
  );
}
