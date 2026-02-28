import type { MarketHoursData } from "@/types/trading";

interface MarketHoursProps {
  data: MarketHoursData;
}

export function MarketHours({ data }: MarketHoursProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Market Sessions</h3>
      <div className="flex gap-3">
        {data.markets.map((m) => (
          <div
            key={m.name}
            className={`flex-1 rounded-xl p-3 transition-all ${
              m.open
                ? "bg-positive/5 border border-positive/20 shadow-[inset_0_1px_0_hsl(var(--positive)/0.1)]"
                : "bg-secondary/30 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{m.flag}</span>
              <div className={`h-1.5 w-1.5 rounded-full ${m.open ? "bg-positive animate-pulse-glow" : "bg-muted-foreground/30"}`} />
            </div>
            <p className={`text-[0.7rem] font-semibold mb-0.5 ${m.open ? "text-foreground" : "text-muted-foreground"}`}>
              {m.name.split("(")[0].trim()}
            </p>
            <p className="mono text-[0.6rem] text-muted-foreground">{m.hours}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
