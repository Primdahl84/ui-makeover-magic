import type { AccountData, StatsData, Position } from "@/types/trading";
import { formatCurrency, pnlColorClass } from "@/lib/trading-utils";

interface HeroMetricsProps {
  account: AccountData;
  stats: StatsData;
  positions: Position[];
}

function RadialGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
          <circle
            cx="40" cy="40" r="36" fill="none" stroke={color}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono text-lg font-bold text-foreground">{(value * 100 / max).toFixed(0)}%</span>
        </div>
      </div>
      <span className="text-[0.65rem] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function HeroMetrics({ account, stats, positions }: HeroMetricsProps) {
  const unrealized = positions.reduce((s, p) => s + p.unrealized_pl, 0);
  const totalPnl = stats.realized_pnl + unrealized;
  const changePercent = (account.portfolio_change / account.starting_value) * 100;

  return (
    <div className="glass rounded-2xl p-8 gradient-border">
      <div className="grid grid-cols-12 gap-8 items-center">
        {/* Portfolio value - hero */}
        <div className="col-span-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Portfolio Value</p>
          <h2 className="text-4xl font-bold mono tracking-tight text-foreground mb-1">
            {formatCurrency(account.portfolio_value)}
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <span className={`mono text-sm font-semibold ${pnlColorClass(account.portfolio_change)}`}>
              {account.portfolio_change >= 0 ? "+" : ""}{account.portfolio_change.toFixed(2)}
            </span>
            <span className={`mono text-xs px-2 py-0.5 rounded-md ${
              changePercent >= 0 ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
            }`}>
              {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground">vs $100k start</span>
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="col-span-5 grid grid-cols-3 gap-4">
          {[
            { label: "Cash Available", value: formatCurrency(account.cash), color: "text-foreground" },
            { label: "Realized P&L", value: `${stats.realized_pnl >= 0 ? "+" : ""}${formatCurrency(stats.realized_pnl)}`, color: pnlColorClass(stats.realized_pnl) },
            { label: "Unrealized P&L", value: `${unrealized >= 0 ? "+" : ""}${formatCurrency(unrealized)}`, color: pnlColorClass(unrealized) },
            { label: "Total P&L", value: `${totalPnl >= 0 ? "+" : ""}${formatCurrency(totalPnl)}`, color: pnlColorClass(totalPnl) },
            { label: "Open Positions", value: `${positions.length}`, color: "text-accent" },
            { label: "Total Trades", value: `${stats.total_trades}`, color: "text-foreground" },
          ].map((item) => (
            <div key={item.label} className="px-3 py-2.5 rounded-xl bg-secondary/40 border border-border/30">
              <p className="text-[0.58rem] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
              <p className={`mono text-sm font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Win rate gauge */}
        <div className="col-span-3 flex items-center justify-center gap-6">
          <RadialGauge value={stats.win_rate} max={100} label="Win Rate" color="hsl(var(--primary))" />
          <div className="text-center space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-positive" />
              <span className="text-xs text-muted-foreground">{stats.wins}W</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-negative" />
              <span className="text-xs text-muted-foreground">{stats.losses}L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
