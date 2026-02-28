import type { MarketHoursData } from "@/types/trading";

interface MarketHoursProps {
  data: MarketHoursData;
}

export function MarketHours({ data }: MarketHoursProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-3">
      <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Market Hours — Copenhagen Time (CET/CEST)
      </div>
      <div className="grid grid-cols-5 gap-3">
        {data.markets.map((m) => (
          <div
            key={m.name}
            className={`rounded-[0.6rem] border p-3.5 transition-colors ${
              m.open ? "border-positive/30 bg-background" : "border-border bg-background"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-lg leading-none">{m.flag}</span>
              <span className={`text-[0.74rem] font-semibold flex-1 leading-tight ${
                m.open ? "text-foreground" : "text-secondary-foreground"
              }`}>
                {m.name}
              </span>
              <span
                className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${
                  m.open ? "bg-positive animate-pulse-glow shadow-[0_0_7px_hsl(var(--positive)/0.4)]" : "bg-muted-foreground"
                }`}
              />
            </div>
            <div className="mono text-[0.62rem] text-secondary-foreground mb-1.5">{m.hours} CET</div>
            <div className={`text-[0.7rem] font-semibold ${m.open ? "text-positive" : "text-muted-foreground"}`}>
              {m.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
