# TradingBot Dashboard — UI Architecture & Design Specification

> **Purpose**: This document describes the complete UI design system, component architecture, and layout specification for Claude Code (or any AI tool) to replicate the Lovable-built dashboard in the existing Flask+React trading bot project.

---

## 1. Design System

### 1.1 Color Palette (HSL, dark-only theme)

```css
:root {
  /* Core */
  --background: 240 15% 5%;        /* Near-black with blue tint */
  --foreground: 0 0% 95%;          /* Off-white text */
  --card: 240 12% 8%;              /* Slightly lighter dark */
  --card-foreground: 0 0% 95%;

  /* Brand */
  --primary: 165 80% 48%;          /* Teal/cyan — main accent */
  --primary-foreground: 240 15% 5%;
  --accent: 270 60% 60%;           /* Purple — secondary accent */
  --accent-foreground: 0 0% 95%;

  /* Surface */
  --secondary: 240 10% 12%;        /* Panel backgrounds */
  --secondary-foreground: 240 5% 55%;
  --muted: 240 10% 14%;
  --muted-foreground: 240 5% 40%;

  /* Semantic */
  --positive: 165 80% 48%;         /* Green/teal for gains */
  --negative: 0 85% 62%;           /* Red for losses */
  --warning: 45 95% 55%;           /* Amber for warnings */
  --info: 215 80% 60%;             /* Blue for info */
  --destructive: 0 72% 55%;

  /* Borders */
  --border: 240 10% 14%;
  --input: 240 10% 14%;
  --ring: 165 80% 48%;
  --radius: 1rem;
}
```

### 1.2 Typography

- **Display/Headings**: `Space Grotesk` (weights: 400, 500, 600, 700)
- **Monospace (numbers, prices, code)**: `IBM Plex Mono` (weights: 400, 500, 600)
- Import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap`
- Use `.mono` class for all financial numbers, timestamps, prices
- Labels use `text-[0.55rem]` to `text-[0.65rem]`, uppercase, `tracking-wider`

### 1.3 Glass Card Effect

Every panel uses this "glassmorphic" style:

```css
.glass {
  background: linear-gradient(135deg, hsl(240 12% 9% / 0.8), hsl(240 12% 6% / 0.6));
  backdrop-filter: blur(20px);
  border: 1px solid hsl(240 10% 18% / 0.5);
}
```

Applied with Tailwind: `className="glass rounded-2xl p-6"`

### 1.4 Glow Effects

```css
.glow-green { box-shadow: 0 0 12px hsl(var(--positive) / 0.4), 0 0 4px hsl(var(--positive) / 0.2); }
.glow-red { box-shadow: 0 0 12px hsl(var(--negative) / 0.4), 0 0 4px hsl(var(--negative) / 0.2); }
```

### 1.5 Gradient Border (Hero Card)

```css
.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.2), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
```

### 1.6 Animations

- `animate-pulse-glow`: Pulsing green dot for live status indicators
- `animate-float`: Gentle vertical bob for floating elements
- `animate-scan-pulse`: Opacity pulse for scanning indicators
- `noise::after`: Subtle noise texture overlay on body

### 1.7 Custom Scrollbar

Thin 5px scrollbar with primary color thumb, transparent track.

---

## 2. Layout Architecture

### 2.1 Page Structure

```
<div class="min-h-screen bg-background noise">
  <Navbar />                          <!-- Sticky top, glass effect -->
  <main class="max-w-[1600px] mx-auto px-8 py-6">
    <TabBar />                        <!-- Pill-style tab selector -->
    <TabContent />                    <!-- Active tab content -->
    <Footer />                        <!-- Minimal footer -->
  </main>
</div>
```

### 2.2 Tab System

5 tabs: **Overview** | **Watchlist** | **Charts** | **History** | **Tax**

Tab bar styling: `p-1 rounded-2xl bg-secondary/30 w-fit`
Active tab: `bg-primary text-primary-foreground shadow-lg shadow-primary/20`
Inactive: `text-muted-foreground hover:text-foreground hover:bg-secondary/50`

### 2.3 Overview Tab — Bento Grid Layout

```
Row 1: HeroMetrics (full width, glass + gradient-border)
        ├── Col 4/12: Portfolio value (large mono number)
        ├── Col 5/12: 6-cell stats grid (Cash, Realized P&L, Unrealized P&L, Total P&L, Positions, Trades)
        └── Col 3/12: Radial SVG gauge (win rate) + W/L counts

Row 2: 12-column grid, items-stretch
        ├── Col 5/12: Open Positions table + Pending Orders (stacked, space-y-6)
        ├── Col 4/12: AI Decisions feed (scrollable, flex-1 overflow-y-auto)
        └── Col 3/12: Market Sessions + Market Breakdown (stacked)

Row 3: 12-column grid, items-stretch
        ├── Col 5/12: Equity chart (Recharts AreaChart)
        └── Col 7/12: Risk & Exposure panel
