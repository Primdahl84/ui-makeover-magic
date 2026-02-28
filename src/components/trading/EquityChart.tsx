import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EquityPoint {
  time: string;
  value: number;
}

interface EquityChartProps {
  data: EquityPoint[];
}

export function EquityChart({ data }: EquityChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No equity data available
      </div>
    );
  }

  const startVal = data[0].value;
  const endVal = data[data.length - 1].value;
  const isUp = endVal >= startVal;
  const change = endVal - startVal;
  const changePct = ((change / startVal) * 100).toFixed(2);

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl font-bold text-foreground mono">
          ${endVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        <span className={`text-sm font-semibold mono ${isUp ? "text-positive" : "text-negative"}`}>
          {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{changePct}%)
        </span>
        <span className="text-[0.6rem] text-muted-foreground">today</span>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? "hsl(var(--positive))" : "hsl(var(--negative))"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={isUp ? "hsl(var(--positive))" : "hsl(var(--negative))"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            width={60}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value: number) => [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Portfolio"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isUp ? "hsl(var(--positive))" : "hsl(var(--negative))"}
            strokeWidth={2}
            fill="url(#equityGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
