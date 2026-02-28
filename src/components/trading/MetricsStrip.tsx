import type { AccountData, Position, StatsData } from "@/types/trading";
import { formatCurrency, formatPnl, pnlColorClass } from "@/lib/trading-utils";

interface MetricsStripProps {
  account: AccountData;
  stats: StatsData;
  positions: Position[];
}

export function MetricsStrip({ account, stats, positions }: MetricsStripProps) {
  const unrealized = positions.reduce((s, p) => s + p.unrealized_pl, 0);
  const total = stats.realized_pnl + unrealized;
  const openCount = positions.length;

  const tiles = [
    {
      label: "Portfolio",
      value: formatCurrency(account.portfolio_value),
      sub: (
        <div className="flex justify-between mt-1 text-[0.62rem]">
          <span className="text-muted-foreground">vs $100k</span>
          <span className={`mono font-semibold text-[0.65rem] ${pnlColorClass(account.portfolio_change)}`}>
            {formatPnl(account.portfolio_change)}
          </span>
        </div>
      ),
    },
    { label: "Cash", value: formatCurrency(account.cash) },
    { label: "Realized P&L", value: formatPnl(stats.realized_pnl), colorClass: pnlColorClass(stats.realized_pnl) },
    { label: "Unrealized P&L", value: formatPnl(unrealized), colorClass: pnlColorClass(unrealized) },
    { label: "Total P&L", value: formatPnl(total), colorClass: pnlColorClass(total) },
    {
      label: "Win Rate",
      value: `${stats.win_rate.toFixed(1)}%`,
      sub: (
        <div className="text-[0.62rem] text-muted-foreground mt-1">
          {stats.wins}W · {stats.losses}L · {stats.total_trades} trades{openCount > 0 ? ` · ${openCount} open` : ""}
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-2.5 mb-3">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-border bg-card p-3">
          <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
            {t.label}
          </div>
          <div className={`mono text-lg font-bold ${t.colorClass || "text-foreground"}`}>
            {t.value}
          </div>
          {t.sub}
        </div>
      ))}
    </div>
  );
}
