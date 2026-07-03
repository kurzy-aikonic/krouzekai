"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  magicEnabled: boolean;
  linkError: boolean;
};

export function AdminLoginForm({ magicEnabled, linkError }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [magicMsg, setMagicMsg] = useState<string | null>(null);
  const [magicErr, setMagicErr] = useState<string | null>(null);
  const [magicPending, setMagicPending] = useState(false);

  const [secret, setSecret] = useState("");
  const [secretErr, setSecretErr] = useState<string | null>(null);
  const [secretPending, setSecretPending] = useState(false);

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault();
    setMagicErr(null);
    setMagicMsg(null);
    setMagicPending(true);
    try {
      const res = await fetch("/api/admin/magic-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
        setMagicErr(msg);
        return;
      }
      const msg =
        typeof data === "object" &&
        data &&
        "message" in data &&
        typeof (data as { message?: string }).message === "string"
          ? (data as { message: string }).message
          : "Zkontrolujte e-mail.";
      setMagicMsg(msg);
    } catch {
      setMagicErr("Síťová chyba. Zkuste znovu.");
    } finally {
      setMagicPending(false);
    }
  }

  async function loginWithSecret(e: React.FormEvent) {
    e.preventDefault();
    setSecretErr(null);
    setSecretPending(true);
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
        setSecretErr(msg);
        setSecretPending(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setSecretErr("Síťová chyba. Zkuste znovu.");
      setSecretPending(false);
    }
  }

  return (
    <div className="space-y-8">
      {linkError ? (
        <p className="alert-error" role="alert">
          Odkaz vypršel nebo není platný. Požádejte o nový.
        </p>
      ) : null}

      {magicEnabled ? (
        <form onSubmit={sendMagic} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              E-mail administrátora
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-portal mt-1.5"
              placeholder="vas@email.cz"
            />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Pošleme jednorázový přihlašovací odkaz na váš e-mail.
            </p>
          </div>
          {magicErr ? (
            <p className="alert-error" role="alert">
              {magicErr}
            </p>
          ) : null}
          {magicMsg ? (
            <p className="alert-success" role="status">
              {magicMsg}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={magicPending}
            className="btn-portal-primary"
          >
            {magicPending ? "Odesílám odkaz…" : "Poslat přihlašovací odkaz"}
          </button>
        </form>
      ) : null}

      <div className={magicEnabled ? "border-t border-slate-200 pt-6" : ""}>
        {magicEnabled ? (
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
            Záložní přístup klíčem
          </p>
        ) : null}
        <form onSubmit={loginWithSecret} className="space-y-4">
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
              required={!magicEnabled}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="input-portal mt-1.5"
              placeholder="Tajný klíč"
            />
          </div>
          {secretErr ? (
            <p className="alert-error" role="alert">
              {secretErr}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={secretPending}
            className={magicEnabled ? "btn-portal-outline" : "btn-portal-primary"}
          >
            {secretPending ? "Ověřuji…" : "Přihlásit klíčem"}
          </button>
        </form>
      </div>
    </div>
  );
}
