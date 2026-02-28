import type { WatchlistData } from "@/types/trading";
import { formatCurrency } from "@/lib/trading-utils";

interface WatchlistTableProps {
  data: WatchlistData;
}

export function WatchlistTable({ data }: WatchlistTableProps) {
  if (!data.tickers.length) {
    return (
      <div className="text-muted-foreground text-center py-8 text-[0.85rem]">
        No watchlist yet — runs at bot startup before market open
      </div>
    );
  }

  const scoreMap: Record<string, (typeof data.all_scores)[0]> = {};
  data.all_scores.forEach((s) => { scoreMap[s.ticker] = s; });

  const scoredAt = data.scored_at
    ? new Date(data.scored_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : "";

  const half = Math.ceil(data.tickers.length / 2);
  const columns = [data.tickers.slice(0, half), data.tickers.slice(half)];

  const renderColumn = (tickers: string[], offset: number) => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {["#", "Ticker", "Score", "Price"].map((h) => (
            <th key={h} className="text-left p-2 px-3 text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tickers.map((ticker, i) => {
          const s = scoreMap[ticker];
          const score = s?.score;
          const pct = score != null ? Math.min((score / 10) * 100, 100) : 0;
          const color = score != null ? (score >= 7 ? "bg-positive" : score >= 5 ? "bg-warning" : "bg-negative") : "bg-muted";
          const textColor = score != null ? (score >= 7 ? "text-positive" : score >= 5 ? "text-warning" : "text-negative") : "text-muted-foreground";

          return (
            <tr key={ticker} className="border-b border-background hover:bg-muted/30 transition-colors">
              <td className="p-2 px-3 mono text-muted-foreground w-10">{offset + i + 1}</td>
              <td className="p-2 px-3">
                <div className="font-bold text-foreground">{ticker}</div>
                {s?.company_name && s.company_name !== ticker && (
                  <div className="text-[0.65rem] text-muted-foreground mt-px">
                    {s.company_name}{s.sector ? ` · ${s.sector}` : ""}
                  </div>
                )}
              </td>
              <td className="p-2 px-3 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="w-[70px] h-[5px] rounded-full bg-muted overflow-hidden shrink-0">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`mono text-[0.75rem] ${textColor}`}>
                    {score != null ? `${score.toFixed(1)} / 10` : "—"}
                  </span>
                </div>
              </td>
              <td className="p-2 px-3 mono text-info">
                {s?.price != null ? formatCurrency(s.price) : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
          Pre-Market Watchlist — Today's Top {data.tickers.length}
        </div>
        <span className="text-[0.62rem] text-muted-foreground">
          Scored {data.total_scanned} tickers{scoredAt ? ` at ${scoredAt}` : ""} · Indicators only
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-8">
        {columns.map((col, ci) => (
          <div key={ci}>{renderColumn(col, ci * half)}</div>
        ))}
      </div>
    </>
  );
}
