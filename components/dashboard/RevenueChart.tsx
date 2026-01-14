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

const data = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 48000 },
  { month: "Mar", revenue: 46000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 61000 },
];

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function RevenueChart() {
  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200 min-w-0">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-foreground">Revenue Trend</p>
        <p className="text-xs text-muted-foreground mt-1">
          Monthly revenue performance (colorful gradient insight)
        </p>
      </div>

      <div className="p-5 h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-2xl border border-border bg-card shadow-md px-4 py-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {formatINR(payload[0].value as number)}
                    </p>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1D4ED8"
              fill="url(#revFill)"
              strokeWidth={3}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
