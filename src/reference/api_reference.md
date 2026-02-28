# AI Trading Bot — API Reference

All endpoints are served by Flask on `http://localhost:5001`.
Data refreshes every 5 seconds in the frontend via `fetchAll()`.

---

## GET /api/account
Portfolio and cash figures from Alpaca.

```json
{
  "portfolio_value": 99930.31,
  "cash": 82977.70,
  "buying_power": 82977.70,
  "starting_value": 100000.00,
  "portfolio_change": -69.69
}
```

---

## GET /api/positions
All currently open positions.

```json
[
  {
    "symbol": "AAPL",
    "qty": "3",
    "avg_entry_price": 267.89,
    "current_price": 264.18,
    "unrealized_pl": -11.14,
    "unrealized_plpc": -0.0139,
    "market": "US",
    "company": "Apple Inc.",
    "country": "United States"
  },
  {
    "symbol": "SHEL",
    "qty": "12",
    "avg_entry_price": 82.76,
    "current_price": 83.51,
    "unrealized_pl": 9.00,
    "unrealized_plpc": 0.0091,
    "market": "EU",
    "company": "Shell plc",
    "country": "United Kingdom"
  }
]
```

**market** values: `"US"` `"EU"` `"DK"` `"JP"` `"IN"` `"TW"` `"CA"`

---

## GET /api/stats
Realized P&L, win rate, and per-market breakdown from trade log (FIFO).

```json
{
  "total_trades": 39,
  "buys": 20,
  "sells": 19,
  "realized_pnl": -30.01,
  "wins": 3,
  "losses": 7,
  "win_rate": 30.0,
  "pnl_per_ticker": {
    "AAPL": -12.50,
    "MSFT": 4.20
  },
  "by_market": {
    "US": { "wins": 1, "losses": 4, "pnl": -8.82, "win_rate": 20.0 },
    "EU": { "wins": 1, "losses": 3, "pnl": -12.78, "win_rate": 25.0 },
    "DK": { "wins": 1, "losses": 0, "pnl": 1.62,  "win_rate": 100.0 },
    "JP": { "wins": 0, "losses": 0, "pnl": 0.0,   "win_rate": 0.0 },
    "IN": { "wins": 0, "losses": 0, "pnl": 0.0,   "win_rate": 0.0 },
    "TW": { "wins": 0, "losses": 0, "pnl": 0.0,   "win_rate": 0.0 },
    "CA": { "wins": 0, "losses": 0, "pnl": 0.0,   "win_rate": 0.0 }
  }
}
```

---

## GET /api/decisions
Last 50 AI decisions (BUY / SELL / HOLD).

```json
[
  {
    "timestamp": "2026-02-28T10:14:22.123456",
    "ticker": "AAPL",
    "company_name": "Apple Inc.",
    "sector": "Technology",
    "action": "BUY",
    "confidence": 7,
    "key_signal": "MACD crossover with volume surge",
    "reasoning": "RSI at 42, MACD turning bullish, volume 1.8x average...",
    "price": 267.89,
    "executed": true
  }
]
```

---

## GET /api/trades
Full trade history (all executed BUY / SELL orders).

```json
[
  {
    "timestamp": "2026-02-28T09:45:11.000000",
    "ticker": "AAPL",
    "action": "BUY",
    "qty": 3,
    "price": 267.89,
    "order_id": "abc123",
    "realized_pnl": null
  },
  {
    "timestamp": "2026-02-28T11:02:33.000000",
    "ticker": "MSFT",
    "action": "SELL",
    "qty": 2,
    "price": 415.20,
    "order_id": "def456",
    "realized_pnl": 4.20
  }
]
```

---

## GET /api/status
Current scan status (what the bot is doing right now).

```json
{
  "scanning": true,
  "phase": "ai_scan",
  "ticker": "NVDA",
  "company_name": "NVIDIA",
  "index": 12,
  "total": 80,
  "last_scan": "2026-02-28T10:01:05.123456"
}
```

