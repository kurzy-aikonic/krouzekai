"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COOKIE_SETTINGS_OPEN_EVENT,
  hasCookieDecision,
  readCookiePreferences,
  saveAcceptAll,
  saveCookiePreferences,
  saveEssentialOnly,
} from "@/lib/cookie-consent";

type Step = "choice" | "details";

export function CookieConsentRoot() {
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? !hasCookieDecision() : false,
  );
  const [step, setStep] = useState<Step>("choice");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      const p = readCookiePreferences();
      setAnalytics(p?.analytics ?? false);
      setMarketing(p?.marketing ?? false);
      setStep("details");
      setVisible(true);
    };
    const onConsent = () => {
      setVisible(false);
      setStep("choice");
    };
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpen);
    window.addEventListener("krouzek-cookie-consent", onConsent);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpen);
      window.removeEventListener("krouzek-cookie-consent", onConsent);
    };
  }, []);

  function goDetails() {
    const p = readCookiePreferences();
    setAnalytics(p?.analytics ?? false);
    setMarketing(p?.marketing ?? false);
    setStep("details");
  }

  function closeWithoutSave() {
    if (hasCookieDecision()) {
      setVisible(false);
      setStep("choice");
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && hasCookieDecision()) {
          closeWithoutSave();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby={
          step === "choice"
            ? "cookie-consent-summary"
            : "cookie-consent-details"
        }
        className="max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom)))] w-full max-w-lg overflow-y-auto rounded-t-3xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-b from-[#fefce8] via-white to-[#f5f3ff] shadow-[0_-8px_0_#312e81] sm:rounded-3xl sm:shadow-[8px_8px_0_#312e81]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <h2
            id="cookie-consent-title"
            className="font-display text-xl font-extrabold text-[var(--magic-ink)] sm:text-2xl"
          >
            {step === "choice" ? "Nastavení cookies" : "Podrobné předvolby"}
          </h2>

          {step === "choice" ? (
            <>
              <p
                id="cookie-consent-summary"
                className="mt-3 text-sm leading-relaxed text-slate-800"
              >
                Používáme cookies a úložiště prohlížeče v souladu s nařízením EU
                o soukromí v elektronických komunikacích a s GDPR.{" "}
                <strong>Nezbytné</strong> technologie jsou nutné k provozu webu
                (včetně zapamatování této volby a doby jejího udělení).{" "}
                <strong>Analytiku a marketing</strong> zapneme jen s vaším
                výslovným souhlasem; souhlas můžete kdykoli odvolat v{" "}
                <button
                  type="button"
                  className="font-bold text-violet-700 underline decoration-2 underline-offset-2 hover:text-violet-900"
                  onClick={goDetails}
                >
                  podrobném nastavení
                </button>{" "}
                nebo přes odkaz <strong>Nastavení cookies</strong> v patičce.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Správce osobních údajů a účely zpracování:{" "}
                <Link
                  href="/ochrana-osobnich-udaju"
                  className="font-bold text-violet-700 underline underline-offset-2"
                >
                  informace pro subjekty údajů
                </Link>
                . Kompletní seznam technologií:{" "}
                <Link
                  href="/cookies"
                  className="font-bold text-violet-700 underline underline-offset-2"
                >
                  zásady cookies
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <p
                id="cookie-consent-details"
                className="mt-3 text-sm leading-relaxed text-slate-800"
              >
                Zvolte volitelné kategorie. Souhlas je dobrovolný, informace musí
                být přehledné (čl. 7 GDPR). Odvolání je možné kdykoli stejným
                rozhraním jako udělení souhlasu.
              </p>
              <div className="mt-5 space-y-4 rounded-2xl border-2 border-violet-200 bg-white/90 p-4">
                <label className="flex cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-[var(--magic-ink)] text-violet-600"
                  />
                  <span>
                    <span className="font-display font-bold text-slate-900">
                      Analytické cookies / měření
                    </span>
                    <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-600">
                      Např. Google Analytics (Google Ireland / Google LLC) —
                      agregované statistiky návštěvnosti. Právní základ po
                      zapnutí: <strong>souhlas</strong> (čl. 6 odst. 1 písm. a)
                      GDPR. Bez zaškrtnutí se tyto skripty nenačítají.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-[var(--magic-ink)] text-violet-600"
                  />
                  <span>
                    <span className="font-display font-bold text-slate-900">
                      Marketingové cookies
                    </span>
                    <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-600">
                      Personalizace reklamy, remarketing, affiliate měření u
                      třetích stran. Aktuálně na tomto webu <strong>není</strong>{" "}
                      žádný marketingový pixel nasazen; tato volba připravuje
                      budoucí rozšíření a musí zůstat vypnutá, dokud zásady
                      cookies neaktualizujeme a nenačteme odpovídající nástroj.
                    </span>
                  </span>
                </label>
              </div>
            </>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {step === "details" ? (
              <>
                <button
                  type="button"
                  className="font-display order-3 min-h-11 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-[2px_2px_0_#cbd5e1] hover:bg-slate-50 sm:order-1"
                  onClick={() => setStep("choice")}
                >
                  Zpět
                </button>
                {hasCookieDecision() ? (
                  <button
                    type="button"
                    className="font-display order-2 min-h-11 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 sm:order-2"
                    onClick={closeWithoutSave}
                  >
                    Zavřít beze změny
                  </button>
                ) : null}
                <button
                  type="button"
                  className="font-display order-4 min-h-11 rounded-xl border-[3px] border-[var(--magic-ink)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--magic-ink)] shadow-[3px_3px_0_#312e81] sm:order-3"
                  onClick={() => {
                    saveEssentialOnly();
                    setVisible(false);
                    setStep("choice");
                  }}
                >
                  Pouze nezbytné
                </button>
                <button
                  type="button"
                  className="font-display order-5 min-h-11 rounded-xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-r from-[var(--magic-grape)] to-[var(--magic-pink)] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#312e81] sm:order-5"
                  onClick={() => {
                    saveCookiePreferences({ analytics, marketing });
                    setVisible(false);
                    setStep("choice");
                  }}
                >
                  Uložit výběr
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="font-display min-h-11 flex-1 rounded-xl border-[3px] border-[var(--magic-ink)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--magic-ink)] shadow-[3px_3px_0_#312e81]"
                  onClick={() => {
                    saveEssentialOnly();
                    setVisible(false);
                  }}
                >
                  Odmítnout volitelné
                </button>
                <button
                  type="button"
                  className="font-display min-h-11 flex-1 rounded-xl border-2 border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-900"
                  onClick={goDetails}
                >
                  Přizpůsobit
                </button>
                <button
                  type="button"
                  className="font-display min-h-11 flex-1 rounded-xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-r from-[var(--magic-grape)] to-[var(--magic-pink)] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#312e81]"
                  onClick={() => {
                    saveAcceptAll();
                    setVisible(false);
                  }}
                >
                  Přijmout vše
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
