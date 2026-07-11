/** Pohyblivé pozadí — čisté CSS, respektuje prefers-reduced-motion. */
export function MagicBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict] [transform:translateZ(0)]"
      aria-hidden
    >
      <div className="magic-gradient-bg absolute inset-0" />
      <div className="magic-blob magic-blob--a absolute -left-20 top-20 h-48 w-48 rounded-full opacity-20 blur-2xl sm:h-64 sm:w-64 sm:opacity-20 sm:blur-3xl" />
      <div className="magic-blob magic-blob--b absolute -right-16 top-1/3 h-56 w-56 rounded-full opacity-16 blur-2xl sm:h-72 sm:w-72 sm:opacity-16 sm:blur-3xl" />
    </div>
  );
}
