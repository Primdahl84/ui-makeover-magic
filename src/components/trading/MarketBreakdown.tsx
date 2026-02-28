import type { StatsData, Position } from "@/types/trading";
import { formatCurrency, pnlColorClass, MARKET_FLAGS } from "@/lib/trading-utils";

interface MarketBreakdownProps {
  stats: StatsData;
  positions: Position[];
}

export function MarketBreakdown({ stats, positions }: MarketBreakdownProps) {
  const markets = ["US", "EU", "DK", "JP", "IN", "TW", "CA"];
  const bm = stats.by_market;

  const unrealizedByMarket: Record<string, number> = {};
  const openByMarket: Record<string, number> = {};
  positions.forEach((p) => {
    const m = p.market || "US";
    unrealizedByMarket[m] = (unrealizedByMarket[m] || 0) + p.unrealized_pl;
    openByMarket[m] = (openByMarket[m] || 0) + 1;
  });

  const activeMarkets = markets.filter((m) => {
    const s = bm[m];
    return (s && s.wins + s.losses > 0) || (openByMarket[m] || 0) > 0;
  });

  const marketColors: Record<string, string> = {
    US: "from-primary/20 to-primary/5 border-primary/20",
    EU: "from-info/20 to-info/5 border-info/20",
    DK: "from-warning/20 to-warning/5 border-warning/20",
    JP: "from-negative/20 to-negative/5 border-negative/20",
    IN: "from-warning/20 to-warning/5 border-warning/20",
    TW: "from-primary/20 to-primary/5 border-primary/20",
    CA: "from-accent/20 to-accent/5 border-accent/20",
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">By Market</h3>
      <div className="grid grid-cols-3 gap-3">
        {activeMarkets.map((m) => {
          const s = bm[m] || { wins: 0, losses: 0, pnl: 0, win_rate: 0 };
          const uPnl = unrealizedByMarket[m] || 0;
          const total = s.pnl + uPnl;
          const openCnt = openByMarket[m] || 0;

          return (
            <div key={m} className={`rounded-xl p-3.5 bg-gradient-to-br border ${marketColors[m] || marketColors.US}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{MARKET_FLAGS[m]}</span>
                <span className={`mono text-sm font-bold ${pnlColorClass(total)}`}>
                  {total >= 0 ? "+" : ""}{formatCurrency(total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {s.wins}W · {s.losses}L
                  {openCnt > 0 ? ` · ${openCnt} open` : ""}
                </span>
                {s.wins + s.losses > 0 && (
                  <span className="text-xs font-medium text-secondary-foreground">{s.win_rate.toFixed(0)}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