**phase** values: `"premarket"` `"midday"` `"ai_scan"` `null`

---

## GET /api/watchlist
Today's active watchlist (top 80 tickers by technical score).

```json
{
  "date": "2026-02-28",
  "phase": "premarket",
  "scored_at": "2026-02-28T08:45:00.000000",
  "total_scanned": 542,
  "tickers": ["NVDA", "AAPL", "MSFT", "..."],
  "all_scores": [
    { "ticker": "NVDA", "score": 9.0, "price": 875.20, "company_name": "NVIDIA", "sector": "Technology" },
    { "ticker": "AAPL", "score": 8.0, "price": 267.89, "company_name": "Apple Inc.", "sector": "Technology" }
  ]
}
```

---

## GET /api/market_hours
Which exchanges are currently open (Copenhagen time shown).

```json
{
  "cph_time": "15:42",
  "markets": [
    { "name": "US (NYSE/Nasdaq)", "flag": "🇺🇸", "open": true,  "hours_cet": "15:30–22:00", "status": "Open" },
    { "name": "LSE (London)",     "flag": "🇬🇧", "open": false, "hours_cet": "09:00–17:30", "status": "Closed" },
    { "name": "XETRA (Frankfurt)","flag": "🇩🇪", "open": false, "hours_cet": "09:00–17:30", "status": "Closed" },
    { "name": "Euronext",         "flag": "🇪🇺", "open": false, "hours_cet": "09:00–17:30", "status": "Closed" },
    { "name": "Nasdaq CPH",       "flag": "🇩🇰", "open": false, "hours_cet": "09:00–17:00", "status": "Closed" }
  ]
}
```

---

## GET /api/tax
Danish aktieindkomst tax estimate by year.

```json
{
  "2026": {
    "gains_usd": 45.20,
    "losses_usd": -75.21,
    "net_usd": -30.01,
    "net_dkk": -210.07,
    "tax_dkk": 0,
    "tax_usd": 0,
    "bracket": "loss — no tax",
    "trades": [
      {
        "ticker": "AAPL",
        "buy_date": "2026-02-10",
        "sell_date": "2026-02-28",
        "qty": 3,
        "buy_price_usd": 270.50,
        "sell_price_usd": 264.18,
        "gain_usd": -18.96,
        "usd_dkk_rate": 7.01,
        "gain_dkk": -132.91
      }
    ]
  }
}
```

---

## GET /api/tax/export.csv
Downloads a semicolon-separated CSV for SKAT årsopgørelse field 66.
Danish decimal format (comma as decimal separator).

---

## POST /api/control/halt
Pause the bot (stops scanning, keeps positions open).
Returns: `{ "message": "Trading halted." }`

## POST /api/control/resume
Resume after halt.
Returns: `{ "message": "Trading resumed." }`

## POST /api/control/sell_all
Sell all open positions immediately and halt.
Returns: `{ "message": "All positions closed." }`

## POST /api/control/sell/{symbol}
Sell a single position by ticker symbol.
Returns: `{ "message": "AAPL sold." }` or `{ "error": "..." }`

## GET /api/control/status
Returns: `{ "halted": false }`

---

## Notes for UI redesign

- The frontend polls all endpoints every **5 seconds** via `fetchAll()`
- Colors used: positive = `#10b981` (green), negative = `#f87171` (red)
- Dark theme: background `#050e1b`, card `#0b1929`, border `#162d47`
- Market badge colors: US `#4ab87a`, EU `#5b9fd4`, DK `#c8b84a`, JP `#e07b54`, IN `#e8a838`, TW `#7ec8c8`, CA `#b07fd4`
- Tabs: Overview · Watchlist · Charts · History · Tax
- Charts use **lightweight-charts v4.1** (TradingView library)
- The bot runs on Alpaca **paper trading** (no real money)
