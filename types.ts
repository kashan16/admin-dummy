export interface Outlet {
    id: string;
    name: string;
}

export type OutletScope = 'ALL' | string; // 'ALL' or Outlet.id
export type OutletKey = "all" | "downtown" | "uptown" | "suburban";

export type OrderType = 'DINE_IN' | 'PACK' | 'ORDER';

export type OrderStatus =
    | 'pending'
    | 'delivered'
    | 'cancelled';

export interface KPI {
    label: string;
    value: number | string;
    trend?: "up" | "down";
    trendValue?: string;
}


export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    outlet: string;
    table: string;
    customer: string;
    type: OrderType;
    status: OrderStatus;
    items: OrderItem[];
    createdAt: string;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "SEATED" | "CANCELLED";

export type Reservation = {
    id: string;
    customerName: string;
    phone?: string;
    guests: number;
    dateISO: string; // "2026-01-14"
    time: string; // "07:30 PM"
    table?: string; // "T-4"
    notes?: string;
    status: ReservationStatus;
    createdAtISO: string;
};