```

---

## 3. Component Specifications

### 3.1 Navbar (`Navbar.tsx`)

- Sticky top, `glass` background, `border-b border-border/30`
- **Left**: Logo (gradient teal→purple square with ⚡) + status dot + "TradingBot" title
- **Center**: Scanning indicator (animated dot + ticker name + progress) + Market open/closed status
- **Right**: Control buttons (Pause/Resume/Sell All) + Live clock (Copenhagen timezone, mono font)

### 3.2 HeroMetrics (`HeroMetrics.tsx`)

- Full-width `glass rounded-2xl p-8 gradient-border`
- Portfolio value: `text-4xl font-bold mono`
- Quick stats: 3×2 grid of small cards (`bg-secondary/40 border border-border/30 rounded-xl`)
- Radial gauge: SVG circle, `stroke-dasharray/offset` animation, teal color

### 3.3 PositionsTable (`PositionsTable.tsx`)

- Clean table with minimal headers (`text-[0.6rem] uppercase tracking-wider`)
- Row hover: `hover:bg-secondary/30`
- Market badges: Color-coded pills (US=teal, EU=blue, DK=amber)
- Sell button: Hidden by default, `opacity-0 group-hover:opacity-100`
- P&L: Green for positive, red for negative (using `pnlColorClass()`)

### 3.4 PendingOrders (`PendingOrders.tsx`)

- Card-style rows: `rounded-xl bg-secondary/20 border border-border/20 p-3`
- Order type badges: Color-coded (limit_buy=green, stop_loss=amber, take_profit=blue)
- Cancel button: Hidden until hover, red themed

### 3.5 DecisionsFeed (`DecisionsFeed.tsx`)

- Shows latest decision per ticker (deduped)
- Action pills: BUY (green border+text), SELL (red), HOLD (purple/accent)
- Confidence bar: Horizontal progress bar (green ≥7, amber ≥5, red <5)
- Scrollable container with `max-h-[450px] overflow-y-auto`

### 3.6 MarketHours (`MarketHours.tsx`)

- 2×2 grid of market cards
- Open markets: `bg-positive/5 border border-positive/20` + pulsing green dot
- Closed markets: `bg-secondary/30` + dim grey dot

### 3.7 MarketBreakdown (`MarketBreakdown.tsx`)

- Stacked cards per active market
- Gradient backgrounds per market (US=teal, EU=blue, DK=amber)
- Shows W/L record, win rate, total P&L

### 3.8 EquityChart (`EquityChart.tsx`)

- Uses Recharts `AreaChart` with gradient fill
- Green gradient when up, red when down
- Summary: Current value (2xl mono bold) + change + percentage
- Chart height: 120px

### 3.9 RiskPanel (`RiskPanel.tsx`)

- **Key metrics row**: Invested / Cash / Unrealized (horizontal, divided by border lines)
- **Allocation bar**: Segmented rounded bar showing market allocation percentages
- **Concentration**: Per-position progress bars (red >30%, amber >15%, teal otherwise)
- **Worst position**: Red bordered alert card

### 3.10 WatchlistTable (`WatchlistTable.tsx`)

- 2-column grid layout
- Each row: rank number + ticker + price + company name + score bar
- Score bar: Color-coded (green ≥7, amber ≥5, red <5)

### 3.11 TradesHistory (`TradesHistory.tsx`)

- Reversed chronological order
- Each row: timestamp + colored vertical bar (green=BUY, red=SELL) + ticker + qty×price + P&L
- Scrollable with `max-h-[600px]`

### 3.12 TaxPanel (`TaxPanel.tsx`)

- Header with "Download SKAT CSV" button
- 4-column summary grid: Net Gain USD, Net Gain DKK, Estimated Tax, Net After Tax
- Closed trades detail list below

---

## 4. TypeScript Types (`src/types/trading.ts`)

```typescript
interface AccountData {
  portfolio_value: number;
  cash: number;
  buying_power: number;
  starting_value: number;
  portfolio_change: number;
}

interface Position {
  symbol: string;
  qty: string;
  avg_entry_price: number;
  current_price: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  market: string;       // "US" | "EU" | "DK" | "JP" | "IN" | "TW" | "CA"
  company: string;
  country: string;
}

interface StatsData {
  total_trades: number;
  buys: number;
  sells: number;
  realized_pnl: number;
  wins: number;
  losses: number;
  win_rate: number;
  pnl_per_ticker: Record<string, number>;
  by_market: Record<string, MarketStats>;
}

interface MarketStats {
  wins: number;
  losses: number;
  pnl: number;
  win_rate: number;
}

interface Decision {
  timestamp: string;
  ticker: string;
  company_name: string;
  sector: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;     // 1-10
  key_signal: string;
  reasoning: string;
  price: number;
  executed: boolean;
}

