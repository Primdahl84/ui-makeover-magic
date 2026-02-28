import { useState, useEffect } from "react";
import type { ScanStatus } from "@/types/trading";
import { mockScanStatus } from "@/data/mockData";

interface NavbarProps {
  status: ScanStatus;
}

export function Navbar({ status }: NavbarProps) {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/Copenhagen", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      });
      setClock(t);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const isOpen = status.market_open;
  const isEU = status.eu_session_active;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-[58px] items-center justify-between px-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-primary to-info text-lg">
            📈
          </div>
          <div>
            <div className="text-base font-bold text-foreground tracking-tight">AI Trading Bot</div>
            <div className="text-[0.58rem] font-bold uppercase tracking-widest text-muted-foreground">
              Alpaca Paper Mode
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                isOpen ? "bg-positive animate-pulse-glow shadow-[0_0_8px_hsl(var(--positive)/0.5)]"
                : isEU ? "bg-warning animate-pulse-glow shadow-[0_0_8px_hsl(var(--warning)/0.5)]"
                : "bg-muted-foreground"
              }`}
            />
            <span className={`text-[0.78rem] ${
              isOpen ? "text-positive" : isEU ? "text-warning" : "text-muted-foreground"
            }`}>
              {isOpen ? "US Market Open" : isEU ? "EU Extended Hours" : "All Markets Closed"}
            </span>
          </div>
          <div className="text-right">
            <div className="mono text-base font-semibold text-foreground tracking-wider">{clock}</div>
            <div className="text-[0.58rem] uppercase tracking-widest text-muted-foreground mt-0.5">
              Copenhagen · CET
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
