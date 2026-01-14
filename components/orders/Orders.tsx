"use client";

import { MOCK_OUTLETS, mockOrders } from "@/lib/mockData";
import type { Order, OrderStatus, OrderType, OutletScope } from "@/types";
import { useMemo, useState } from "react";
import { OrderModal } from "./OrderModal";
import { OrdersGrid } from "./OrdersGrid";
import { ChevronDown, ListFilter, X } from "lucide-react";

const STATUS_OPTIONS: Array<{ label: string; value: "all" | OrderStatus }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const TYPE_OPTIONS: Array<{ label: string; value: "all" | OrderType }> = [
  { label: "All", value: "all" },
  { label: "Table", value: "DINE_IN" },
  { label: "Pack", value: "PACK" },
  { label: "Delivery", value: "ORDER" },
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [outlet, setOutlet] = useState<OutletScope>("ALL");
  const [type, setType] = useState<"all" | OrderType>("all");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const outletNameById = useMemo(
    () => Object.fromEntries(MOCK_OUTLETS.map((o) => [o.id, o.name])),
    []
  );

  const filtered = useMemo(() => {
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

  const activeFilterCount = [
    outlet !== "ALL",
    type !== "all",
    status !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 px-3 sm:px-6 lg:px-10 xl:px-14 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Orders
          </h1>
          <p className="text-sm text-gray-500">
            Real-time order management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border"
          >
            <ListFilter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 text-[10px] rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`transition-all duration-300 ${
          showFilters
            ? "max-h-250 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 sm:p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold">Refine Results</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setOutlet("ALL");
                  setType("all");
                  setStatus("all");
                }}
                className="text-xs font-bold flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          <div className="grid gap-6">
            <div>
              <p className="text-xs font-bold mb-2">Outlet</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setOutlet("ALL")}>All</button>
                {MOCK_OUTLETS.map((o) => (
                  <button key={o.id} onClick={() => setOutlet(o.id)}>
                    {o.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((t) => (
                    <button key={t.value} onClick={() => setType(t.value)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => setStatus(s.value)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrdersGrid orders={filtered} onSelect={setSelectedOrder} />

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
