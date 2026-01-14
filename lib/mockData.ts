import type { Order, OrderStatus, OrderType, Outlet, OutletKey } from "@/types";

/* ---------------------------------------------
  OUTLETS
--------------------------------------------- */
export const MOCK_OUTLETS: Outlet[] = [
  { id: "outlet-1", name: "Downtown Branch" },
  { id: "outlet-2", name: "Uptown Branch" },
  { id: "outlet-3", name: "Suburban Branch" },
];

/* ---------------------------------------------
  KPI DATA (more realistic + varied)
--------------------------------------------- */
export const kpis: Record<
  OutletKey,
  {
    revenue: number;
    orders: number;
    customers: number;
    prepTime: number;
    reservations: number;
  }
> = {
  all: {
    revenue: 83640,
    orders: 92,
    customers: 371,
    prepTime: 15,
    reservations: 18,
  },
  downtown: {
    revenue: 31250,
    orders: 36,
    customers: 128,
    prepTime: 14,
    reservations: 6,
  },
  uptown: {
    revenue: 28490,
    orders: 29,
    customers: 101,
    prepTime: 16,
    reservations: 5,
  },
  suburban: {
    revenue: 23800,
    orders: 27,
    customers: 142,
    prepTime: 17,
    reservations: 7,
  },
};

/* ---------------------------------------------
  HOURLY ORDERS (unique per outlet)
--------------------------------------------- */
export const hourlyOrders: Record<OutletKey, { hour: string; orders: number }[]> =
  {
    all: [
      { hour: "9 AM", orders: 8 },
      { hour: "10 AM", orders: 14 },
      { hour: "11 AM", orders: 21 },
      { hour: "12 PM", orders: 42 },
      { hour: "1 PM", orders: 49 },
      { hour: "2 PM", orders: 33 },
      { hour: "3 PM", orders: 19 },
      { hour: "4 PM", orders: 15 },
      { hour: "5 PM", orders: 22 },
      { hour: "6 PM", orders: 31 },
      { hour: "7 PM", orders: 54 },
      { hour: "8 PM", orders: 61 },
      { hour: "9 PM", orders: 45 },
    ],
    downtown: [
      { hour: "9 AM", orders: 4 },
      { hour: "10 AM", orders: 7 },
      { hour: "11 AM", orders: 12 },
      { hour: "12 PM", orders: 20 },
      { hour: "1 PM", orders: 23 },
      { hour: "2 PM", orders: 16 },
      { hour: "3 PM", orders: 10 },
      { hour: "4 PM", orders: 7 },
      { hour: "5 PM", orders: 9 },
      { hour: "6 PM", orders: 12 },
      { hour: "7 PM", orders: 19 },
      { hour: "8 PM", orders: 21 },
      { hour: "9 PM", orders: 15 },
    ],
    uptown: [
      { hour: "9 AM", orders: 2 },
      { hour: "10 AM", orders: 5 },
      { hour: "11 AM", orders: 7 },
      { hour: "12 PM", orders: 16 },
      { hour: "1 PM", orders: 18 },
      { hour: "2 PM", orders: 12 },
      { hour: "3 PM", orders: 7 },
      { hour: "4 PM", orders: 6 },
      { hour: "5 PM", orders: 8 },
      { hour: "6 PM", orders: 10 },
      { hour: "7 PM", orders: 16 },
      { hour: "8 PM", orders: 18 },
      { hour: "9 PM", orders: 13 },
    ],
    suburban: [
      { hour: "9 AM", orders: 2 },
      { hour: "10 AM", orders: 2 },
      { hour: "11 AM", orders: 2 },
      { hour: "12 PM", orders: 6 },
      { hour: "1 PM", orders: 8 },
      { hour: "2 PM", orders: 5 },
      { hour: "3 PM", orders: 2 },
      { hour: "4 PM", orders: 2 },
      { hour: "5 PM", orders: 5 },
      { hour: "6 PM", orders: 9 },
      { hour: "7 PM", orders: 19 },
      { hour: "8 PM", orders: 22 },
      { hour: "9 PM", orders: 17 },
    ],
  };

