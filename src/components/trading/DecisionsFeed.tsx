import type { Decision } from "@/types/trading";
import { formatDate } from "@/lib/trading-utils";

interface DecisionsFeedProps {
  decisions: Decision[];
}

function ActionPill({ action }: { action: string }) {
  const u = action.toUpperCase();
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider ${
      u === "BUY" ? "bg-positive/10 text-positive border border-positive/20" :
      u === "SELL" ? "bg-negative/10 text-negative border border-negative/20" :
      "bg-accent/10 text-accent border border-accent/20"
    }`}>
      <span className={`h-1 w-1 rounded-full ${
        u === "BUY" ? "bg-positive" : u === "SELL" ? "bg-negative" : "bg-accent"
      }`} />
      {u}
    </span>
  );
}

export function DecisionsFeed({ decisions }: DecisionsFeedProps) {
  if (!decisions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <span className="text-3xl mb-3 opacity-30">🤖</span>
        <p className="text-sm">No decisions yet</p>
      </div>
    );
  }

  const seen = new Set<string>();
  const latest = [...decisions].reverse().filter((d) => {
    if (!d.ticker || seen.has(d.ticker)) return false;
    seen.add(d.ticker);
    return true;
  });

  return (
    <div className="space-y-1 max-h-[450px] overflow-y-auto pr-1">
      {latest.map((d, i) => (
        <div key={d.ticker + i} className="rounded-xl p-3 hover:bg-secondary/30 transition-colors group">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-sm">{d.ticker}</span>
              <ActionPill action={d.action} />
              {d.executed && (
                <span className="text-[0.55rem] text-positive/50 bg-positive/5 px-1.5 py-0.5 rounded-md border border-positive/10">✓</span>
              )}
            </div>
            <span className="text-[0.6rem] text-muted-foreground mono">{formatDate(d.timestamp)}</span>
          </div>

          {/* Confidence bar - redesigned as horizontal bar with glow */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  d.confidence >= 7 ? "bg-positive shadow-[0_0_8px_hsl(var(--positive)/0.3)]" :
                  d.confidence >= 5 ? "bg-warning" : "bg-negative"
                }`}
                style={{ width: `${(d.confidence / 10) * 100}%` }}
              />
            </div>
            <span className="mono text-[0.6rem] text-muted-foreground w-8">{d.confidence}/10</span>
          </div>

          {d.key_signal && (
            <p className="text-[0.7rem] text-secondary-foreground leading-relaxed">{d.key_signal}</p>
          )}
          {d.company_name && (
            <p className="text-[0.6rem] text-muted-foreground mt-1">{d.company_name}{d.sector ? ` · ${d.sector}` : ""}</p>
          )}
        </div>
      ))}
    </div>
  );
}
