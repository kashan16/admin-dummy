/* eslint-disable @typescript-eslint/no-unused-vars */
import { MOCK_OUTLETS, mockOrders } from "@/lib/mockData";
import type { Order, Outlet } from "@/types";

export type Customer = {
  id: string; // stable id
  name: string;
  phone?: string;
  outletIds: string[];

  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderAtISO: string;
};

function calcOrderTotal(order: Order) {
  return order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

function outletNameById(outletId: string, outlets: Outlet[]) {
  return outlets.find((o) => o.id === outletId)?.name ?? "Unknown Outlet";
}

export function buildMockCustomersFromOrders(
  orders: Order[],
  outlets: Outlet[]
): Customer[] {
  const map = new Map<string, Customer>();

  for (const order of orders) {
    const name = order.customer.trim();

    const orderTotal = calcOrderTotal(order);

    if (!map.has(name)) {
      map.set(name, {
        id: `CUST-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name,
        phone: undefined, // mock: optional if you want later
        outletIds: [order.outlet],
        totalOrders: 1,
        totalSpent: orderTotal,
        avgOrderValue: orderTotal,
        lastOrderAtISO: order.createdAt,
      });
    } else {
      const c = map.get(name)!;

      const outletSet = new Set(c.outletIds);
      outletSet.add(order.outlet);

      const totalOrders = c.totalOrders + 1;
      const totalSpent = c.totalSpent + orderTotal;

      map.set(name, {
        ...c,
        outletIds: Array.from(outletSet),
        totalOrders,
        totalSpent,
        avgOrderValue: totalSpent / totalOrders,
        lastOrderAtISO:
          new Date(order.createdAt).getTime() > new Date(c.lastOrderAtISO).getTime()
            ? order.createdAt
            : c.lastOrderAtISO,
      });
    }
  }

  // Only customers who ordered multiple times = "loyalty reflection"
  const loyalCustomers = Array.from(map.values()).filter((c) => c.totalOrders >= 2);

  // Sort by totalOrders desc, then spent desc
  loyalCustomers.sort((a, b) => {
    if (b.totalOrders !== a.totalOrders) return b.totalOrders - a.totalOrders;
    return b.totalSpent - a.totalSpent;
  });

  // Attach outlet names in UI using MOCK_OUTLETS if needed
  // outletNameById(...) helper can be used inside UI

  return loyalCustomers;
}

export const mockCustomers = buildMockCustomersFromOrders(mockOrders, MOCK_OUTLETS);

// Optional helper for UI
export function getOutletNames(outletIds: string[]) {
  return outletIds.map((id) => outletNameById(id, MOCK_OUTLETS));
}
