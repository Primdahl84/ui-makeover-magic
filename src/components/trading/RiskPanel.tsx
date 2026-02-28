import type { Position } from "@/types/trading";
import { formatCurrency } from "@/lib/trading-utils";

interface RiskPanelProps {
  positions: Position[];
  portfolioValue: number;
}

export function RiskPanel({ positions, portfolioValue }: RiskPanelProps) {
  const sectorMap: Record<string, number> = {};
  positions.forEach((p) => {
    const value = p.current_price * Number(p.qty);
    sectorMap[p.market] = (sectorMap[p.market] || 0) + value;
  });

  const totalInvested = Object.values(sectorMap).reduce((a, b) => a + b, 0);
  const sectors = Object.entries(sectorMap)
    .map(([market, value]) => ({ market, value, pct: totalInvested > 0 ? (value / totalInvested) * 100 : 0 }))
    .sort((a, b) => b.pct - a.pct);

  const positionValues = positions.map((p) => ({
    symbol: p.symbol,
    value: p.current_price * Number(p.qty),
    pct: totalInvested > 0 ? ((p.current_price * Number(p.qty)) / portfolioValue) * 100 : 0,
  })).sort((a, b) => b.pct - a.pct);

  const cashPct = ((portfolioValue - totalInvested) / portfolioValue) * 100;
  const totalUnrealizedPl = positions.reduce((s, p) => s + p.unrealized_pl, 0);
  const maxLoss = positions.reduce((worst, p) => Math.min(worst, p.unrealized_pl), 0);
  const worstPosition = positions.find((p) => p.unrealized_pl === maxLoss);

  const MARKET_COLORS: Record<string, string> = {
    US: "bg-primary", EU: "bg-info", DK: "bg-warning", JP: "bg-negative", IN: "bg-amber-500", TW: "bg-cyan-500", CA: "bg-accent",
  };

  return (
    <div className="space-y-4">
      {/* Key metrics - horizontal */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-center flex-1">
          <p className="text-[0.5rem] text-muted-foreground uppercase">Invested</p>
          <p className="mono text-xs font-bold text-foreground">{formatCurrency(totalInvested)}</p>
          <p className="text-[0.5rem] text-muted-foreground">{(100 - cashPct).toFixed(0)}%</p>
        </div>
        <div className="w-px h-8 bg-border/30" />
        <div className="text-center flex-1">
          <p className="text-[0.5rem] text-muted-foreground uppercase">Cash</p>
          <p className="mono text-xs font-bold text-positive">{formatCurrency(portfolioValue - totalInvested)}</p>
          <p className="text-[0.5rem] text-muted-foreground">{cashPct.toFixed(0)}%</p>
        </div>
        <div className="w-px h-8 bg-border/30" />
        <div className="text-center flex-1">
          <p className="text-[0.5rem] text-muted-foreground uppercase">Unreal.</p>
          <p className={`mono text-xs font-bold ${totalUnrealizedPl >= 0 ? "text-positive" : "text-negative"}`}>
            {totalUnrealizedPl >= 0 ? "+" : ""}{formatCurrency(totalUnrealizedPl)}
          </p>
        </div>
      </div>

      {/* Allocation bar */}
      <div>
        <p className="text-[0.55rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Allocation</p>
        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
          {sectors.map((s) => (
            <div key={s.market} className={`${MARKET_COLORS[s.market] || "bg-muted"} rounded-full`} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {sectors.map((s) => (
            <span key={s.market} className="text-[0.5rem] text-muted-foreground flex items-center gap-1">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${MARKET_COLORS[s.market] || "bg-muted"}`} />
              {s.market} {s.pct.toFixed(0)}%
            </span>
          ))}
        </div>
      </div>

      {/* Concentration */}
      <div>
        <p className="text-[0.55rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Concentration</p>
        <div className="space-y-1">
          {positionValues.map((p) => (
            <div key={p.symbol} className="flex items-center gap-2">
              <span className="text-[0.65rem] font-semibold text-foreground w-16 truncate">{p.symbol}</span>
              <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.pct > 30 ? "bg-negative" : p.pct > 15 ? "bg-warning" : "bg-primary"}`}
                  style={{ width: `${Math.min(p.pct * 3, 100)}%` }}
                />
              </div>
              <span className="mono text-[0.5rem] text-muted-foreground w-8 text-right">{p.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Worst position */}
      {worstPosition && worstPosition.unrealized_pl < 0 && (
        <div className="rounded-lg border border-negative/20 bg-negative/5 p-2.5">
          <p className="text-[0.5rem] text-muted-foreground uppercase mb-0.5">Worst</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">{worstPosition.symbol}</span>
            <span className="mono text-xs font-bold text-negative">{formatCurrency(worstPosition.unrealized_pl)}</span>
          </div>
          <p className="text-[0.5rem] text-negative">{(worstPosition.unrealized_plpc * 100).toFixed(2)}% drawdown</p>
        </div>
      )}
    </div>
  );
}
