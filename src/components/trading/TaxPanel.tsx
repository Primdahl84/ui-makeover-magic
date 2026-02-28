import type { TaxData } from "@/types/trading";
import { formatDKK, pnlColorClass } from "@/lib/trading-utils";

interface TaxPanelProps {
  data: TaxData;
}

export function TaxPanel({ data }: TaxPanelProps) {
  const years = Object.keys(data).sort().reverse();

  if (!years.length) {
    return <div className="text-muted-foreground text-[0.82rem]">No closed trades yet — no tax to estimate.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
          Danish Tax Estimate (Aktieindkomst) — <span className="text-info">{years[0]}</span>
        </div>
        <a
          href="#"
          className="rounded-md border border-primary/50 bg-secondary px-3.5 py-1.5 text-[0.75rem] font-semibold text-info no-underline hover:bg-secondary/80 transition-colors whitespace-nowrap"
        >
          ⬇ Download til SKAT (CSV)
        </a>
      </div>
      {years.map((yr) => {
        const d = data[yr];
        const isLoss = (d.gain_dkk ?? d.net_dkk) < 0;
        const gainUsd = d.gain_usd ?? d.net_usd ?? 0;
        const gainDkk = d.gain_dkk ?? d.net_dkk ?? 0;

        const tiles = [
          { label: "Gain (USD)", value: `${gainUsd >= 0 ? "+" : ""}$${Math.abs(gainUsd).toFixed(2)}`, cls: pnlColorClass(gainUsd) },
          { label: "Gain (DKK)", value: formatDKK(gainDkk), cls: pnlColorClass(gainDkk) },
          { label: "Est. Tax", value: isLoss ? "—" : formatDKK(-d.tax_dkk), cls: "text-negative", sub: isLoss ? "Loss — offsets future gains" : d.bracket },
          { label: "Net after tax", value: formatDKK(d.net_dkk), cls: pnlColorClass(d.net_dkk) },
          { label: "Bracket", value: isLoss ? "—" : (d.tax_high && d.tax_high > 0 ? "27% + 42%" : "27% only"), cls: "text-info", sub: "aktieindkomst" },
        ];

        return (
          <div key={yr} className="mb-3">
            <div className="text-[0.68rem] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{yr}</div>
            <div className="grid grid-cols-5 gap-3">
              {tiles.map((t) => (
                <div key={t.label}>
                  <div className="text-[0.6rem] text-muted-foreground mb-0.5">{t.label}</div>
                  <div className={`mono text-[0.85rem] font-semibold ${t.cls}`}>{t.value}</div>
                  {t.sub && <div className="text-[0.58rem] text-muted-foreground mt-0.5">{t.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
