import type { StatsData, Position } from "@/types/trading";
import { formatCurrency, formatPnl, pnlColorClass, MARKET_FLAGS } from "@/lib/trading-utils";

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
    const closed = s ? s.wins + s.losses : 0;
    return closed > 0 || (openByMarket[m] || 0) > 0;
  });

  const totalRealized = Object.values(bm).reduce((s, m) => s + m.pnl, 0);
  const totalUnrealized = Object.values(unrealizedByMarket).reduce((s, v) => s + v, 0);
  const grandTotal = totalRealized + totalUnrealized;

  return (
    <div className="rounded-lg border border-border bg-card py-2 px-3.5 mb-3">
      <div className="flex flex-col gap-0.5">
        {activeMarkets.map((m) => {
          const s = bm[m] || { wins: 0, losses: 0, pnl: 0, win_rate: 0 };
          const closedTotal = s.wins + s.losses;
          const rPnl = s.pnl;
          const uPnl = unrealizedByMarket[m] || 0;
          const openCnt = openByMarket[m] || 0;
          const wr = closedTotal > 0 ? `${s.win_rate.toFixed(0)}%` : "—";
          const wl = closedTotal > 0 ? `${s.wins}W · ${s.losses}L` : "—";
          const mTotal = rPnl + uPnl;

          return (
            <div key={m} className="py-1 border-t border-background first:border-t-0">
              <div className="flex items-center justify-between text-[0.68rem]">
                <span className={`font-semibold text-market-${m.toLowerCase()}`}>
                  {MARKET_FLAGS[m]} {m}
                </span>
                <span className="text-secondary-foreground">{wl}</span>
                <span className="text-secondary-foreground">{wr}</span>
                <span className={`mono font-bold ${pnlColorClass(mTotal)}`}>
                  {formatPnl(mTotal)}
                </span>
              </div>
              <div className="flex justify-between text-[0.62rem] mt-0.5 pl-1">
                <span className="text-muted-foreground">closed {formatPnl(rPnl)}</span>
                {openCnt > 0 && (
                  <span className={`mono text-[0.62rem] ${pnlColorClass(uPnl)}`}>
                    {openCnt} open {formatPnl(uPnl)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div className="border-t border-muted-foreground/30 mt-1 pt-1.5 flex justify-between items-center text-[0.7rem]">
          <span className="text-info font-bold">Total</span>
          <span className="text-secondary-foreground text-[0.62rem]">{formatPnl(totalRealized)} realized</span>
          <span className={`mono font-bold text-[0.75rem] ${pnlColorClass(grandTotal)}`}>
            {formatPnl(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
