import type { PendingOrder } from "@/types/trading";
import { formatCurrency } from "@/lib/trading-utils";

interface PendingOrdersProps {
  orders: PendingOrder[];
  onCancel: (orderId: string) => void;
}

const TYPE_STYLES: Record<string, string> = {
  limit_buy: "bg-positive/10 text-positive",
  limit_sell: "bg-negative/10 text-negative",
  stop_loss: "bg-warning/10 text-warning",
  take_profit: "bg-info/10 text-info",
};

const TYPE_LABELS: Record<string, string> = {
  limit_buy: "Limit Buy",
  limit_sell: "Limit Sell",
  stop_loss: "Stop Loss",
  take_profit: "Take Profit",
};

export function PendingOrders({ orders, onCancel }: PendingOrdersProps) {
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <span className="text-2xl mb-2 opacity-30">📋</span>
        <p className="text-xs">No pending orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center gap-3 rounded-xl bg-secondary/20 border border-border/20 p-3 group hover:bg-secondary/40 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-foreground">{order.symbol}</span>
              <span className={`text-[0.5rem] font-semibold px-1.5 py-0.5 rounded-md uppercase ${TYPE_STYLES[order.type] || "bg-muted text-muted-foreground"}`}>
                {TYPE_LABELS[order.type] || order.type}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[0.6rem] text-muted-foreground">
              <span>Qty: <span className="text-foreground font-medium">{order.qty}</span></span>
              <span>@ <span className="mono text-foreground font-medium">{formatCurrency(order.target_price)}</span></span>
              {order.current_price && (
                <span>
                  Now: <span className="mono text-foreground">{formatCurrency(order.current_price)}</span>
                  <span className={`ml-1 ${
                    order.type === "stop_loss" 
                      ? order.current_price <= order.target_price ? "text-negative" : "text-muted-foreground"
                      : order.current_price >= order.target_price ? "text-positive" : "text-muted-foreground"
                  }`}>
                    ({((order.target_price - order.current_price) / order.current_price * 100).toFixed(1)}%)
                  </span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onCancel(order.id)}
            className="opacity-0 group-hover:opacity-100 text-[0.6rem] px-2.5 py-1.5 rounded-lg font-semibold bg-negative/10 text-negative border border-negative/20 hover:bg-negative/20 transition-all"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
