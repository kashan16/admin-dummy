"use client";

import { useOutlet } from "@/context/OutletContext";
import { kpis } from "@/lib/mockData";
import { OutletKey } from "@/types";

import { HourlyOrdersChart } from "./HourlyOrdersChart";
import { KPIGrid } from "./KPIGrid";
import { OrderTypeSplitChart } from "./OrderTypeSplitChart";
import { RevenueChart } from "./RevenueChart";

export default function Dashboard() {
  const { selectedOutlet } = useOutlet();

  const key =
    selectedOutlet === "ALL"
      ? "all"
      : (selectedOutlet.toLowerCase() as OutletKey);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Analytics Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Premium overview of revenue, orders, customers & outlet performance.
          </p>
        </div>
      </div>
      {/* KPIs */}
      <KPIGrid data={kpis[key]} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-w-0">
          <RevenueChart />
        </div>
        <div className="min-w-0">
          <OrderTypeSplitChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="min-w-0">
          <HourlyOrdersChart />
        </div>
      </div>
    </div>
  );
}
