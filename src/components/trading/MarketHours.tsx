import type { MarketHoursData } from "@/types/trading";

interface MarketHoursProps {
  data: MarketHoursData;
}

export function MarketHours({ data }: MarketHoursProps) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Market Sessions</h3>
      <div className="grid grid-cols-2 gap-2">
        {data.markets.slice(0, 4).map((m) => (
          <div
            key={m.name}
            className={`rounded-xl p-2.5 transition-all ${
              m.open
                ? "bg-positive/5 border border-positive/20"
                : "bg-secondary/30 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">{m.flag}</span>
              <div className={`h-1.5 w-1.5 rounded-full ${m.open ? "bg-positive animate-pulse-glow" : "bg-muted-foreground/30"}`} />
            </div>
            <p className={`text-[0.65rem] font-medium ${m.open ? "text-foreground" : "text-muted-foreground"}`}>
              {m.name.split("(")[0].trim()}
            </p>
            <p className="mono text-[0.55rem] text-muted-foreground">{m.hours}</p>
          </div>
        ))}
      </div>
      {data.markets.length > 4 && (
        <p className="text-[0.5rem] text-muted-foreground text-center mt-2">
          +{data.markets.length - 4} more markets
        </p>
      )}
    </div>
  );
}
