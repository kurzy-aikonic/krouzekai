/** Pohyblivé pozadí — čisté CSS, respektuje prefers-reduced-motion. */
export function MagicBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict] [transform:translateZ(0)]"
      aria-hidden
    >
      <div className="magic-gradient-bg absolute inset-0" />
    </div>
  );
}
