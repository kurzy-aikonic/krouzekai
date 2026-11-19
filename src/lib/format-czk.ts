/** Částka v Kč se stejnou mezerou na serveru i v prohlížeči (bez toLocaleString). */
export function formatCzk(amount: number): string {
  const rounded = Math.round(amount);
  const negative = rounded < 0;
  const digits = String(Math.abs(rounded));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${negative ? "−" : ""}${grouped}\u00a0Kč`;
}
