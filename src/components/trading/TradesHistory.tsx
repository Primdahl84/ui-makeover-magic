import type { Trade } from "@/types/trading";
import { formatCurrency, formatPnl, formatDate, pnlColorClass } from "@/lib/trading-utils";

interface TradesHistoryProps {
  trades: Trade[];
}

function ActionBadge({ action }: { action: string }) {
  const u = (action || "HOLD").toUpperCase();
  const styles = {
    BUY: "bg-positive/15 text-positive",
    SELL: "bg-negative/15 text-negative",
  };
  return (
    <span className={`inline-block px-2.5 py-px rounded-full text-[0.68rem] font-bold tracking-wide ${styles[u as keyof typeof styles] || ""}`}>
      {u}
    </span>
  );
}

export function TradesHistory({ trades }: TradesHistoryProps) {
  if (!trades.length) {
    return <div className="text-muted-foreground text-center py-10 text-[0.85rem]">No trades yet</div>;
  }

  const sorted = [...trades].reverse();

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Date", "Ticker", "Action", "Qty", "Price", "Realized P&L"].map((h) => (
              <th key={h} className="text-left p-2 px-3 text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => (
            <tr key={t.order_id || i} className="border-b border-background hover:bg-muted/30 transition-colors">
              <td className="p-2.5 px-3 text-secondary-foreground text-[0.82rem]">{formatDate(t.timestamp)}</td>
              <td className="p-2.5 px-3 font-bold text-foreground">{t.ticker}</td>
              <td className="p-2.5 px-3"><ActionBadge action={t.action} /></td>
              <td className="p-2.5 px-3 mono text-info">{t.qty}</td>
              <td className="p-2.5 px-3 mono text-[0.82rem]">{formatCurrency(t.price)}</td>
              <td className={`p-2.5 px-3 mono text-[0.82rem] ${
                t.realized_pnl !== null && t.realized_pnl !== undefined
                  ? pnlColorClass(t.realized_pnl)
                  : "text-muted-foreground"
              }`}>
                {t.realized_pnl !== null && t.realized_pnl !== undefined ? formatPnl(t.realized_pnl) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
