"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* Example hourly data */
const data = [
  { hour: "9", orders: 12 },
  { hour: "10", orders: 18 },
  { hour: "11", orders: 25 },
  { hour: "12", orders: 40 },
  { hour: "13", orders: 48 },
  { hour: "14", orders: 42 },
  { hour: "15", orders: 30 },
  { hour: "16", orders: 22 },
];

export function HourlyOrdersChart() {
  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200 ">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-foreground">Hourly Orders</p>
        <p className="text-xs text-muted-foreground mt-1">
          Orders distribution across the day
        </p>
      </div>

      <div className="p-5 h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {/* Baby Pink Gradient */}
              <linearGradient id="hourlyPinkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBCFE8" stopOpacity={0.45} />
                <stop offset="65%" stopColor="#F9A8D4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#FBCFE8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
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

            <Area
              type="monotone"
              dataKey="orders"
              stroke="#EC4899"
              fill="url(#hourlyPinkFill)"
              strokeWidth={3}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