interface Trade {
  timestamp: string;
  ticker: string;
  action: "BUY" | "SELL";
  qty: number;
  price: number;
  order_id: string;
  realized_pnl: number | null;
}

interface ScanStatus {
  scanning: boolean;
  phase: string | null;
  ticker: string;
  company_name: string;
  index: number;
  total: number;
  last_scan: string;
  market_open?: boolean;
  eu_session_active?: boolean;
}

interface MarketHour {
  name: string;
  flag: string;
  open: boolean;
  hours: string;
  hours_cet: string;
  status: string;
}

interface MarketHoursData {
  cph_time: string;
  markets: MarketHour[];
}

interface WatchlistScore {
  ticker: string;
  score: number;
  price: number;
  company_name: string;
  sector: string;
}

interface WatchlistData {
  date: string;
  phase: string;
  scored_at: string;
  total_scanned: number;
  tickers: string[];
  all_scores: WatchlistScore[];
}

interface TaxTrade {
  ticker: string;
  buy_date: string;
  sell_date: string;
  qty: number;
  buy_price_usd: number;
  sell_price_usd: number;
  gain_usd: number;
  usd_dkk_rate: number;
  gain_dkk: number;
}

interface TaxYear {
  gains_usd: number;
  losses_usd: number;
  net_usd: number;
  net_dkk: number;
  tax_dkk: number;
  tax_usd: number;
  bracket: string;
  gain_usd: number;
  gain_dkk: number;
  tax_high?: number;
  trades: TaxTrade[];
}

type TaxData = Record<string, TaxYear>;

interface PendingOrder {
  id: string;
  symbol: string;
  type: "limit_buy" | "limit_sell" | "stop_loss" | "take_profit";
  qty: number;
  target_price: number;
  current_price?: number;
  created_at: string;
}

interface EquityPoint {
  time: string;
  value: number;
}
```

---

## 5. Utility Functions (`src/lib/trading-utils.ts`)

```typescript
function formatCurrency(val: number | null | undefined, decimals = 2): string
  // Returns "$1,234.56" format, "—" for null

function formatPnl(val: number): string
  // Returns "+$1,234.56" or "-$1,234.56"

function formatDate(iso: string): string
  // Returns "Feb 28 10:14 AM"

function formatDKK(val: number): string
  // Returns "+ kr. 1.234,56" (Danish format)

function pnlColorClass(val: number): string
  // Returns "text-positive" or "text-negative"

const MARKET_FLAGS: Record<string, string>
  // { US: "🇺🇸", EU: "🇪🇺", DK: "🇩🇰", JP: "🇯🇵", IN: "🇮🇳", TW: "🇹🇼", CA: "🇨🇦" }
```

---

## 6. Key Dependencies

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + `tailwindcss-animate`
- **Recharts** — for EquityChart (AreaChart)
- **shadcn/ui** components (toast system)
- **Google Fonts**: Space Grotesk + IBM Plex Mono

---

## 7. Design Principles

1. **Dark-only** — No light mode. Deep blue-black backgrounds.
2. **Glassmorphism** — All cards use `glass` class with backdrop blur.
3. **Monospace for data** — All prices, numbers, timestamps use IBM Plex Mono.
4. **Semantic colors** — Never hardcode colors. Use `text-positive`, `text-negative`, `text-warning`, `text-info`, `bg-primary`, etc.
5. **Micro labels** — Section headers are `text-[0.55rem]-[0.65rem] uppercase tracking-wider text-muted-foreground`.
6. **Hover reveals** — Action buttons (Sell, Cancel) are `opacity-0 group-hover:opacity-100`.
7. **Pill badges** — Market tags, action types use small rounded pills with `bg-{color}/10 text-{color} border border-{color}/20`.
8. **Noise overlay** — Subtle SVG noise texture on body via `.noise::after`.
9. **Max width 1600px** — Content centered with `px-8` horizontal padding.
10. **Bento grid** — 12-column CSS grid for flexible, aligned layouts.

---

## 8. API Integration Notes

The Flask backend serves data at `localhost:5001`. The dashboard should fetch from these endpoints and map responses to the TypeScript types above:

- `GET /api/account` → `AccountData`
- `GET /api/positions` → `Position[]`
- `GET /api/stats` → `StatsData`
- `GET /api/decisions` → `Decision[]`
- `GET /api/trades` → `Trade[]`
- `GET /api/scan-status` → `ScanStatus`
- `GET /api/market-hours` → `MarketHoursData`
- `GET /api/watchlist` → `WatchlistData`
- `GET /api/tax` → `TaxData`
- `GET /api/pending-orders` → `PendingOrder[]`
- `GET /api/equity` → `EquityPoint[]`
- `POST /api/halt` — Pause trading
- `POST /api/resume` — Resume trading
- `POST /api/sell-all` — Sell all positions
- `POST /api/sell/:symbol` — Sell specific position
- `POST /api/cancel-order/:id` — Cancel pending order

Poll data every 5 seconds using React Query or setInterval.
