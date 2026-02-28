import type { TaxData } from "@/types/trading";
import { formatDKK, pnlColorClass } from "@/lib/trading-utils";

interface TaxPanelProps {
  data: TaxData;
}

export function TaxPanel({ data }: TaxPanelProps) {
  const years = Object.keys(data).sort().reverse();

  if (!years.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-3xl mb-3 opacity-30">🧾</span>
        <p className="text-sm">No closed trades yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Danish Tax Estimate</h3>
          <p className="text-[0.65rem] text-muted-foreground mt-0.5">Aktieindkomst · {years[0]}</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/50 transition-all">
          ⬇ Download SKAT CSV
        </button>
      </div>

      {years.map((yr) => {
        const d = data[yr];
        const isLoss = (d.gain_dkk ?? d.net_dkk) < 0;
        const gainUsd = d.gain_usd ?? d.net_usd ?? 0;
        const gainDkk = d.gain_dkk ?? d.net_dkk ?? 0;

        return (
          <div key={yr} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Net Gain (USD)", value: `${gainUsd >= 0 ? "+" : ""}$${Math.abs(gainUsd).toFixed(2)}`, cls: pnlColorClass(gainUsd) },
                { label: "Net Gain (DKK)", value: formatDKK(gainDkk), cls: pnlColorClass(gainDkk) },
                { label: "Estimated Tax", value: isLoss ? "No tax" : formatDKK(-d.tax_dkk), cls: isLoss ? "text-positive" : "text-negative" },
                { label: "Net After Tax", value: formatDKK(d.net_dkk), cls: pnlColorClass(d.net_dkk) },
              ].map((t) => (
                <div key={t.label} className="rounded-xl bg-secondary/40 border border-border/30 p-4">
                  <p className="text-[0.6rem] text-muted-foreground uppercase tracking-wider mb-1.5">{t.label}</p>
                  <p className={`mono text-lg font-bold ${t.cls}`}>{t.value}</p>
                </div>
              ))}
            </div>

            {/* Trade details */}
            {d.trades && d.trades.length > 0 && (
              <div className="rounded-xl bg-secondary/20 border border-border/20 p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Closed Trades</h4>
                <div className="space-y-2">
                  {d.trades.map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/10 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground text-sm">{t.ticker}</span>
                        <span className="text-[0.6rem] text-muted-foreground">{t.qty} shares</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="mono text-[0.65rem] text-muted-foreground">
                          ${t.buy_price_usd.toFixed(2)} → ${t.sell_price_usd.toFixed(2)}
                        </span>
                        <span className={`mono text-sm font-bold ${pnlColorClass(t.gain_dkk)}`}>
                          {formatDKK(t.gain_dkk)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
