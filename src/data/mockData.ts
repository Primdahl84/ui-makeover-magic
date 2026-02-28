import type {
  AccountData, Position, StatsData, Decision, Trade,
  ScanStatus, MarketHoursData, WatchlistData, TaxData,
  PendingOrder, EquityPoint,
} from "@/types/trading";

export const mockAccount: AccountData = {
  portfolio_value: 99930.31,
  cash: 82977.70,
  buying_power: 82977.70,
  starting_value: 100000.00,
  portfolio_change: -69.69,
};

export const mockPositions: Position[] = [
  { symbol: "AAPL", qty: "3", avg_entry_price: 267.89, current_price: 264.18, unrealized_pl: -11.14, unrealized_plpc: -0.0139, market: "US", company: "Apple Inc.", country: "United States" },
  { symbol: "SHEL", qty: "12", avg_entry_price: 82.76, current_price: 83.51, unrealized_pl: 9.00, unrealized_plpc: 0.0091, market: "EU", company: "Shell plc", country: "United Kingdom" },
  { symbol: "NVDA", qty: "5", avg_entry_price: 870.50, current_price: 875.20, unrealized_pl: 23.50, unrealized_plpc: 0.0054, market: "US", company: "NVIDIA Corp.", country: "United States" },
  { symbol: "NOVO-B.CO", qty: "8", avg_entry_price: 725.00, current_price: 718.30, unrealized_pl: -53.60, unrealized_plpc: -0.0092, market: "DK", company: "Novo Nordisk", country: "Denmark" },
];

export const mockStats: StatsData = {
  total_trades: 39,
  buys: 20,
  sells: 19,
  realized_pnl: -30.01,
  wins: 3,
  losses: 7,
  win_rate: 30.0,
  pnl_per_ticker: { AAPL: -12.50, MSFT: 4.20, SHEL: -8.00, NVDA: 15.30 },
  by_market: {
    US: { wins: 1, losses: 4, pnl: -8.82, win_rate: 20.0 },
    EU: { wins: 1, losses: 3, pnl: -12.78, win_rate: 25.0 },
    DK: { wins: 1, losses: 0, pnl: 1.62, win_rate: 100.0 },
    JP: { wins: 0, losses: 0, pnl: 0.0, win_rate: 0.0 },
    IN: { wins: 0, losses: 0, pnl: 0.0, win_rate: 0.0 },
    TW: { wins: 0, losses: 0, pnl: 0.0, win_rate: 0.0 },
    CA: { wins: 0, losses: 0, pnl: 0.0, win_rate: 0.0 },
  },
};

export const mockDecisions: Decision[] = [
  { timestamp: "2026-02-28T10:14:22.123456", ticker: "AAPL", company_name: "Apple Inc.", sector: "Technology", action: "BUY", confidence: 7, key_signal: "MACD crossover with volume surge", reasoning: "RSI at 42, MACD turning bullish", price: 267.89, executed: true },
  { timestamp: "2026-02-28T10:12:05.000000", ticker: "NVDA", company_name: "NVIDIA Corp.", sector: "Technology", action: "BUY", confidence: 8, key_signal: "Breaking above resistance with strong momentum", reasoning: "Volume 2.1x average, RSI 58", price: 870.50, executed: true },
  { timestamp: "2026-02-28T10:08:33.000000", ticker: "MSFT", company_name: "Microsoft Corp.", sector: "Technology", action: "HOLD", confidence: 5, key_signal: "Consolidating near support", reasoning: "Low volume, waiting for breakout", price: 415.20, executed: false },
  { timestamp: "2026-02-28T09:55:11.000000", ticker: "SHEL", company_name: "Shell plc", sector: "Energy", action: "BUY", confidence: 6, key_signal: "Oil price rally supporting energy stocks", reasoning: "Sector momentum positive", price: 82.76, executed: true },
  { timestamp: "2026-02-28T09:45:00.000000", ticker: "TSLA", company_name: "Tesla Inc.", sector: "Automotive", action: "SELL", confidence: 9, key_signal: "Death cross on 50/200 MA", reasoning: "Bearish divergence on RSI", price: 195.40, executed: true },
  { timestamp: "2026-02-28T09:30:00.000000", ticker: "NOVO-B.CO", company_name: "Novo Nordisk", sector: "Healthcare", action: "BUY", confidence: 7, key_signal: "Gap up on earnings beat", reasoning: "Strong guidance, GLP-1 demand", price: 725.00, executed: true },
];

