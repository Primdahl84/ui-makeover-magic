import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/trading-utils";
import { Navbar } from "@/components/trading/Navbar";
import { HeroMetrics } from "@/components/trading/HeroMetrics";
import { MarketHours } from "@/components/trading/MarketHours";
import { MarketBreakdown } from "@/components/trading/MarketBreakdown";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { DecisionsFeed } from "@/components/trading/DecisionsFeed";
import { TradesHistory } from "@/components/trading/TradesHistory";
import { WatchlistTable } from "@/components/trading/WatchlistTable";
import { TaxPanel } from "@/components/trading/TaxPanel";
import { EquityChart } from "@/components/trading/EquityChart";
import { RiskPanel } from "@/components/trading/RiskPanel";
import { PendingOrders } from "@/components/trading/PendingOrders";
import { toast } from "@/hooks/use-toast";
import {
  mockAccount, mockPositions, mockStats, mockDecisions,
  mockTrades, mockScanStatus, mockMarketHours, mockWatchlist, mockTax,
  mockPendingOrders, mockEquity,
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
  const [pendingOrders, setPendingOrders] = useState(mockPendingOrders);

  // Demo notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "🟢 Trade Executed",
        description: "BUY 3x AAPL @ $267.89 — filled",
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
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

            {/* Bento grid: Positions + Decisions on top */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Positions + Pending Orders */}
              <div className="col-span-5 space-y-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Open Positions</h3>
                  <PositionsTable positions={mockPositions} onSell={(s) => {
                    toast({ title: "📤 Sell Order", description: `Selling all ${s} shares...` });
                  }} />
                </div>
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Orders</h3>
                    <span className="text-[0.55rem] mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">{pendingOrders.length} active</span>
                  </div>
                  <PendingOrders orders={pendingOrders} onCancel={(id) => {
                    setPendingOrders(prev => prev.filter(o => o.id !== id));
                    toast({ title: "❌ Order Cancelled", description: `Order ${id} removed` });
                  }} />
                </div>
              </div>

              {/* Center: AI Decisions */}
              <div className="col-span-4">
                <div className="glass rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-5 w-5 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-xs">🤖</span>
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Decisions</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <DecisionsFeed decisions={mockDecisions} />
                  </div>
                </div>
              </div>

              {/* Right: Market hours + Market breakdown */}
              <div className="col-span-3 space-y-6">
                <MarketHours data={mockMarketHours} />
                <MarketBreakdown stats={mockStats} positions={mockPositions} />
              </div>
            </div>

            {/* Secondary row: Equity + Risk — equal height */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
              <div className="col-span-5 flex">
                <div className="glass rounded-2xl p-5 flex flex-col w-full">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Equity — Today</h3>
                  <div className="flex-1 flex flex-col justify-center">
                    <EquityChart data={mockEquity} />
                  </div>
                </div>
              </div>
              <div className="col-span-7 flex">
                <div className="glass rounded-2xl p-6 flex flex-col w-full">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Risk & Exposure</h3>
                  <div className="flex-1">
                    <RiskPanel positions={mockPositions} portfolioValue={mockAccount.portfolio_value} />
                  </div>
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
