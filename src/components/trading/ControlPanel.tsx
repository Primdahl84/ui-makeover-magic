import { useState } from "react";

interface ControlPanelProps {
  halted: boolean;
  onHalt: () => void;
  onResume: () => void;
  onSellAll: () => void;
}

export function ControlPanel({ halted, onHalt, onResume, onSellAll }: ControlPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-3 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
          halted ? "bg-negative" : "bg-positive"
        }`} />
        <div>
          <div className={`text-[0.85rem] font-bold ${halted ? "text-negative" : "text-foreground"}`}>
            {halted ? "Bot Halted" : "Bot Active"}
          </div>
          <div className="text-[0.62rem] text-muted-foreground mt-0.5">
            {halted ? "All trading paused — click Resume to restart" : "Scanning and trading normally"}
          </div>
        </div>
      </div>
      <div className="flex gap-2.5">
        {!halted && (
          <>
            <button
              onClick={onHalt}
              className="rounded-md border border-primary/50 bg-secondary px-4 py-2 text-[0.8rem] font-semibold text-info hover:bg-secondary/80 transition-colors"
            >
              ⏸ Pause Trading
            </button>
            <button
              onClick={onSellAll}
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-[0.8rem] font-semibold text-negative hover:bg-destructive/20 transition-colors"
            >
              ⚡ Sell All & Stop
            </button>
          </>
        )}
        {halted && (
          <button
            onClick={onResume}
            className="rounded-md border border-positive/50 bg-positive/10 px-4 py-2 text-[0.8rem] font-semibold text-positive hover:bg-positive/20 transition-colors"
          >
            ▶ Resume Trading
          </button>
        )}
      </div>
    </div>
  );
}
