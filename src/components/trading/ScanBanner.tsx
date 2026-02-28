import type { ScanStatus } from "@/types/trading";

interface ScanBannerProps {
  status: ScanStatus;
}

export function ScanBanner({ status }: ScanBannerProps) {
  const isScanning = status.scanning;
  const pct = status.total ? Math.round((status.index / status.total) * 100) : 0;
  const isPremarket = status.phase === "premarket";

  return (
    <div className={`rounded-lg border p-3 px-5 mb-3 ${
      isScanning ? "border-warning/30 bg-warning/5" : "border-border bg-card/50"
    }`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`text-base ${isScanning ? "text-warning animate-spin-slow" : "text-positive"}`}>
            {isScanning ? "⟳" : "✓"}
          </span>
          <span className={`text-[0.7rem] font-bold uppercase tracking-widest ${
            isScanning ? "text-warning" : "text-muted-foreground"
          }`}>
            {isScanning ? (isPremarket ? "Pre-market scan" : "Scanning") : "Idle"}
          </span>
          {isScanning && (
            <span className="text-warning font-semibold text-[0.85rem]">
              {status.ticker}{status.company_name ? ` · ${status.company_name}` : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[0.7rem] ${isScanning ? "text-warning/80" : "text-muted-foreground"}`}>
            {isScanning
              ? `${status.index} / ${status.total}`
              : status.last_scan
                ? `Last scan: ${new Date(status.last_scan).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "No scan yet"
            }
          </span>
          <div className="w-[130px] h-[5px] rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-400 ${isScanning ? "bg-warning" : "bg-positive"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
