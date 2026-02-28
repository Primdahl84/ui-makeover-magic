import { useState } from "react";
import { Navbar } from "@/components/trading/Navbar";
import { HeroMetrics } from "@/components/trading/HeroMetrics";
import { MarketHours } from "@/components/trading/MarketHours";
import { MarketBreakdown } from "@/components/trading/MarketBreakdown";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { DecisionsFeed } from "@/components/trading/DecisionsFeed";
import { TradesHistory } from "@/components/trading/TradesHistory";
import { WatchlistTable } from "@/components/trading/WatchlistTable";
import { TaxPanel } from "@/components/trading/TaxPanel";
import {
  mockAccount, mockPositions, mockStats, mockDecisions,
  mockTrades, mockScanStatus, mockMarketHours, mockWatchlist, mockTax,
} from "@/data/mockData";

const TABS = [
  { id: "overview", label: "Overview", icon: "◎" },
  { id: "watchlist", label: "Watchlist", icon: "◉" },
  { id: "charts", label: "Charts", icon: "◇" },
  { id: "history", label: "History", icon: "☰" },
  { id: "tax", label: "Tax", icon: "⊞" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [halted, setHalted] = useState(false);

  return (
    <div className="min-h-screen bg-background noise">
      <Navbar
        status={mockScanStatus}
        halted={halted}
        onHalt={() => { if (confirm("Pause trading?")) setHalted(true); }}
        onResume={() => setHalted(false)}
        onSellAll={() => { if (confirm("Sell ALL and stop?")) setHalted(true); }}
      />

      <main className="max-w-[1600px] mx-auto px-8 py-6">
        {/* Tab bar — minimal pill style */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl bg-secondary/30 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Hero metrics bar */}
            <HeroMetrics account={mockAccount} stats={mockStats} positions={mockPositions} />

            {/* Bento grid: Markets + Positions + Decisions */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left column: Market hours + Market breakdown */}
              <div className="col-span-4 space-y-6">
                <MarketHours data={mockMarketHours} />
                <MarketBreakdown stats={mockStats} positions={mockPositions} />
              </div>

              {/* Center: Positions */}
              <div className="col-span-5">
                <div className="glass rounded-2xl p-6 h-full">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Open Positions</h3>
                  <PositionsTable positions={mockPositions} onSell={(s) => alert(`Selling ${s}`)} />
                </div>
              </div>

              {/* Right: AI Decisions */}
              <div className="col-span-3">
                <div className="glass rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-5 w-5 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-xs">🤖</span>
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Decisions</h3>
                  </div>
                  <DecisionsFeed decisions={mockDecisions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── WATCHLIST ── */}
        {activeTab === "watchlist" && (
          <div className="glass rounded-2xl p-6">
            <WatchlistTable data={mockWatchlist} />
          </div>
        )}

        {/* ── CHARTS ── */}
        {activeTab === "charts" && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-1">Position Charts</h3>
              <p className="text-[0.65rem] text-muted-foreground mb-6">Live candlestick charts for your open positions</p>
              {mockPositions.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {mockPositions.map((p) => {
                    const isUp = p.unrealized_pl >= 0;
                    return (
                      <div key={p.symbol} className="rounded-xl bg-secondary/30 border border-border/30 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-lg">{p.symbol}</span>
                            <span className={`text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-md ${
                              p.market === "US" ? "bg-primary/10 text-primary" :
                              p.market === "EU" ? "bg-info/10 text-info" :
                              "bg-warning/10 text-warning"
                            }`}>{p.market}</span>
                          </div>
                          <span className={`mono text-sm font-bold ${isUp ? "text-positive" : "text-negative"}`}>
                            {isUp ? "+" : ""}{formatCurrency(p.unrealized_pl)}
                          </span>
                        </div>
                        {/* Chart placeholder */}
                        <div className="h-48 rounded-lg bg-background/50 border border-border/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-2">
                              {[40, 55, 45, 60, 50, 65, 58, 70, 62, 75, 68, 72].map((h, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 rounded-sm ${i > 8 ? "bg-positive/60" : i > 5 ? "bg-positive/30" : "bg-muted-foreground/20"}`}
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>
                            <p className="text-[0.6rem] text-muted-foreground">Connect to API for live charts</p>
                          </div>
                        </div>
                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="text-center">
                            <p className="text-[0.55rem] text-muted-foreground uppercase">Entry</p>
                            <p className="mono text-sm font-medium text-info">{formatCurrency(p.avg_entry_price)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[0.55rem] text-muted-foreground uppercase">Current</p>
                            <p className="mono text-sm font-medium text-warning">{formatCurrency(p.current_price)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[0.55rem] text-muted-foreground uppercase">Stop −3%</p>
                            <p className="mono text-sm font-medium text-negative">{formatCurrency(p.avg_entry_price * 0.97)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">No open positions</div>
              )}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {activeTab === "history" && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Trade History</h3>
            <TradesHistory trades={mockTrades} />
          </div>
        )}

        {/* ── TAX ── */}
        {activeTab === "tax" && (
          <div className="glass rounded-2xl p-6">
            <TaxPanel data={mockTax} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4 text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground/30">
          TradingBot · Paper Mode · Not Financial Advice
        </div>
      </main>
    </div>
  );
};

export default Index;
