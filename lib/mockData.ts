import type {
  Order,
  OrderStatus,
  OrderType,
  Outlet,
  OutletKey,
  Reservation,
  KPI,
} from "@/types";

/* ---------------------------------------------
  OUTLETS
--------------------------------------------- */
export const MOCK_OUTLETS: Outlet[] = [
  { id: "outlet-1", name: "Downtown Branch" },
  { id: "outlet-2", name: "Uptown Branch" },
  { id: "outlet-3", name: "Suburban Branch" },
];

/* ---------------------------------------------
  KPI DATA
--------------------------------------------- */
export const kpis: Record<OutletKey, KPI[]> = {
  all: [
    { label: "Revenue", value: "₹83,640", trend: "up", trendValue: "+8%" },
    { label: "Orders", value: 92, trend: "up", trendValue: "+5%" },
    { label: "Customers", value: 371, trend: "up", trendValue: "+12%" },
    { label: "Avg Prep Time", value: "15 min", trend: "down", trendValue: "-2%" },
  ],
  downtown: [
    { label: "Revenue", value: "₹31,250", trend: "up", trendValue: "+6%" },
    { label: "Orders", value: 36 },
    { label: "Customers", value: 128 },
    { label: "Avg Prep Time", value: "14 min" },
  ],
  uptown: [
    { label: "Revenue", value: "₹28,490", trend: "down", trendValue: "-3%" },
    { label: "Orders", value: 29 },
    { label: "Customers", value: 101 },
    { label: "Avg Prep Time", value: "16 min" },
  ],
  suburban: [
    { label: "Revenue", value: "₹23,800", trend: "up", trendValue: "+4%" },
    { label: "Orders", value: 27 },
    { label: "Customers", value: 142 },
    { label: "Avg Prep Time", value: "17 min" },
  ],
};

/* ---------------------------------------------
  HOURLY ORDERS
--------------------------------------------- */
export const hourlyOrders: Record<
  OutletKey,
  { hour: string; orders: number }[]
> = {
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
  ORDER TYPE SPLIT
--------------------------------------------- */
export const orderTypeSplit: Record<
  OutletKey,
  { name: string; value: number }[]
> = {
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
  MOCK ORDER GENERATOR
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
  "Ishita Jain",
];

const menuItems = [
  { name: "Chicken Shawarma", price: 120 },
  { name: "Zinger Burger", price: 160 },
  { name: "French Fries", price: 80 },
  { name: "Paneer Tikka", price: 240 },
  { name: "Butter Chicken", price: 320 },
  { name: "Veg Biryani", price: 260 },
];

const tables = ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6"];

const statuses: OrderStatus[] = ["pending", "delivered", "cancelled"];
const types: OrderType[] = ["DINE_IN", "PACK", "ORDER"];

function randomPick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomISOWithinLastHours(hours: number) {
  const now = Date.now();
  const offset = randomInt(5, hours * 60) * 60 * 1000;
  return new Date(now - offset).toISOString();
}

function buildItems() {
  return Array.from({ length: randomInt(1, 4) }).map(() => {
    const base = randomPick(menuItems);
    return {
      name: base.name,
      quantity: randomInt(1, 3),
      price: base.price,
    };
  });
}

function buildOrder(idNum: number, outletId: string): Order {
  const type = randomPick(types);

  return {
    id: `ORD-${1000 + idNum}`,
    outlet: outletId,
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
  // Downtown
  buildOrder(1, "outlet-1"),
  buildOrder(2, "outlet-1"),
  buildOrder(3, "outlet-1"),
  buildOrder(4, "outlet-1"),
  buildOrder(5, "outlet-1"),
  buildOrder(6, "outlet-1"),

  // Uptown
  buildOrder(7, "outlet-2"),
  buildOrder(8, "outlet-2"),
  buildOrder(9, "outlet-2"),
  buildOrder(10, "outlet-2"),
  buildOrder(11, "outlet-2"),
  buildOrder(12, "outlet-2"),

  // Suburban
  buildOrder(13, "outlet-3"),
  buildOrder(14, "outlet-3"),
  buildOrder(15, "outlet-3"),
  buildOrder(16, "outlet-3"),
  buildOrder(17, "outlet-3"),
  buildOrder(18, "outlet-3"),
];

/* ---------------------------------------------
  UPDATE ORDER STATUS
--------------------------------------------- */
export function updateMockOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const idx = mockOrders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  mockOrders[idx] = { ...mockOrders[idx], status };
  return mockOrders[idx];
}

/* ---------------------------------------------
  RESERVATIONS
--------------------------------------------- */
export const mockReservations: Reservation[] = [
  {
    id: "RSV-1001",
    customerName: "Ayaan Khan",
    phone: "98765 43210",
    guests: 4,
    dateISO: "2026-01-14",
    time: "07:30 PM",
    table: "T-12",
    notes: "Birthday celebration",
    status: "CONFIRMED",
    createdAtISO: "2026-01-14T10:20:00.000Z",
  },
  {
    id: "RSV-1002",
    customerName: "Sara Ahmed",
    phone: "99999 11111",
    guests: 2,
    dateISO: "2026-01-14",
    time: "08:00 PM",
    status: "PENDING",
    createdAtISO: "2026-01-14T11:05:00.000Z",
  },
  {
    id: "RSV-1003",
    customerName: "Rohit Joshi",
    phone: "88888 22222",
    guests: 6,
    dateISO: "2026-01-14",
    time: "09:15 PM",
    table: "T-8",
    notes: "Need baby chair",
    status: "CONFIRMED",
    createdAtISO: "2026-01-14T12:30:00.000Z",
  },
  {
    id: "RSV-1004",
    customerName: "Neha Verma",
    guests: 3,
    dateISO: "2026-01-15",
    time: "07:00 PM",
    status: "CANCELLED",
    createdAtISO: "2026-01-14T09:10:00.000Z",
  },
  {
    id: "RSV-1005",
    customerName: "Zaid Ali",
    phone: "77777 33333",
    guests: 5,
    dateISO: "2026-01-15",
    time: "08:45 PM",
    table: "T-9",
    status: "SEATED",
    createdAtISO: "2026-01-14T13:15:00.000Z",
  },
  {
    id: "RSV-1006",
    customerName: "Ishita Jain",
    phone: "98989 45454",
    guests: 2,
    dateISO: "2026-01-15",
    time: "09:00 PM",
    table: "T-4",
    notes: "Window seat preferred",
    status: "CONFIRMED",
    createdAtISO: "2026-01-14T14:40:00.000Z",
  },
  {
    id: "RSV-1007",
    customerName: "Aman Gupta",
    guests: 4,
    dateISO: "2026-01-16",
    time: "07:45 PM",
    status: "PENDING",
    createdAtISO: "2026-01-14T15:10:00.000Z",
  },
];