export const mockTrades: Trade[] = [
  { timestamp: "2026-02-28T10:14:22.000000", ticker: "AAPL", action: "BUY", qty: 3, price: 267.89, order_id: "abc123", realized_pnl: null },
  { timestamp: "2026-02-28T10:12:05.000000", ticker: "NVDA", action: "BUY", qty: 5, price: 870.50, order_id: "abc124", realized_pnl: null },
  { timestamp: "2026-02-28T09:55:11.000000", ticker: "SHEL", action: "BUY", qty: 12, price: 82.76, order_id: "abc125", realized_pnl: null },
  { timestamp: "2026-02-28T09:45:00.000000", ticker: "TSLA", action: "SELL", qty: 10, price: 195.40, order_id: "def456", realized_pnl: -18.50 },
  { timestamp: "2026-02-28T09:30:00.000000", ticker: "NOVO-B.CO", action: "BUY", qty: 8, price: 725.00, order_id: "abc126", realized_pnl: null },
  { timestamp: "2026-02-27T15:30:00.000000", ticker: "MSFT", action: "SELL", qty: 2, price: 415.20, order_id: "def457", realized_pnl: 4.20 },
  { timestamp: "2026-02-27T14:00:00.000000", ticker: "AMZN", action: "BUY", qty: 4, price: 186.50, order_id: "abc127", realized_pnl: null },
  { timestamp: "2026-02-27T11:00:00.000000", ticker: "AMZN", action: "SELL", qty: 4, price: 185.10, order_id: "def458", realized_pnl: -5.60 },
];

export const mockScanStatus: ScanStatus = {
  scanning: true,
  phase: "ai_scan",
  ticker: "NVDA",
  company_name: "NVIDIA Corp.",
  index: 12,
  total: 80,
  last_scan: "2026-02-28T10:01:05.123456",
  market_open: true,
  eu_session_active: false,
};

export const mockMarketHours: MarketHoursData = {
  cph_time: "15:42",
  markets: [
    { name: "US (NYSE/Nasdaq)", flag: "🇺🇸", open: true, hours: "15:30–22:00", hours_cet: "15:30–22:00", status: "Open" },
    { name: "LSE (London)", flag: "🇬🇧", open: false, hours: "09:00–17:30", hours_cet: "09:00–17:30", status: "Closed" },
    { name: "XETRA (Frankfurt)", flag: "🇩🇪", open: false, hours: "09:00–17:30", hours_cet: "09:00–17:30", status: "Closed" },
    { name: "Euronext", flag: "🇪🇺", open: false, hours: "09:00–17:30", hours_cet: "09:00–17:30", status: "Closed" },
    { name: "Nasdaq CPH", flag: "🇩🇰", open: false, hours: "09:00–17:00", hours_cet: "09:00–17:00", status: "Closed" },
  ],
};

