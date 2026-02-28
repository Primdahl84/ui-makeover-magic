import type { Position } from "@/types/trading";
import { formatCurrency } from "@/lib/trading-utils";

interface RiskPanelProps {
  positions: Position[];
  portfolioValue: number;
}

export function RiskPanel({ positions, portfolioValue }: RiskPanelProps) {
  // Sector allocation
  const sectorMap: Record<string, number> = {};
  positions.forEach((p) => {
    const value = p.current_price * Number(p.qty);
    const sector = p.market;
    sectorMap[sector] = (sectorMap[sector] || 0) + value;
  });

  const totalInvested = Object.values(sectorMap).reduce((a, b) => a + b, 0);
  const sectors = Object.entries(sectorMap)
    .map(([market, value]) => ({
      market,
      value,
      pct: totalInvested > 0 ? (value / totalInvested) * 100 : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  // Concentration risk
  const positionValues = positions.map((p) => ({
    symbol: p.symbol,
    value: p.current_price * Number(p.qty),
    pct: totalInvested > 0 ? ((p.current_price * Number(p.qty)) / portfolioValue) * 100 : 0,
  })).sort((a, b) => b.pct - a.pct);

  const maxConcentration = positionValues[0];
  const cashPct = ((portfolioValue - totalInvested) / portfolioValue) * 100;

  // Max unrealized drawdown
  const totalUnrealizedPl = positions.reduce((s, p) => s + p.unrealized_pl, 0);
  const maxLoss = positions.reduce((worst, p) => Math.min(worst, p.unrealized_pl), 0);
  const worstPosition = positions.find((p) => p.unrealized_pl === maxLoss);

  const MARKET_COLORS: Record<string, string> = {
    US: "bg-primary", EU: "bg-info", DK: "bg-warning", JP: "bg-negative", IN: "bg-amber-500", TW: "bg-cyan-500", CA: "bg-accent",
  };

  return (
    <div className="space-y-5">
      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-secondary/30 p-3 text-center">
          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wider">Invested</p>
          <p className="mono text-sm font-bold text-foreground">{formatCurrency(totalInvested)}</p>
          <p className="text-[0.55rem] text-muted-foreground">{(100 - cashPct).toFixed(1)}% deployed</p>
        </div>
        <div className="rounded-xl bg-secondary/30 p-3 text-center">
          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wider">Cash</p>
          <p className="mono text-sm font-bold text-positive">{formatCurrency(portfolioValue - totalInvested)}</p>
          <p className="text-[0.55rem] text-muted-foreground">{cashPct.toFixed(1)}% available</p>
        </div>
        <div className="rounded-xl bg-secondary/30 p-3 text-center">
          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wider">Unrealized</p>
          <p className={`mono text-sm font-bold ${totalUnrealizedPl >= 0 ? "text-positive" : "text-negative"}`}>
            {totalUnrealizedPl >= 0 ? "+" : ""}{formatCurrency(totalUnrealizedPl)}
          </p>
        </div>
      </div>

      {/* Market allocation bars */}
      <div>
        <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Market Allocation</p>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {sectors.map((s) => (
            <div
              key={s.market}
              className={`${MARKET_COLORS[s.market] || "bg-muted"} rounded-full transition-all`}
              style={{ width: `${s.pct}%` }}
              title={`${s.market}: ${s.pct.toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="flex gap-3 mt-2 flex-wrap">
          {sectors.map((s) => (
            <span key={s.market} className="text-[0.55rem] text-muted-foreground">
              <span className={`inline-block w-2 h-2 rounded-full ${MARKET_COLORS[s.market] || "bg-muted"} mr-1`} />
              {s.market} {s.pct.toFixed(1)}%
            </span>
          ))}
        </div>
      </div>

      {/* Concentration risk */}
      <div>
        <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Concentration Risk</p>
        <div className="space-y-1.5">
          {positionValues.map((p) => (
            <div key={p.symbol} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground w-20">{p.symbol}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.pct > 30 ? "bg-negative" : p.pct > 15 ? "bg-warning" : "bg-primary"}`}
                  style={{ width: `${Math.min(p.pct * 2, 100)}%` }}
                />
              </div>
              <span className="mono text-[0.6rem] text-muted-foreground w-12 text-right">{p.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        {maxConcentration && maxConcentration.pct > 25 && (
          <p className="text-[0.55rem] text-warning mt-2">
            ⚠ {maxConcentration.symbol} at {maxConcentration.pct.toFixed(1)}% — consider diversifying
          </p>
        )}
      </div>

      {/* Worst performer */}
      {worstPosition && worstPosition.unrealized_pl < 0 && (
        <div className="rounded-xl border border-negative/20 bg-negative/5 p-3">
          <p className="text-[0.55rem] text-muted-foreground uppercase tracking-wider mb-1">Worst Position</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">{worstPosition.symbol}</span>
            <span className="mono text-sm font-bold text-negative">{formatCurrency(worstPosition.unrealized_pl)}</span>
          </div>
          <p className="text-[0.55rem] text-negative mt-0.5">
            {(worstPosition.unrealized_plpc * 100).toFixed(2)}% drawdown
          </p>
        </div>
      )}
    </div>
  );
}
