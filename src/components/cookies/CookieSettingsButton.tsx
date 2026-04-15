"use client";

import type { ReactNode } from "react";
import { COOKIE_SETTINGS_OPEN_EVENT } from "@/lib/cookie-consent";

type Props = {
  className?: string;
  children?: ReactNode;
};

export function CookieSettingsButton({
  className = "text-sm font-bold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900",
  children = "Nastavení cookies",
}: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT));
      }}
    >
      {children}
    </button>
  );
}
