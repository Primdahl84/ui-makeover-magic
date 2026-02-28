import { useState, useEffect } from "react";
import type { ScanStatus } from "@/types/trading";

interface NavbarProps {
  status: ScanStatus;
  halted: boolean;
  onHalt: () => void;
  onResume: () => void;
  onSellAll: () => void;
}

export function Navbar({ status, halted, onHalt, onResume, onSellAll }: NavbarProps) {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      setClock(new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/Copenhagen", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const isOpen = status.market_open;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              ⚡
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
              halted ? "bg-negative" : "bg-positive"
            } ${!halted && "animate-pulse-glow"}`} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">TradingBot</h1>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">Paper · Alpaca</p>
          </div>
        </div>

        {/* Center: Status */}
        <div className="flex items-center gap-6">
          {status.scanning && (
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-warning/5 border border-warning/20">
              <div className="h-2 w-2 rounded-full bg-warning animate-scan-pulse" />
              <span className="text-xs font-medium text-warning">
                Scanning {status.ticker}
              </span>
              <span className="text-[0.65rem] mono text-warning/60">{status.index}/{status.total}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isOpen ? "bg-positive animate-pulse-glow" : "bg-muted-foreground"}`} />
            <span className={`text-xs font-medium ${isOpen ? "text-positive" : "text-muted-foreground"}`}>
              {isOpen ? "Markets Open" : "Markets Closed"}
            </span>
          </div>
        </div>

        {/* Right: Clock + Controls */}
        <div className="flex items-center gap-5">
          <div className="flex gap-2">
            {!halted ? (
              <>
                <button onClick={onHalt} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/50 transition-all hover:border-warning/30">
                  ⏸ Pause
                </button>
                <button onClick={onSellAll} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-negative/10 hover:bg-negative/20 text-negative border border-negative/20 transition-all">
                  ⚡ Sell All
                </button>
              </>
            ) : (
              <button onClick={onResume} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-positive/10 hover:bg-positive/20 text-positive border border-positive/20 transition-all">
                ▶ Resume
              </button>
            )}
          </div>
          <div className="text-right pl-5 border-l border-border/30">
            <div className="mono text-lg font-semibold text-foreground tracking-widest">{clock}</div>
            <div className="text-[0.55rem] uppercase tracking-[0.15em] text-muted-foreground">Copenhagen</div>
          </div>
        </div>
      </div>
    </header>
  );
}
