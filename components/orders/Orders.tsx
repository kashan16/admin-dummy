"use client";

import { useExportCSV } from "@/hooks/useExportCSV";
import { buildItemsText, calcSubtotal, calcTax, formatDateIST, formatISTDateTimeFilename, formatTimeIST, MOCK_OUTLETS, mockOrders } from "@/lib/mockData";
import type { Order, OrderStatus, OrderType, OutletScope } from "@/types";
import { ChevronDown, ListFilter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BiExport } from "react-icons/bi";
import { Button } from "../ui/button";
import { OrderModal } from "./OrderModal";
import { OrdersGrid } from "./OrdersGrid";

const STATUS_OPTIONS: Array<{ 
  label: string; 
  value: "all" | OrderStatus;
  color: string;
}> = [
  { label: "All", value: "all", color: "bg-black text-white hover:bg-black/90" },
  { label: "Pending", value: "pending", color: "bg-slate-500 text-white hover:bg-slate-600" },
  { label: "Delivered", value: "delivered", color: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { label: "Cancelled", value: "cancelled", color: "bg-rose-500 text-white hover:bg-rose-600" },
];

const TYPE_OPTIONS: Array<{ 
  label: string; 
  value: "all" | OrderType;
  color: string;
}> = [
  { label: "All", value: "all", color: "bg-black text-white hover:bg-black/90" },
  { label: "Table", value: "DINE_IN", color: "bg-green-500 text-white hover:bg-green-600" },
  { label: "Pack", value: "PACK", color: "bg-yellow-500 text-white hover:bg-yellow-600" },
  { label: "Delivery", value: "ORDER", color: "bg-red-500 text-white hover:bg-red-600" },
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [outlet, setOutlet] = useState<OutletScope>("ALL");
  const [type, setType] = useState<"all" | OrderType>("all");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const { exportCSV } = useExportCSV();

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
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Orders
          </h1>
          <p className="text-sm text-gray-500">
            Real-time order management
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
            disabled={filtered.length === 0}
            onClick={() => {
              exportCSV(filtered, {
                filename: `${formatISTDateTimeFilename()}.csv`,
                headers: {
                  id: "Order ID",
                  customer: "Customer",
                  outletName: "Outlet Name",
                  outlet: "Outlet ID",
                  type: "Order Type",
                  status: "Status",
                  table: "Table",
                  createdDate: "Created Date (IST)",
                  createdTime: "Created Time (IST)",
                  createdAtISO: "Created At (ISO)",
                  itemsCount: "Items Count",
                  itemsText: "Items (Readable)",
                  itemsJSON: "Items (JSON)",
                  subtotal: "Subtotal",
                  tax: "Tax (5%)",
                  total: "Total",
                },
                mapRow: (o) => {
                  const subtotal = calcSubtotal(o);
                  const tax = calcTax(subtotal);
                  const total = subtotal + tax;

                  const itemsCount = o.items.reduce((sum, it) => sum + it.quantity, 0);

                  return {
                    id: o.id,
                    customer: o.customer,
                    outletName: o.outletName ?? "",
                    outlet: o.outlet,
                    type: o.type,
                    status: o.status,
                    table: o.table === "-" ? "—" : o.table,
                    createdDate: formatDateIST(o.createdAt),
                    createdTime: formatTimeIST(o.createdAt),
                    createdAtISO: o.createdAt,
                    itemsCount,
                    itemsText: buildItemsText(o),
                    // ✅ Useful for re-importing later
                    itemsJSON: JSON.stringify(o.items),
                    subtotal,
                    tax,
                    total,
                  }
                }
              })
            }}>
              <BiExport className="w-5 h-5"/>
          </Button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors shrink-0"
        >
          <ListFilter className="w-4 h-4" />
          <span className="text-sm font-semibold hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 text-[10px] bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
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

      {/* Filters */}
      <div
        className={`transition-all duration-300 ${
          showFilters
            ? "max-h-250 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 border space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold">Refine Results</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setOutlet("ALL");
                  setType("all");
                  setStatus("all");
                }}
                className="text-xs font-bold flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-3 h-3" /> Reset All
              </button>
            )}
          </div>

          <div className="grid gap-6">
            {/* Outlet Filter */}
            <div>
              <p className="text-xs font-bold mb-3 text-gray-700">Outlet</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOutlet("ALL")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    outlet === "ALL"
                      ? "bg-blue-500 text-white shadow-md scale-105"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All Outlets
                </button>
                {MOCK_OUTLETS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOutlet(o.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      outlet === o.id
                        ? "bg-blue-500 text-white shadow-md scale-105"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Type Filter */}
              <div>
                <p className="text-xs font-bold mb-3 text-gray-700">Order Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        type === t.value
                          ? `${t.color} shadow-md scale-105`
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <p className="text-xs font-bold mb-3 text-gray-700">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStatus(s.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        status === s.value
                          ? `${s.color} shadow-md scale-105`
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
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