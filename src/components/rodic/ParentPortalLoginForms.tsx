"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  linkError: boolean;
};

export function ParentPortalLoginForms({ linkError }: Props) {
  const router = useRouter();
  const [magicEmail, setMagicEmail] = useState("");
  const [magicMsg, setMagicMsg] = useState<string | null>(null);
  const [magicErr, setMagicErr] = useState<string | null>(null);
  const [magicPending, setMagicPending] = useState(false);

  const [logEmail, setLogEmail] = useState("");
  const [logPass, setLogPass] = useState("");
  const [logErr, setLogErr] = useState<string | null>(null);
  const [logPending, setLogPending] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPass2, setRegPass2] = useState("");
  const [regErr, setRegErr] = useState<string | null>(null);
  const [regPending, setRegPending] = useState(false);

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault();
    setMagicErr(null);
    setMagicMsg(null);
    setMagicPending(true);
    try {
      const res = await fetch("/api/rodic/auth/magic-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: magicEmail }),
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
      setMagicErr("Síťová chyba.");
    } finally {
      setMagicPending(false);
    }
  }

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setLogErr(null);
    setLogPending(true);
    try {
      const res = await fetch("/api/rodic/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: logEmail, password: logPass }),
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
        setLogErr(msg);
        return;
      }
      router.push("/rodic");
      router.refresh();
    } catch {
      setLogErr("Síťová chyba.");
    } finally {
      setLogPending(false);
    }
  }

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegErr(null);
    if (regPass !== regPass2) {
      setRegErr("Hesla se neshodují.");
      return;
    }
    setRegPending(true);
    try {
      const res = await fetch("/api/rodic/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPass }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : "Registrace se nezdařila.";
        setRegErr(msg);
        return;
      }
      router.push("/rodic");
      router.refresh();
    } catch {
      setRegErr("Síťová chyba.");
    } finally {
      setRegPending(false);
    }
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {linkError ? (
        <p className="alert-error" role="alert">
          Odkaz z e-mailu vypršel nebo je neplatný. Požádejte o nový níže.
        </p>
      ) : null}

      <section className="portal-card border-violet-100 p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-violet-600">
          Krok 1 — doporučeno
        </p>
        <h2 className="mt-1 font-display text-lg font-extrabold text-violet-950 sm:text-xl">
          Přihlášení bez hesla
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Pošleme vám <strong>jednorázový odkaz</strong> na tento e-mail (musí
          souhlasit s přihláškou, kterou jste už u nás poslali).
        </p>
        <form onSubmit={sendMagic} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="rodic-magic-email"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              E-mail z přihlášky
            </label>
            <input
              id="rodic-magic-email"
              type="email"
              required
              value={magicEmail}
              onChange={(e) => setMagicEmail(e.target.value)}
              autoComplete="email"
              placeholder="např. vase.jmeno@email.cz"
              className="input-portal mt-1.5"
            />
          </div>
          <div aria-live="polite">
            {magicErr ? (
              <p className="alert-error" role="alert">
                {magicErr}
              </p>
            ) : null}
            {magicMsg ? <p className="alert-success">{magicMsg}</p> : null}
          </div>
          <button
            type="submit"
            disabled={magicPending}
            className="btn-portal-primary"
          >
            {magicPending ? "Odesílám…" : "Poslat odkaz na e-mail"}
          </button>
        </form>
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-3 text-xs leading-relaxed text-slate-600">
          <p className="font-semibold text-slate-800">Nedorazilo nic do schránky?</p>
          <p className="mt-1">
            Zkontrolujte spam a reklamní složky. Odkaz v e-mailu brzy vyprší — v
            případě potřeby můžete odeslat žádost znovu za chvíli (server omezuje
            opakované pokusy). Pokud u nás na tento e-mail nemáte odeslanou
            přihlášku na kurz, z bezpečnostních důvodů žádný e-mail neposíláme.
          </p>
        </div>
      </section>

      <section className="portal-card p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          Krok 2 — volitelně
        </p>
        <h2 className="mt-1 font-display text-lg font-extrabold text-slate-900 sm:text-xl">
          Účet s heslem
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Stejný e-mail jako u přihlášky na kurz. Heslo si zvolíte při registraci
          účtu — příště se přihlásíte jedním kliknutím.
        </p>

        <h3 className="mt-8 border-t border-slate-100 pt-6 text-xs font-bold uppercase tracking-wide text-slate-500">
          Přihlášení heslem
        </h3>
        <form onSubmit={doLogin} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="rodic-log-email"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              E-mail
            </label>
            <input
              id="rodic-log-email"
              type="email"
              required
              value={logEmail}
              onChange={(e) => setLogEmail(e.target.value)}
              autoComplete="email"
              className="input-portal mt-1.5"
            />
          </div>
          <div>
            <label
              htmlFor="rodic-log-pass"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Heslo
            </label>
            <input
              id="rodic-log-pass"
              type="password"
              required
              value={logPass}
              onChange={(e) => setLogPass(e.target.value)}
              autoComplete="current-password"
              className="input-portal mt-1.5"
            />
          </div>
          {logErr ? (
            <p className="alert-error" role="alert">
              {logErr}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={logPending}
            className="btn-portal-outline"
          >
            {logPending ? "Ověřuji…" : "Přihlásit"}
          </button>
        </form>

        <h3 className="mt-10 text-xs font-bold uppercase tracking-wide text-slate-500">
          Nový účet
        </h3>
        <form onSubmit={doRegister} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="rodic-reg-email"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              E-mail z přihlášky
            </label>
            <input
              id="rodic-reg-email"
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              autoComplete="email"
              className="input-portal mt-1.5"
            />
          </div>
          <div>
            <label
              htmlFor="rodic-reg-pass"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Heslo (min. 8 znaků)
            </label>
            <input
              id="rodic-reg-pass"
              type="password"
              required
              minLength={8}
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              autoComplete="new-password"
              className="input-portal mt-1.5"
            />
          </div>
          <div>
            <label
              htmlFor="rodic-reg-pass2"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Heslo znovu
            </label>
            <input
              id="rodic-reg-pass2"
              type="password"
              required
              minLength={8}
              value={regPass2}
              onChange={(e) => setRegPass2(e.target.value)}
              autoComplete="new-password"
              className="input-portal mt-1.5"
            />
          </div>
          {regErr ? (
            <p className="alert-error" role="alert">
              {regErr}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={regPending}
            className="btn-portal-dark"
          >
            {regPending ? "Vytvářím účet…" : "Zaregistrovat účet"}
          </button>
        </form>
      </section>
    </div>
  );
}
