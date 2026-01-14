import { Order, Outlet, OutletKey } from "@/types";

export const MOCK_OUTLETS: Outlet[] = [
    { id: 'outlet-1', name: 'Downtown Branch' },
    { id: 'outlet-2', name: 'Uptown Branch' },
    { id: 'outlet-3', name: 'Suburban Branch' },
];

export const kpis: Record<OutletKey, {
    revenue: number;
    orders: number;
    customers: number;
    prepTime: number;
    reservations: number;
}> = {
    all: {
        revenue: 45230,
        orders: 38,
        customers: 156,
        prepTime: 16,
        reservations: 7,
    },
    downtown: {
        revenue: 18200,
        orders: 14,
        customers: 52,
        prepTime: 15,
        reservations: 3,
    },
    uptown: {
        revenue: 14600,
        orders: 11,
        customers: 44,
        prepTime: 17,
        reservations: 2,
    },
    suburban: {
        revenue: 12430,
        orders: 13,
        customers: 60,
        prepTime: 16,
        reservations: 2,
    },
};

export const hourlyOrders: Record<
OutletKey,
{ hour: string; orders: number }[]
> = {
    all: [
        { hour: "9 AM", orders: 12 },
        { hour: "10 AM", orders: 18 },
        { hour: "11 AM", orders: 25 },
        { hour: "12 PM", orders: 48 },
        { hour: "1 PM", orders: 55 },
        { hour: "2 PM", orders: 40 },
        { hour: "3 PM", orders: 22 },
        { hour: "4 PM", orders: 15 },
        { hour: "5 PM", orders: 28 },
        { hour: "6 PM", orders: 35 },
        { hour: "7 PM", orders: 58 },
        { hour: "8 PM", orders: 65 },
        { hour: "9 PM", orders: 50 },
    ],
    downtown: [
        { hour: "9 AM", orders: 12 },
        { hour: "10 AM", orders: 18 },
        { hour: "11 AM", orders: 25 },
        { hour: "12 PM", orders: 48 },
        { hour: "1 PM", orders: 55 },
        { hour: "2 PM", orders: 40 },
        { hour: "3 PM", orders: 22 },
        { hour: "4 PM", orders: 15 },
        { hour: "5 PM", orders: 28 },
        { hour: "6 PM", orders: 35 },
        { hour: "7 PM", orders: 58 },
        { hour: "8 PM", orders: 65 },
        { hour: "9 PM", orders: 50 },
    ],
    uptown: [
        { hour: "9 AM", orders: 12 },
        { hour: "10 AM", orders: 18 },
        { hour: "11 AM", orders: 25 },
        { hour: "12 PM", orders: 48 },
        { hour: "1 PM", orders: 55 },
        { hour: "2 PM", orders: 40 },
        { hour: "3 PM", orders: 22 },
        { hour: "4 PM", orders: 15 },
        { hour: "5 PM", orders: 28 },
        { hour: "6 PM", orders: 35 },
        { hour: "7 PM", orders: 58 },
        { hour: "8 PM", orders: 65 },
        { hour: "9 PM", orders: 50 },
    ],
    suburban: [
        { hour: "9 AM", orders: 12 },
        { hour: "10 AM", orders: 18 },
        { hour: "11 AM", orders: 25 },
        { hour: "12 PM", orders: 48 },
        { hour: "1 PM", orders: 55 },
        { hour: "2 PM", orders: 40 },
        { hour: "3 PM", orders: 22 },
        { hour: "4 PM", orders: 15 },
        { hour: "5 PM", orders: 28 },
        { hour: "6 PM", orders: 35 },
        { hour: "7 PM", orders: 58 },
        { hour: "8 PM", orders: 65 },
        { hour: "9 PM", orders: 50 },
    ],
};

export const orderTypeSplit: Record<
OutletKey,
{ name: string; value: number }[]
> = {
    all: [
        { name: "Dine-in", value: 45 },
        { name: "Pre-order", value: 30 },
        { name: "Takeaway", value: 25 },
    ],
    downtown: [
        { name: "Dine-in", value: 45 },
        { name: "Pre-order", value: 30 },
        { name: "Takeaway", value: 25 },
    ],
    uptown: [
        { name: "Dine-in", value: 45 },
        { name: "Pre-order", value: 30 },
        { name: "Takeaway", value: 25 },
    ],
    suburban: [
        { name: "Dine-in", value: 45 },
        { name: "Pre-order", value: 30 },
        { name: "Takeaway", value: 25 },
    ],
};

export const mockOrders: Order[] = [
    {
        id: "ORD-1024",
        outlet: "Downtown",
        table: "T-7",
        customer: "Rahul Sharma",
        status: "new",
        createdAt: new Date().toISOString(),
        items: [
            { name: "Butter Chicken", quantity: 2, price: 320 },
            { name: "Naan", quantity: 4, price: 40 },
        ],
    },
    {
        id: "ORD-1025",
        outlet: "Uptown",
        table: "T-3",
        customer: "Ananya Singh",
        status: "preparing",
        createdAt: new Date().toISOString(),
        items: [
            { name: "Paneer Tikka", quantity: 1, price: 240 },
            { name: "Dal Makhani", quantity: 1, price: 180 },
        ],
    },
    {
        id: "ORD-1026",
        outlet: "Suburban",
        table: "T-12",
        customer: "Mohit Verma",
        status: "ready",
        createdAt: new Date().toISOString(),
        items: [{ name: "Veg Biryani", quantity: 2, price: 260 }],
    },
    {
        id: "ORD-1027",
        outlet: "Downtown",
        table: "T-1",
        customer: "Neha Kapoor",
        status: "completed",
        createdAt: new Date().toISOString(),
        items: [{ name: "Chicken Biryani", quantity: 1, price: 320 }],
    },
];

