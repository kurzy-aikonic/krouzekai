"use client";

import { useEffect, useRef } from "react";
import { analyticsConsentGranted } from "@/lib/cookie-consent";
import { trackRegistrationLead } from "@/lib/ga-events";

type Props = {
  registrationCode: string;
  format: "skupina" | "individual";
  amountCzk: number | null;
};

/**
 * Odešle GA4 událost `generate_lead` po úspěšné registraci.
 * Respektuje souhlas s analytikou a v relaci nepočítá stejnou přihlášku dvakrát.
 */
export function RegistrationLeadEvent({
  registrationCode,
  format,
  amountCzk,
}: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (!registrationCode.trim()) return;

    const tryFire = () => {
      if (fired.current) return;
      if (!analyticsConsentGranted()) return;
      if (trackRegistrationLead({ registrationCode, format, amountCzk })) {
        fired.current = true;
      }
    };

    tryFire();
    window.addEventListener("krouzek-cookie-consent", tryFire);
    return () => window.removeEventListener("krouzek-cookie-consent", tryFire);
  }, [registrationCode, format, amountCzk]);

  return null;
}