export const mockWatchlist: WatchlistData = {
  date: "2026-02-28",
  phase: "premarket",
  scored_at: "2026-02-28T08:45:00.000000",
  total_scanned: 542,
  tickers: [
    "NVDA", "AAPL", "MSFT", "TSLA", "AMZN", "META", "GOOGL", "AMD", "AVGO", "CRM",
    "NFLX", "ORCL", "ADBE", "INTC", "QCOM", "MU", "AMAT", "LRCX", "KLAC", "MRVL",
    "SHEL", "BP", "TTE", "EQNR", "RIO", "BHP", "GLEN", "HSBA", "AZN", "ULVR",
    "NOVO-B.CO", "MAERSK-B.CO", "DSV.CO", "CARL-B.CO", "VWS.CO", "ORSTED.CO", "PNDORA.CO", "DEMANT.CO", "GN.CO", "FLS.CO",
  ],
  all_scores: [
    { ticker: "NVDA", score: 9.2, price: 875.20, company_name: "NVIDIA Corp.", sector: "Technology" },
    { ticker: "AAPL", score: 8.5, price: 267.89, company_name: "Apple Inc.", sector: "Technology" },
    { ticker: "MSFT", score: 8.1, price: 415.20, company_name: "Microsoft Corp.", sector: "Technology" },
    { ticker: "TSLA", score: 7.8, price: 195.40, company_name: "Tesla Inc.", sector: "Automotive" },
    { ticker: "AMZN", score: 7.6, price: 186.50, company_name: "Amazon.com", sector: "Consumer" },
    { ticker: "META", score: 7.4, price: 502.30, company_name: "Meta Platforms", sector: "Technology" },
    { ticker: "GOOGL", score: 7.2, price: 163.80, company_name: "Alphabet Inc.", sector: "Technology" },
    { ticker: "AMD", score: 7.0, price: 168.90, company_name: "AMD Inc.", sector: "Technology" },
    { ticker: "AVGO", score: 6.8, price: 1680.50, company_name: "Broadcom Inc.", sector: "Technology" },
    { ticker: "CRM", score: 6.7, price: 290.20, company_name: "Salesforce", sector: "Technology" },
    { ticker: "NFLX", score: 6.5, price: 890.10, company_name: "Netflix Inc.", sector: "Entertainment" },
    { ticker: "ORCL", score: 6.3, price: 172.40, company_name: "Oracle Corp.", sector: "Technology" },
    { ticker: "ADBE", score: 6.1, price: 510.80, company_name: "Adobe Inc.", sector: "Technology" },
    { ticker: "INTC", score: 5.9, price: 22.30, company_name: "Intel Corp.", sector: "Technology" },
    { ticker: "QCOM", score: 5.7, price: 175.60, company_name: "Qualcomm", sector: "Technology" },
    { ticker: "MU", score: 5.5, price: 98.20, company_name: "Micron Tech.", sector: "Technology" },
    { ticker: "AMAT", score: 5.3, price: 195.40, company_name: "Applied Materials", sector: "Technology" },
    { ticker: "LRCX", score: 5.1, price: 780.30, company_name: "Lam Research", sector: "Technology" },
    { ticker: "KLAC", score: 4.9, price: 680.20, company_name: "KLA Corp.", sector: "Technology" },
    { ticker: "MRVL", score: 4.7, price: 72.10, company_name: "Marvell Tech.", sector: "Technology" },
    { ticker: "SHEL", score: 6.9, price: 83.51, company_name: "Shell plc", sector: "Energy" },
    { ticker: "BP", score: 6.2, price: 35.80, company_name: "BP plc", sector: "Energy" },
    { ticker: "TTE", score: 5.8, price: 58.90, company_name: "TotalEnergies", sector: "Energy" },
    { ticker: "EQNR", score: 5.4, price: 26.70, company_name: "Equinor ASA", sector: "Energy" },
    { ticker: "RIO", score: 5.0, price: 68.40, company_name: "Rio Tinto", sector: "Mining" },
    { ticker: "BHP", score: 4.8, price: 55.20, company_name: "BHP Group", sector: "Mining" },
    { ticker: "GLEN", score: 4.5, price: 4.80, company_name: "Glencore", sector: "Mining" },
    { ticker: "HSBA", score: 4.3, price: 8.90, company_name: "HSBC Holdings", sector: "Finance" },
    { ticker: "AZN", score: 4.1, price: 72.30, company_name: "AstraZeneca", sector: "Healthcare" },
    { ticker: "ULVR", score: 3.9, price: 45.60, company_name: "Unilever", sector: "Consumer" },
    { ticker: "NOVO-B.CO", score: 7.5, price: 725.00, company_name: "Novo Nordisk", sector: "Healthcare" },
    { ticker: "MAERSK-B.CO", score: 6.0, price: 12500.00, company_name: "Maersk", sector: "Shipping" },
    { ticker: "DSV.CO", score: 5.6, price: 1250.00, company_name: "DSV A/S", sector: "Logistics" },
    { ticker: "CARL-B.CO", score: 5.2, price: 780.00, company_name: "Carlsberg", sector: "Consumer" },
    { ticker: "VWS.CO", score: 4.6, price: 115.00, company_name: "Vestas Wind", sector: "Energy" },
    { ticker: "ORSTED.CO", score: 4.4, price: 385.00, company_name: "Ørsted", sector: "Energy" },
    { ticker: "PNDORA.CO", score: 4.2, price: 1080.00, company_name: "Pandora", sector: "Consumer" },
    { ticker: "DEMANT.CO", score: 4.0, price: 320.00, company_name: "Demant A/S", sector: "Healthcare" },
    { ticker: "GN.CO", score: 3.8, price: 185.00, company_name: "GN Store Nord", sector: "Technology" },
    { ticker: "FLS.CO", score: 3.6, price: 380.00, company_name: "FLSmidth", sector: "Industrial" },
  ],
};

