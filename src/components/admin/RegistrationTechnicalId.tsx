"use client";

import { useState } from "react";

type Props = {
  recordId: string;
};

export function RegistrationTechnicalId({ recordId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-bold text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
      >
        {open ? "Skrýt pokročilé" : "Pokročilé — interní identifikátor"}
      </button>
      {open ? (
        <p className="mt-2 break-all font-mono text-xs text-slate-500">
          {recordId}
        </p>
      ) : null}
    </div>
  );
}
