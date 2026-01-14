'use client';

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of revenue, orders and outlet performance.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <KPIGrid data={kpis[key]} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <HourlyOrdersChart />
      </div>

      {/* Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderTypeSplitChart />
      </div>
    </div>
  );
}