export const mockTax: TaxData = {
  "2026": {
    gains_usd: 45.20,
    losses_usd: -75.21,
    net_usd: -30.01,
    net_dkk: -210.07,
    tax_dkk: 0,
    tax_usd: 0,
    gain_usd: -30.01,
    gain_dkk: -210.07,
    bracket: "loss — no tax",
    trades: [
      { ticker: "TSLA", buy_date: "2026-02-15", sell_date: "2026-02-28", qty: 10, buy_price_usd: 197.25, sell_price_usd: 195.40, gain_usd: -18.50, usd_dkk_rate: 7.01, gain_dkk: -129.69 },
      { ticker: "MSFT", buy_date: "2026-02-20", sell_date: "2026-02-27", qty: 2, buy_price_usd: 413.10, sell_price_usd: 415.20, gain_usd: 4.20, usd_dkk_rate: 7.01, gain_dkk: 29.44 },
      { ticker: "AMZN", buy_date: "2026-02-27", sell_date: "2026-02-27", qty: 4, buy_price_usd: 186.50, sell_price_usd: 185.10, gain_usd: -5.60, usd_dkk_rate: 7.01, gain_dkk: -39.26 },
    ],
  },
};

export const mockPendingOrders: PendingOrder[] = [
  { id: "ord-001", symbol: "AAPL", type: "stop_loss", qty: 3, target_price: 259.85, current_price: 264.18, created_at: "2026-02-28T10:15:00Z" },
  { id: "ord-002", symbol: "NVDA", type: "take_profit", qty: 5, target_price: 920.00, current_price: 875.20, created_at: "2026-02-28T10:13:00Z" },
  { id: "ord-003", symbol: "MSFT", type: "limit_buy", qty: 4, target_price: 405.00, current_price: 415.20, created_at: "2026-02-28T09:00:00Z" },
  { id: "ord-004", symbol: "SHEL", type: "stop_loss", qty: 12, target_price: 80.28, current_price: 83.51, created_at: "2026-02-28T09:56:00Z" },
];

export const mockEquity: EquityPoint[] = [
  { time: "09:30", value: 100000.00 },
  { time: "09:45", value: 99985.20 },
  { time: "10:00", value: 99950.10 },
  { time: "10:15", value: 99920.50 },
  { time: "10:30", value: 99890.00 },
  { time: "10:45", value: 99915.30 },
  { time: "11:00", value: 99940.80 },
  { time: "11:15", value: 99960.00 },
  { time: "11:30", value: 99935.50 },
  { time: "11:45", value: 99910.20 },
  { time: "12:00", value: 99925.60 },
  { time: "12:15", value: 99945.10 },
  { time: "12:30", value: 99960.40 },
  { time: "12:45", value: 99930.31 },
  { time: "13:00", value: 99920.80 },
  { time: "13:15", value: 99935.50 },
  { time: "13:30", value: 99950.00 },
  { time: "13:45", value: 99930.31 },
];