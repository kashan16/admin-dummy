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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={() => onSelect(order)}
        />
      ))}
    </div>
  );
}
