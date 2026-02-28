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
