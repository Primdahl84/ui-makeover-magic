export interface AccountData {
  portfolio_value: number;
  cash: number;
  buying_power: number;
  starting_value: number;
  portfolio_change: number;
}

export interface Position {
  symbol: string;
  qty: string;
  avg_entry_price: number;
  current_price: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  market: string;
  company: string;
  country: string;
}

export interface MarketStats {
  wins: number;
  losses: number;
  pnl: number;
  win_rate: number;
}

export interface StatsData {
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

export interface Decision {
  timestamp: string;
  ticker: string;
  company_name: string;
  sector: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  key_signal: string;
  reasoning: string;
  price: number;
  executed: boolean;
}

export interface Trade {
  timestamp: string;
  ticker: string;
  action: "BUY" | "SELL";
  qty: number;
  price: number;
  order_id: string;
  realized_pnl: number | null;
}

export interface ScanStatus {
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

export interface MarketHour {
  name: string;
  flag: string;
  open: boolean;
  hours: string;
  hours_cet: string;
  status: string;
}

export interface MarketHoursData {
  cph_time: string;
  markets: MarketHour[];
}

export interface WatchlistScore {
  ticker: string;
  score: number;
  price: number;
  company_name: string;
  sector: string;
}

export interface WatchlistData {
  date: string;
  phase: string;
  scored_at: string;
  total_scanned: number;
  tickers: string[];
  all_scores: WatchlistScore[];
}

export interface TaxTrade {
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

export interface TaxYear {
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

export type TaxData = Record<string, TaxYear>;

export interface PendingOrder {
  id: string;
  symbol: string;
  type: "limit_buy" | "limit_sell" | "stop_loss" | "take_profit";
  qty: number;
  target_price: number;
  current_price?: number;
  created_at: string;
}

export interface EquityPoint {
  time: string;
  value: number;
}
