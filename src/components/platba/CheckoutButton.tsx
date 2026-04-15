"use client";

import { useState } from "react";

type Props = {
  registrationId: string;
};

export function CheckoutButton({ registrationId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/platba/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.status === 429) {
        setError(
          data.error ??
            "Příliš mnoho pokusů o platbu. Zkuste to za chvíli znovu.",
        );
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Platbu se nepodařilo zahájit.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Chyba spojení. Zkuste to znovu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="btn-magic w-full sm:w-auto disabled:translate-y-0 disabled:opacity-60"
      >
        {loading ? "Otevírám platbu…" : "Zaplatit online ✨"}
      </button>
      {error ? (
        <p className="rounded-2xl border-2 border-amber-400 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
          {error}
        </p>
      ) : null}
    </div>
  );
}
