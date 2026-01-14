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

export function RevenueChart() {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-gray-900">Revenue Trend</p>
        <p className="text-xs text-gray-500 mt-1">
          Monthly revenue performance
        </p>
      </div>

      <div className="p-5 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1D4ED8"
              fill="#1D4ED8"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
