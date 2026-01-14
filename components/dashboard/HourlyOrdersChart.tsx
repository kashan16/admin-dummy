'use client';

import { useOutlet } from "@/context/OutletContext";
import { hourlyOrders } from "@/lib/mockData";
import { OutletKey } from "@/types";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export function HourlyOrdersChart() {
  const { selectedOutlet } = useOutlet();

  const outletKey: OutletKey =
    selectedOutlet === "ALL"
      ? "all"
      : (selectedOutlet.toLowerCase() as OutletKey);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-gray-900">Hourly Orders</p>
        <p className="text-xs text-gray-500 mt-1">
          Orders placed throughout the day
        </p>
      </div>

      <div className="p-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyOrders[outletKey]}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar
              dataKey="orders"
              radius={[8, 8, 0, 0]}
              fill="#1D4ED8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
