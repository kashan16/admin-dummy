"use client";

import { CalendarDays, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

const modules = [
    {
        title: "Orders",
        subtitle: "Track live & completed orders",
        icon: ShoppingCart,
        href: "/admin/orders",
        bg: "bg-indigo-50",
    },
    {
        title: "Customers",
        subtitle: "Repeat customer loyalty view",
        icon: Users,
        href: "/admin/customers",
        bg: "bg-card",
    },
    {
        title: "Reservations",
        subtitle: "Manage seating & schedules",
        icon: CalendarDays,
        href: "/admin/reservations",
        bg: "bg-card",
    },
];

export function ModulesOverview() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {modules.map((m) => (
                <Link
                key={m.title}
                href={m.href}
                className={`
                    ${m.bg}
                    border border-border shadow-sm rounded-2xl p-5
                    hover:shadow-md hover:-translate-y-px
                    transition-all duration-200
                    flex items-center justify-between gap-4`}
                >
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{m.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{m.subtitle}</p>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-blue-700 flex items-center justify-center shrink-0">
                        <m.icon className="h-5 w-5 text-white" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
