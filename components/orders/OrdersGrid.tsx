"use client";

import { Order } from "@/types";
import OrderCard from "./OrderCard";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export function OrdersGrid({ orders, onSelect }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold">No orders found</p>
        <p className="text-xs mt-1">Try changing filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
      {orders.map((order) => (
        <div key={order.id} className="sm:h-full">
          <OrderCard
            order={order}
            onClick={() => onSelect(order)}
          />
        </div>
      ))}
    </div>
  );
}