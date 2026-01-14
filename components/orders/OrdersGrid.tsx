'use client';

import { Order } from "@/types";
import OrderCard from "./OrderCard";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export function OrdersGrid({ orders, onSelect }: Props) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-gray-900">No orders found</p>
        <p className="text-xs text-gray-500 mt-1">
          Try changing filters or check again later.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        gap-4
      "
    >
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
