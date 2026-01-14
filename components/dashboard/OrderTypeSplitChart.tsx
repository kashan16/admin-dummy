"use client";

import { useOutlet } from "@/context/OutletContext";
import { orderTypeSplit } from "@/lib/mockData";
import { OutletKey } from "@/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#1D4ED8", // Dine-in (blue)
  "#9333EA", // Pack (purple)
  "#22C55E", // Online (green)
];

export function OrderTypeSplitChart() {
  const { selectedOutlet } = useOutlet();

  const outletKey: OutletKey =
    selectedOutlet === "ALL"
      ? "all"
      : (selectedOutlet.toLowerCase() as OutletKey);

  const data = orderTypeSplit[outletKey];

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200 min-w-0">
      <div className="px-5 pt-5">
        <p className="text-sm font-semibold text-foreground">Order Type Split</p>
        <p className="text-xs text-muted-foreground mt-1">
          Dine-in vs Pack vs Online (easy to read)
        </p>
      </div>

      <div className="p-5 h-80 flex flex-col min-w-0">
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={110}
                paddingAngle={4}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0];
                  return (
                    <div className="rounded-2xl border border-border bg-card shadow-md px-4 py-3">
                      <p className="text-xs text-muted-foreground">{p.name}</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {p.value}%
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="font-medium text-foreground">{d.name}</span>
              <span className="text-muted-foreground">({d.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
