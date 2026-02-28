import type { Position } from "@/types/trading";
import { formatCurrency, pnlColorClass } from "@/lib/trading-utils";

interface PositionsTableProps {
  positions: Position[];
  onSell: (symbol: string) => void;
}

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
    <div className="space-y-2">
      {positions.map((p) => {
        const plPct = p.unrealized_plpc * 100;
        const isUp = p.unrealized_pl >= 0;

        return (
          <div
            key={p.symbol}
            className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition-all hover:bg-secondary/40 border border-transparent hover:border-border/30 ${
              isUp ? "hover:border-positive/10" : "hover:border-negative/10"
            }`}
          >
            {/* Symbol + company */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{p.symbol}</span>
                <span className={`text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                  p.market === "US" ? "bg-primary/10 text-primary" :
                  p.market === "EU" ? "bg-info/10 text-info" :
                  p.market === "DK" ? "bg-warning/10 text-warning" :
                  "bg-accent/10 text-accent"
                }`}>{p.market}</span>
              </div>
              {p.company && (
                <p className="text-[0.65rem] text-muted-foreground truncate mt-0.5">{p.company}</p>
              )}
            </div>

            {/* Qty */}
            <div className="text-right w-12">
              <p className="text-[0.55rem] text-muted-foreground uppercase">Qty</p>
              <p className="mono text-sm font-medium text-foreground">{p.qty}</p>
            </div>

            {/* Entry → Current */}
            <div className="text-right w-24">
              <p className="text-[0.55rem] text-muted-foreground uppercase">Entry</p>
              <p className="mono text-sm text-secondary-foreground">{formatCurrency(p.avg_entry_price)}</p>
            </div>
            <div className="text-muted-foreground text-xs">→</div>
            <div className="text-right w-24">
              <p className="text-[0.55rem] text-muted-foreground uppercase">Current</p>
              <p className="mono text-sm text-foreground">{formatCurrency(p.current_price)}</p>
            </div>

            {/* P&L */}
            <div className="text-right w-28">
              <p className={`mono text-sm font-bold ${pnlColorClass(p.unrealized_pl)}`}>
                {isUp ? "+" : ""}{formatCurrency(p.unrealized_pl)}
              </p>
              <p className={`mono text-[0.65rem] ${pnlColorClass(plPct)}`}>
                {isUp ? "+" : ""}{plPct.toFixed(2)}%
              </p>
            </div>

            {/* Sell button */}
            <button
              onClick={() => onSell(p.symbol)}
              className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg text-xs font-semibold bg-negative/10 text-negative border border-negative/20 hover:bg-negative/20 transition-all"
            >
              Sell
            </button>
          </div>
        );
      })}
    </div>
  );
}
