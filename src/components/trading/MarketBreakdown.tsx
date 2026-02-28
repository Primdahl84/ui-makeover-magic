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
    <div className="glass rounded-2xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">By Market</h3>
      <div className="space-y-2">
        {activeMarkets.map((m) => {
          const s = bm[m] || { wins: 0, losses: 0, pnl: 0, win_rate: 0 };
          const uPnl = unrealizedByMarket[m] || 0;
          const total = s.pnl + uPnl;
          const openCnt = openByMarket[m] || 0;

          return (
            <div key={m} className={`rounded-xl p-3 bg-gradient-to-r border ${marketColors[m] || marketColors.US}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{MARKET_FLAGS[m]}</span>
                  <span className="text-xs font-semibold text-foreground">{m}</span>
                  <span className="text-[0.55rem] text-muted-foreground">
                    {s.wins}W·{s.losses}L
                    {openCnt > 0 ? ` · ${openCnt} open` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {s.wins + s.losses > 0 && (
                    <span className="text-[0.6rem] text-muted-foreground">{s.win_rate.toFixed(0)}%</span>
                  )}
                  <span className={`mono text-xs font-bold ${pnlColorClass(total)}`}>
                    {total >= 0 ? "+" : ""}{formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
