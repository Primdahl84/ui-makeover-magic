export function formatCurrency(val: number | null | undefined, decimals = 2): string {
  if (val === null || val === undefined) return "—";
  return "$" + Math.abs(val).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPnl(val: number): string {
  const sign = val >= 0 ? "+" : "-";
  return sign + formatCurrency(val);
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatDKK(val: number): string {
  const sign = val >= 0 ? "+" : "-";
  return sign + " kr. " + Math.abs(val).toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function pnlColorClass(val: number): string {
  return val >= 0 ? "text-positive" : "text-negative";
}

export const MARKET_FLAGS: Record<string, string> = {
  US: "🇺🇸", EU: "🇪🇺", DK: "🇩🇰", JP: "🇯🇵", IN: "🇮🇳", TW: "🇹🇼", CA: "🇨🇦",
};
