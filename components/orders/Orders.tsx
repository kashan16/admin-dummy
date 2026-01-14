"use client";

import { MOCK_OUTLETS, mockOrders } from "@/lib/mockData";
import type { Order, OrderStatus, OrderType, OutletScope } from "@/types";
import { useMemo, useState } from "react";
import { OrderModal } from "./OrderModal";
import { OrdersGrid } from "./OrdersGrid";
// Assuming you have lucide-react installed, otherwise replace with SVGs
import { ChevronDown, ListFilter, X } from "lucide-react";

/* -----------------------------------------
 * FILTER OPTIONS
 * ----------------------------------------*/
const STATUS_OPTIONS: Array<{ label: string; value: "all" | OrderStatus }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const TYPE_OPTIONS: Array<{ label: string; value: "all" | OrderType }> = [
  { label: "All", value: "all" },
  { label: "Table", value: "DINE_IN" },
  { label: "Pack", value: "PACK" },
  { label: "Delivery", value: "ORDER" },
];

const TYPE_TINT: Record<OrderType, string> = {
  DINE_IN: "bg-red-50 text-red-700 border-red-200 ring-red-500/20",
  PACK: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20",
  ORDER: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
};

const STATUS_TINT: Record<OrderStatus, string> = {
  pending: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20",
  accepted: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
  preparing: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
  delivered: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
};

type OrderWithOutletName = Order & { outletName: string };

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [outlet, setOutlet] = useState<OutletScope>("ALL");
  const [type, setType] = useState<"all" | OrderType>("all");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const outletNameById = useMemo(() => {
    return Object.fromEntries(MOCK_OUTLETS.map((o) => [o.id, o.name]));
  }, []);

  const filtered: OrderWithOutletName[] = useMemo(() => {
    return mockOrders
      .filter((o) => {
        if (outlet !== "ALL" && o.outlet !== outlet) return false;
        if (type !== "all" && o.type !== type) return false;
        if (status !== "all" && o.status !== status) return false;
        return true;
      })
      .map((o) => ({
        ...o,
        outletName: outletNameById[o.outlet] ?? "Unknown Outlet",
      }));
  }, [outlet, type, status, outletNameById]);

  const counts = useMemo(() => {
    const base = { pending: 0, accepted: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 };
    for (const o of filtered) { base[o.status] += 1; }
    return base;
  }, [filtered]);

  const activeFilterCount = [
    outlet !== "ALL",
    type !== "all",
    status !== "all"
  ].filter(Boolean).length;

  const clearFilters = () => {
    setOutlet("ALL");
    setType("all");
    setStatus("all");
  };

  const getPillClass = (isActive: boolean, val: string) => {
    const base = "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap";
    if (!isActive) return `${base} bg-transparent border-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600`;
    if (val === "all" || val === "ALL") return `${base} bg-gray-900 text-white border-gray-900 shadow-sm`;
    const tint = STATUS_TINT[val as OrderStatus] || TYPE_TINT[val as OrderType] || "bg-gray-100 border-gray-200 text-gray-700";
    return `${base} ${tint} shadow-sm ring-2`;
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Real-time order management</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              showFilters || activeFilterCount > 0 
                ? "bg-white border-gray-900 text-gray-900 shadow-sm" 
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-[10px] bg-gray-900 text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1" />

          <div className="px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 border border-gray-100">
            {filtered.length} Orders
          </div>
        </div>
      </div>

      {/* Collapsible Filter Section */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Refine Results</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs font-bold text-rose-600 flex items-center gap-1 hover:opacity-80">
                  <X className="w-3 h-3" /> Reset All
                </button>
              )}
            </div>

            <div className="grid gap-6">
              {/* Outlet */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Select Outlet</span>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setOutlet("ALL")} className={getPillClass(outlet === "ALL", "ALL")}>All Outlets</button>
                  {MOCK_OUTLETS.map((o) => (
                    <button key={o.id} onClick={() => setOutlet(o.id)} className={getPillClass(outlet === o.id, "neutral")}>
                      {o.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Type */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Service Type</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TYPE_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setType(opt.value)} className={getPillClass(type === opt.value, opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">Order Status</span>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setStatus(opt.value)} className={getPillClass(status === opt.value, opt.value)}>
                        {opt.label}
                        {opt.value !== 'all' && (
                          <span className="ml-1.5 opacity-50 font-normal">{counts[opt.value as OrderStatus]}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="pt-2">
        <OrdersGrid orders={filtered} onSelect={setSelectedOrder} />
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}