/* ---------------------------------------------
  ORDER TYPE SPLIT (unique per outlet)
  NOTE: Your OrderType is DINE_IN | PACK | ORDER
--------------------------------------------- */
export const orderTypeSplit: Record<OutletKey, { name: string; value: number }[]> =
  {
    all: [
      { name: "Dine-in", value: 44 },
      { name: "Pack", value: 28 },
      { name: "Online", value: 28 },
    ],
    downtown: [
      { name: "Dine-in", value: 52 },
      { name: "Pack", value: 24 },
      { name: "Online", value: 24 },
    ],
    uptown: [
      { name: "Dine-in", value: 38 },
      { name: "Pack", value: 30 },
      { name: "Online", value: 32 },
    ],
    suburban: [
      { name: "Dine-in", value: 34 },
      { name: "Pack", value: 32 },
      { name: "Online", value: 34 },
    ],
  };

/* ---------------------------------------------
  MOCK ORDER GENERATOR (variable + realistic)
--------------------------------------------- */
const customers = [
  "Rahul Sharma",
  "Ananya Singh",
  "Mohit Verma",
  "Neha Kapoor",
  "Aman Khan",
  "Priya Mehta",
  "Sana Sheikh",
  "Rohit Joshi",
  "Ayesha Ansari",
  "Karan Malhotra",
  "Ishita Jain",
  "Vivek Patel",
  "Simran Kaur",
  "Harsh Gupta",
];

const menuItems = [
  { name: "Chicken Shawarma", price: 120 },
  { name: "Zinger Burger", price: 160 },
  { name: "French Fries", price: 80 },
  { name: "Paneer Tikka", price: 240 },
  { name: "Butter Chicken", price: 320 },
  { name: "Naan", price: 40 },
  { name: "Veg Biryani", price: 260 },
  { name: "Chicken Biryani", price: 320 },
  { name: "Cold Coffee", price: 110 },
  { name: "Mojito", price: 140 },
  { name: "Chocolate Shake", price: 150 },
  { name: "Dal Makhani", price: 180 },
];

const tables = ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6", "T-7", "T-8", "T-9", "T-10", "T-11", "T-12"];

const statuses: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

const types: OrderType[] = ["DINE_IN", "PACK", "ORDER"];

function randomPick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomISOWithinLastHours(hours: number) {
  const now = Date.now();
  const offset = randomInt(5, hours * 60) * 60 * 1000; // between 5 mins and N hours
  return new Date(now - offset).toISOString();
}

function buildItems() {
  const count = randomInt(1, 4);
  const used = new Set<number>();
  const items = [];

  while (items.length < count) {
    const idx = randomInt(0, menuItems.length - 1);
    if (used.has(idx)) continue;
    used.add(idx);

    const base = menuItems[idx];
    items.push({
      name: base.name,
      quantity: randomInt(1, 3),
      price: base.price,
    });
  }

  return items;
}

function buildOrder(idNum: number, outletId: string): Order {
  const type = randomPick(types);

  return {
    id: `ORD-${1000 + idNum}`,
    outlet: outletId, // ✅ Outlet.id (important)
    table: type === "ORDER" ? "-" : randomPick(tables),
    customer: randomPick(customers),
    type,
    status: randomPick(statuses),
    items: buildItems(),
    createdAt: randomISOWithinLastHours(12),
  };
}

/* ---------------------------------------------
  FINAL MOCK ORDERS
--------------------------------------------- */
export const mockOrders: Order[] = [
  // Downtown (outlet-1)
  buildOrder(1, "outlet-1"),
  buildOrder(2, "outlet-1"),
  buildOrder(3, "outlet-1"),
  buildOrder(4, "outlet-1"),
  buildOrder(5, "outlet-1"),

  // Uptown (outlet-2)
  buildOrder(6, "outlet-2"),
  buildOrder(7, "outlet-2"),
  buildOrder(8, "outlet-2"),
  buildOrder(9, "outlet-2"),
  buildOrder(10, "outlet-2"),

  // Suburban (outlet-3)
  buildOrder(11, "outlet-3"),
  buildOrder(12, "outlet-3"),
  buildOrder(13, "outlet-3"),
  buildOrder(14, "outlet-3"),
  buildOrder(15, "outlet-3"),
];

export function updateMockOrderStatus(orderId: string, status: OrderStatus) {
  const idx = mockOrders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  mockOrders[idx] = {
    ...mockOrders[idx],
    status,
  };

  return mockOrders[idx];
}
