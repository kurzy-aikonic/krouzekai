import Link from "next/link";

type Props = {
  /** Tmavé záhlaví má bílý text, světlá patička ink webu. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Živý wordmark „kr○užek“. Kroužek nahrazuje písmeno o, na konci bliká kurzor.
 * Archivo je jen tady, přes proměnnou --font-logo. Barvy jsou oranžová tlačítka webu, ne červená z podkladu značky.
 */
export function Logo({ tone = "dark", className = "" }: Props) {
  return (
    <Link
      href="/"
      className={`logo logo-${tone} ${className}`}
      aria-label="Kroužek umělé inteligence"
    >
      <span className="logo-word" aria-hidden="true">
        kr
        <span className="logo-o" />
        užek
        <span className="logo-cursor" />
      </span>
      <span className="logo-sub" aria-hidden="true">
        umělé inteligence
      </span>
    </Link>
  );
}
