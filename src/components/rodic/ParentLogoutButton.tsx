"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ParentLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/rodic/auth/logout", { method: "POST" });
      router.push("/rodic/prihlaseni");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={pending}
      className="btn-portal-ghost text-sm"
    >
      {pending ? "…" : "Odhlásit"}
    </button>
  );
}
