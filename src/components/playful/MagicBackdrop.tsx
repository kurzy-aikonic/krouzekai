/** Pohyblivé pozadí — čisté CSS, respektuje prefers-reduced-motion. */
export function MagicBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="magic-gradient-bg absolute inset-0" />
      <div className="magic-blob magic-blob--a absolute -left-20 top-20 h-72 w-72 rounded-full opacity-60 blur-3xl" />
      <div className="magic-blob magic-blob--b absolute -right-16 top-1/3 h-96 w-96 rounded-full opacity-50 blur-3xl" />
      <div className="magic-blob magic-blob--c absolute bottom-0 left-1/3 h-80 w-80 -translate-x-1/2 rounded-full opacity-45 blur-3xl" />
      <svg
        className="magic-stars absolute inset-0 h-full w-full opacity-[0.35]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="star-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="20" r="1.2" className="fill-[var(--magic-sun)]" />
            <circle cx="45" cy="8" r="0.8" className="fill-white" />
            <circle cx="70" cy="55" r="1" className="fill-[var(--magic-pink)]" />
            <circle cx="25" cy="65" r="0.7" className="fill-[var(--magic-mint)]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#star-grid)" />
      </svg>
    </div>
  );
}
