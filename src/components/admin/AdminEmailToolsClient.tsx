"use client";

import { useState } from "react";
import { site } from "@/lib/site-config";

export function AdminEmailToolsClient() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function sendTest() {
    setMessage(null);
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(to.trim() ? { to: to.trim() } : {}),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : "Odeslání se nezdařilo.";
        setError(msg);
        return;
      }
      const addr =
        typeof data === "object" &&
        data &&
        "to" in data &&
        typeof (data as { to?: string }).to === "string"
          ? (data as { to: string }).to
          : site.contactEmail;
      setMessage(`Test odeslán na ${addr}.`);
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="portal-card space-y-4 p-5 sm:p-6">
      <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
        Test e-mailu (Resend)
      </h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Ověříte, že jsou na serveru nastavené{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">RESEND_API_KEY</code> a{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">RESEND_FROM_EMAIL</code>.
        Bez vyplnění adresy se použije první z{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">RESEND_INTERNAL_TO</code>{" "}
        nebo kontaktní e-mail webu.
      </p>
      <div>
        <label
          htmlFor="admin-test-email-to"
          className="text-xs font-bold uppercase tracking-wide text-slate-500"
        >
          Cílová adresa (volitelné)
        </label>
        <input
          id="admin-test-email-to"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={`výchozí: ${site.contactEmail}`}
          className="input-portal mt-1.5 max-w-md"
          autoComplete="off"
        />
      </div>
      {error ? (
        <p className="alert-error" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="alert-success">{message}</p> : null}
      <button
        type="button"
        disabled={pending}
        onClick={() => void sendTest()}
        className="btn-portal-primary max-w-xs"
      >
        {pending ? "Odesílám…" : "Odeslat test"}
      </button>
    </div>
  );
}
