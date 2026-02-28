import { useState } from "react";
import { Navbar } from "@/components/trading/Navbar";
import { MarketHours } from "@/components/trading/MarketHours";
import { ScanBanner } from "@/components/trading/ScanBanner";
import { ControlPanel } from "@/components/trading/ControlPanel";
import { MetricsStrip } from "@/components/trading/MetricsStrip";
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
  { id: "overview", label: "Overview" },
  { id: "watchlist", label: "Watchlist" },
  { id: "charts", label: "Charts" },
  { id: "history", label: "History" },
  { id: "tax", label: "Tax" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [halted, setHalted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar status={mockScanStatus} />

      <div className="container px-6 py-6">
        <MarketHours data={mockMarketHours} />
        <ScanBanner status={mockScanStatus} />
        <ControlPanel
          halted={halted}
          onHalt={() => { if (confirm("Pause trading? The bot will stop scanning. Current positions stay open.")) setHalted(true); }}
          onResume={() => setHalted(false)}
          onSellAll={() => { if (confirm("Sell ALL open positions immediately and stop the bot?\n\nThis cannot be undone.")) setHalted(true); }}
        />

        {/* Tab bar */}
        <div className="flex gap-1 mb-5 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 pb-2.5 text-[0.82rem] font-semibold tracking-wide border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-secondary-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div>
            <MetricsStrip account={mockAccount} stats={mockStats} positions={mockPositions} />
            <MarketBreakdown stats={mockStats} positions={mockPositions} />
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Open Positions
                </div>
                <PositionsTable positions={mockPositions} onSell={(s) => alert(`Selling ${s}`)} />
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  AI Decisions Feed
                </div>
                <DecisionsFeed decisions={mockDecisions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="rounded-lg border border-border bg-card p-5">
            <WatchlistTable data={mockWatchlist} />
          </div>
        )}

        {activeTab === "charts" && (
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Position Charts
            </div>
            <div className="text-secondary-foreground text-center py-10 text-[0.85rem]">
              Charts require the TradingView lightweight-charts library connected to your bot's API.
              <br />
              <span className="text-muted-foreground text-[0.75rem]">Connect to localhost:5001 to see live candlestick charts.</span>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Trade History
            </div>
            <TradesHistory trades={mockTrades} />
          </div>
        )}

        {activeTab === "tax" && (
          <div className="rounded-lg border border-border bg-card p-5">
            <TaxPanel data={mockTax} />
          </div>
        )}

        <div className="text-center pt-6 pb-2 text-[0.6rem] tracking-widest text-border uppercase">
          AI Trading Bot · Paper Mode · Data: yFinance & Alpaca · Not Financial Advice
        </div>
      </div>
    </div>
  );
};

export default Index;
