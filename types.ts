export interface Outlet {
    id: string;
    name: string;
}

export type OutletScope = 'ALL' | string; // 'ALL' or Outlet.id
export type OutletKey = "all" | "downtown" | "uptown" | "suburban";

export type OrderType = 'DINE_IN' | 'PACK' | 'ORDER';

export type OrderStatus =
    | 'pending'
    | 'accepted'
    | 'preparing'
    | 'ready'
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
