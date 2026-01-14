'use client';

import { useOutlet } from "@/context/OutletContext";
import { orderTypeSplit } from "@/lib/mockData";
import { OutletKey } from "@/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#1D4ED8", "#111827", "#E5E7EB"];

export function OrderTypeSplitChart() {
  const { selectedOutlet } = useOutlet();

  const outletKey: OutletKey =
    selectedOutlet === "ALL"
      ? "all"
      : (selectedOutlet.toLowerCase() as OutletKey);

  const data = orderTypeSplit[outletKey];

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-gray-900">Order Type Split</p>
        <p className="text-xs text-gray-500 mt-1">
          Dine-in vs Pack vs Online
        </p>
      </div>

      <div className="p-5 h-80 flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={4}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="font-medium">{d.name}</span>
              <span className="text-gray-400">({d.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
