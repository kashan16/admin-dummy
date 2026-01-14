"use client";

import { useOutlet } from "@/context/OutletContext";
import { hourlyOrders } from "@/lib/mockData";
import { OutletKey } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#1D4ED8", // blue
  "#9333EA", // purple
  "#06B6D4", // cyan
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
];

export function HourlyOrdersChart() {
  const { selectedOutlet } = useOutlet();

  const outletKey: OutletKey =
    selectedOutlet === "ALL"
      ? "all"
      : (selectedOutlet.toLowerCase() as OutletKey);

  const data = hourlyOrders[outletKey];

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200 min-w-0">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-foreground">Hourly Orders</p>
        <p className="text-xs text-muted-foreground mt-1">
          Orders placed throughout the day (color-coded peaks)
        </p>
      </div>

      <div className="p-5 h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-2xl border border-border bg-card shadow-md px-4 py-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {payload[0].value} orders
                    </p>
                  </div>
                );
              }}
            />

            <Bar dataKey="orders" radius={[10, 10, 0, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
