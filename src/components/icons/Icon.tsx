type IconName =
  | "calendar"
  | "shield"
  | "users"
  | "spark"
  | "gamepad"
  | "message"
  | "image"
  | "bot"
  | "lock"
  | "check"
  | "wallet"
  | "clock";

const paths: Record<IconName, string> = {
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  shield: "M12 3 5 6v6c0 5 3.2 7.6 7 9 3.8-1.4 7-4 7-9V6l-7-3z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  spark: "M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-5L6 9.4l4.4-1.6L12 3zM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z",
  gamepad:
    "M6 11h4M8 9v4M15 12h.01M18 10h.01M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1l-2-2h-4l-2 2H7a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4z",
  message: "M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0z",
  image: "M4 5h16v14H4zM4 15l4-4 3 3 3-4 6 5",
  bot: "M12 8V4M8 8h8a4 4 0 0 1 4 4v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a4 4 0 0 1 4-4zM9 13h.01M15 13h.01",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z",
  check: "M20 6 9 17l-5-5",
  wallet: "M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zm0 0V6a2 2 0 0 1 2-2h12M16 13h2",
  clock: "M12 8v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
};

export function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
