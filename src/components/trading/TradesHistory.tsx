import type { Trade } from "@/types/trading";
import { formatCurrency, formatDate, pnlColorClass } from "@/lib/trading-utils";

interface TradesHistoryProps {
  trades: Trade[];
}

export function TradesHistory({ trades }: TradesHistoryProps) {
  if (!trades.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-3xl mb-3 opacity-30">📋</span>
        <p className="text-sm">No trades yet</p>
      </div>
    );
  }

  const sorted = [...trades].reverse();

  return (
    <div className="space-y-1 max-h-[600px] overflow-y-auto">
      {sorted.map((t, i) => (
        <div key={t.order_id || i} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-secondary/30 transition-colors">
          {/* Time */}
          <span className="mono text-[0.7rem] text-muted-foreground w-32 shrink-0">{formatDate(t.timestamp)}</span>

          {/* Action indicator */}
          <div className={`h-8 w-1 rounded-full shrink-0 ${t.action === "BUY" ? "bg-positive" : "bg-negative"}`} />

          {/* Ticker + action */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{t.ticker}</span>
              <span className={`text-[0.6rem] font-bold uppercase ${t.action === "BUY" ? "text-positive" : "text-negative"}`}>
                {t.action}
              </span>
            </div>
            <p className="text-[0.65rem] text-muted-foreground">
              {t.qty} × {formatCurrency(t.price)}
            </p>
          </div>

          {/* P&L */}
          <div className="text-right w-24">
            {t.realized_pnl !== null && t.realized_pnl !== undefined ? (
              <span className={`mono text-sm font-bold ${pnlColorClass(t.realized_pnl)}`}>
                {t.realized_pnl >= 0 ? "+" : ""}{formatCurrency(t.realized_pnl)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground/40">—</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
