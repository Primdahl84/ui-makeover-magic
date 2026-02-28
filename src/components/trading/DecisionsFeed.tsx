import type { Decision } from "@/types/trading";
import { formatDate } from "@/lib/trading-utils";

interface DecisionsFeedProps {
  decisions: Decision[];
}

function ActionBadge({ action }: { action: string }) {
  const u = (action || "HOLD").toUpperCase();
  const styles = {
    BUY: "bg-positive/15 text-positive",
    SELL: "bg-negative/15 text-negative",
    HOLD: "bg-info/15 text-info",
  };
  return (
    <span className={`inline-block px-2.5 py-px rounded-full text-[0.68rem] font-bold tracking-wide ${styles[u as keyof typeof styles] || styles.HOLD}`}>
      {u}
    </span>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.min((confidence / 10) * 100, 100);
  const color = confidence >= 7 ? "bg-positive" : confidence >= 5 ? "bg-warning" : "bg-negative";

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="w-14 h-1 rounded-full bg-muted overflow-hidden shrink-0">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="mono text-[0.67rem] text-secondary-foreground">{confidence}/10</span>
    </div>
  );
}

export function DecisionsFeed({ decisions }: DecisionsFeedProps) {
  if (!decisions.length) {
    return <div className="text-muted-foreground text-center py-10 text-[0.85rem]">No decisions yet</div>;
  }

  // Keep only latest per ticker
  const seen = new Set<string>();
  const latest = [...decisions].reverse().filter((d) => {
    if (!d.ticker || seen.has(d.ticker)) return false;
    seen.add(d.ticker);
    return true;
  });

  return (
    <div className="max-h-[420px] overflow-y-auto">
      {latest.map((d, i) => (
        <div key={d.ticker + i} className="py-3 border-b border-background last:border-b-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-2">
              <div>
                <span className="font-bold text-foreground text-[0.875rem]">{d.ticker}</span>
                {d.company_name && (
                  <p className="text-[0.67rem] text-muted-foreground mt-px">
                    {d.company_name}{d.sector ? ` · ${d.sector}` : ""}
                  </p>
                )}
              </div>
              <ActionBadge action={d.action} />
              {d.executed && (
                <span className="text-[0.6rem] text-positive/60 bg-positive/5 px-1.5 py-px rounded">executed</span>
              )}
            </div>
            <span className="text-[0.6rem] text-muted-foreground">{formatDate(d.timestamp)}</span>
          </div>
          <ConfidenceBar confidence={d.confidence} />
          {d.key_signal && (
            <p className="text-[0.72rem] text-secondary-foreground mt-1.5 leading-relaxed">{d.key_signal}</p>
          )}
        </div>
      ))}
    </div>
  );
}
