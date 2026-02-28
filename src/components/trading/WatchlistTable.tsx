import type { WatchlistData } from "@/types/trading";
import { formatCurrency } from "@/lib/trading-utils";

interface WatchlistTableProps {
  data: WatchlistData;
}

export function WatchlistTable({ data }: WatchlistTableProps) {
  if (!data.tickers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-3xl mb-3 opacity-30">👁</span>
        <p className="text-sm">No watchlist yet — runs at bot startup</p>
      </div>
    );
  }

  const scoreMap: Record<string, (typeof data.all_scores)[0]> = {};
  data.all_scores.forEach((s) => { scoreMap[s.ticker] = s; });

  const scoredAt = data.scored_at
    ? new Date(data.scored_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Pre-Market Watchlist</h3>
          <p className="text-[0.65rem] text-muted-foreground mt-0.5">
            Top {data.tickers.length} of {data.total_scanned} scanned{scoredAt ? ` · ${scoredAt}` : ""}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-0">
        {data.tickers.map((ticker, i) => {
          const s = scoreMap[ticker];
          const score = s?.score;
          const pct = score != null ? Math.min((score / 10) * 100, 100) : 0;
          const barColor = score != null
            ? score >= 7 ? "bg-positive" : score >= 5 ? "bg-warning" : "bg-negative"
            : "bg-muted";
          const textColor = score != null
            ? score >= 7 ? "text-positive" : score >= 5 ? "text-warning" : "text-negative"
            : "text-muted-foreground";

          return (
            <div key={ticker} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors">
              <span className="mono text-[0.6rem] text-muted-foreground w-6 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{ticker}</span>
                  {s?.price != null && (
                    <span className="mono text-[0.65rem] text-muted-foreground">{formatCurrency(s.price)}</span>
                  )}
                </div>
                {s?.company_name && s.company_name !== ticker && (
                  <p className="text-[0.6rem] text-muted-foreground truncate">{s.company_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 w-28 shrink-0">
                <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={`mono text-[0.65rem] font-semibold w-8 text-right ${textColor}`}>
                  {score != null ? score.toFixed(1) : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
