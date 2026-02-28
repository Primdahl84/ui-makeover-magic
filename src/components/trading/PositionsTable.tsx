import type { Position } from "@/types/trading";
import { formatCurrency, pnlColorClass } from "@/lib/trading-utils";

interface PositionsTableProps {
  positions: Position[];
  onSell: (symbol: string) => void;
}

const MARKET_STYLES: Record<string, string> = {
  US: "bg-primary/10 text-primary",
  EU: "bg-info/10 text-info",
  DK: "bg-warning/10 text-warning",
  JP: "bg-negative/10 text-negative",
  IN: "bg-warning/10 text-warning",
  TW: "bg-primary/10 text-primary",
  CA: "bg-accent/10 text-accent",
};

export function PositionsTable({ positions, onSell }: PositionsTableProps) {
  if (!positions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-3xl mb-3 opacity-30">📊</span>
        <p className="text-sm">No open positions</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Ticker", "Qty", "Entry", "Current", "P&L", ""].map((h) => (
              <th key={h} className="text-left px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/30">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const plPct = p.unrealized_plpc * 100;
            const isUp = p.unrealized_pl >= 0;

            return (
              <tr key={p.symbol} className="group hover:bg-secondary/30 transition-colors">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{p.symbol}</span>
                    <span className={`text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${MARKET_STYLES[p.market] || MARKET_STYLES.US}`}>
                      {p.market}
                    </span>
                  </div>
                  {p.company && (
                    <p className="text-[0.6rem] text-muted-foreground mt-0.5">{p.company}</p>
                  )}
                </td>
                <td className="px-3 py-3 mono text-sm text-foreground">{p.qty}</td>
                <td className="px-3 py-3 mono text-sm text-secondary-foreground">{formatCurrency(p.avg_entry_price)}</td>
                <td className="px-3 py-3 mono text-sm text-foreground">{formatCurrency(p.current_price)}</td>
                <td className="px-3 py-3">
                  <p className={`mono text-sm font-bold ${pnlColorClass(p.unrealized_pl)}`}>
                    {isUp ? "+" : ""}{formatCurrency(p.unrealized_pl)}
                  </p>
                  <p className={`mono text-[0.6rem] ${pnlColorClass(plPct)}`}>
                    {isUp ? "+" : ""}{plPct.toFixed(2)}%
                  </p>
                </td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => onSell(p.symbol)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg text-xs font-semibold bg-negative/10 text-negative border border-negative/20 hover:bg-negative/20 transition-all"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
