import type { Position } from "@/types/trading";
import { formatCurrency, formatPnl, pnlColorClass } from "@/lib/trading-utils";

interface PositionsTableProps {
  positions: Position[];
  onSell: (symbol: string) => void;
}

const MARKET_BADGE_STYLES: Record<string, string> = {
  US: "bg-market-us/10 text-market-us",
  EU: "bg-market-eu/10 text-market-eu",
  DK: "bg-market-dk/10 text-market-dk",
  JP: "bg-market-jp/10 text-market-jp",
  IN: "bg-market-in/10 text-market-in",
  TW: "bg-market-tw/10 text-market-tw",
  CA: "bg-market-ca/10 text-market-ca",
};

export function PositionsTable({ positions, onSell }: PositionsTableProps) {
  if (!positions.length) {
    return <div className="text-muted-foreground text-center py-10 text-[0.85rem]">No open positions</div>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Ticker", "Qty", "Entry", "Current", "P&L $", "P&L %", ""].map((h) => (
              <th key={h} className="text-left p-2 px-3 text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const plPct = p.unrealized_plpc * 100;
            return (
              <tr key={p.symbol} className="border-b border-background hover:bg-muted/30 transition-colors">
                <td className="p-2.5 px-3">
                  <span className="font-bold text-foreground">{p.symbol}</span>
                  <span className={`ml-1.5 inline-block text-[0.58rem] font-semibold px-1.5 py-px rounded ${MARKET_BADGE_STYLES[p.market] || MARKET_BADGE_STYLES.US}`}>
                    {p.market}
                  </span>
                  {p.company && (
                    <div className="text-[0.63rem] text-muted-foreground mt-0.5">
                      {p.company}{p.country ? ` (${p.country})` : ""}
                    </div>
                  )}
                </td>
                <td className="p-2.5 px-3 mono text-info">{p.qty}</td>
                <td className="p-2.5 px-3 mono text-[0.82rem]">{formatCurrency(p.avg_entry_price)}</td>
                <td className="p-2.5 px-3 mono text-[0.82rem]">{formatCurrency(p.current_price)}</td>
                <td className={`p-2.5 px-3 mono text-[0.82rem] ${pnlColorClass(p.unrealized_pl)}`}>
                  {formatPnl(p.unrealized_pl)}
                </td>
                <td className={`p-2.5 px-3 mono text-[0.82rem] ${pnlColorClass(plPct)}`}>
                  {plPct >= 0 ? "+" : ""}{plPct.toFixed(2)}%
                </td>
                <td className="p-2.5 px-3">
                  <button
                    onClick={() => onSell(p.symbol)}
                    className="rounded border border-destructive/50 bg-destructive/10 px-3 py-0.5 text-[0.72rem] font-semibold text-negative hover:bg-destructive/20 transition-colors whitespace-nowrap"
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
