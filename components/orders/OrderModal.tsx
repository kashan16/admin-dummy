"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Order, OrderStatus, OrderType } from "@/types";
import { useMemo, useState } from "react";
import { BillPrint } from "./BillPrint";

// ✅ mock update function
import { updateMockOrderStatus } from "@/lib/mockData";

/* -----------------------------------------
 * UI STYLES
 * ----------------------------------------*/
const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badge: string; next: OrderStatus[] }
> = {
  pending: {
    label: "Pending",
    badge: "bg-gray-200 text-gray-700 border-gray-300",
    next: ["accepted", "cancelled"],
  },
  accepted: {
    label: "Accepted",
    badge: "bg-purple-200 text-purple-800 border-purple-300",
    next: ["preparing", "cancelled"],
  },
  preparing: {
    label: "Preparing",
    badge: "bg-yellow-200 text-yellow-800 border-yellow-300",
    next: ["ready", "cancelled"],
  },
  ready: {
    label: "Ready",
    badge: "bg-blue-200 text-blue-800 border-blue-300",
    next: ["delivered"],
  },
  delivered: {
    label: "Delivered",
    badge: "bg-green-200 text-green-800 border-green-300",
    next: [],
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-200 text-red-800 border-red-300",
    next: [],
  },
};

const TYPE_TINT: Record<OrderType, string> = {
  DINE_IN: "bg-red-500/10 border-red-500/20",
  PACK: "bg-yellow-500/10 border-yellow-500/20",
  ORDER: "bg-green-500/10 border-green-500/20",
};

const TYPE_BADGE: Record<OrderType, { label: string; className: string }> = {
  DINE_IN: {
    label: "TABLE",
    className: "bg-red-500/15 text-red-700 border-red-500/20",
  },
  PACK: {
    label: "PACK",
    className: "bg-yellow-500/15 text-yellow-800 border-yellow-500/20",
  },
  ORDER: {
    label: "DELIVERY",
    className: "bg-green-500/15 text-green-800 border-green-500/20",
  },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

/* -----------------------------------------
 * COMPONENT
 * ----------------------------------------*/
export function OrderModal({
  order,
  onClose,
}: {
  order: Order & { outletName?: string };
  onClose: () => void;
}) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const subtotal = useMemo(() => {
    return order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }, [order.items]);

  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const discount = 0;
  const total = subtotal + tax - discount;

  const totalItems = useMemo(() => {
    return order.items.reduce((sum, i) => sum + i.quantity, 0);
  }, [order.items]);

  const status = STATUS_CONFIG[order.status];
  const typeTint = TYPE_TINT[order.type];
  const typeBadge = TYPE_BADGE[order.type];

  const contextText =
    order.type === "ORDER"
      ? "Delivery"
      : order.type === "PACK"
        ? "Pack"
        : "Table";

  const outletText = order.outletName ?? order.outlet;

  async function handleStatusChange(nextStatus: OrderStatus) {
    try {
      setUpdating(true);

      // ✅ update mock data (in-place)
      updateMockOrderStatus(order.id, nextStatus);

      // ✅ close modal (same behavior style as admin panel)
      onClose();
    } finally {
      setUpdating(false);
      setStatusMenuOpen(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[92%] max-h-[85vh] overflow-y-auto p-4 rounded-3xl bg-white border shadow-xl no-scrollbar">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Order Details
          </DialogTitle>

          {/* Status pill */}
          <div className="flex justify-center">
            <span
              className={[
                "px-3 py-1 rounded-full text-xs font-semibold border",
                status.badge,
              ].join(" ")}
            >
              {status.label}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Card */}
          <div
            className={[
              "rounded-2xl border p-4 space-y-3 shadow-sm",
              typeTint,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {order.customer}
                  </p>

                  <Badge
                    variant="outline"
                    className={[
                      "text-[10px] font-extrabold px-2 py-0.5 rounded-full border",
                      typeBadge.className,
                    ].join(" ")}
                  >
                    {typeBadge.label}
                    {(order.type === "DINE_IN" || order.type === "PACK") &&
                      order.table &&
                      ` • ${order.table}`}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 mt-1">
                  Order <span className="font-semibold">#{order.id}</span>
                </p>
              </div>

              <Badge className="text-xs bg-black/10 text-black border-black/15 shrink-0">
                ₹{total}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoTile label="Outlet" value={outletText} />
              <InfoTile label="Type" value={contextText} />
              <InfoTile
                label={order.type === "ORDER" ? "Customer" : "Table"}
                value={
                  order.type === "ORDER" ? order.customer : order.table || "—"
                }
              />
              <InfoTile label="Order Time" value={formatTime(order.createdAt)} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/5">
              <span className="text-xs text-gray-600">Total Items</span>
              <span className="text-xs font-semibold text-gray-900">
                {totalItems}
              </span>
            </div>
          </div>

          {/* Bill Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Bill Items
            </h3>

            <div className="rounded-2xl border bg-gray-50 p-3">
              <div className="grid grid-cols-12 text-[11px] text-gray-500 font-semibold pb-2 border-b border-gray-200">
                <div className="col-span-7">NAME</div>
                <div className="col-span-2 text-center">QTY</div>
                <div className="col-span-3 text-right">TOTAL</div>
              </div>

              <div className="pt-3 space-y-3">
                {order.items.map((item, idx) => {
                  const line = item.price * item.quantity;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-7 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <span className="text-sm font-extrabold px-2 py-0.5 rounded-md border bg-white">
                            ×{item.quantity}
                          </span>
                        </div>

                        <div className="col-span-3 text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{line}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200/70" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-gray-200 space-y-2">
            <PriceRow label="Subtotal" value={`₹${subtotal}`} />
            <PriceRow label="Tax (5%)" value={`₹${tax}`} />
            <div className="flex justify-between pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-blue-700">₹{total}</span>
            </div>
          </div>

          {/* ✅ STATUS ACTION (New UI, same feature set) */}
          {status.next.length > 0 && (
            <div className="pt-2 relative flex justify-center">
              {/* Menu */}
              {statusMenuOpen && (
                <div className="absolute bottom-full mb-2 w-full rounded-2xl border bg-white shadow-lg overflow-hidden">
                  {status.next.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="w-full px-4 py-2 text-left text-sm capitalize hover:bg-gray-50 transition"
                      disabled={updating}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-200"
                disabled={updating}
                onClick={() => setStatusMenuOpen((p) => !p)}
              >
                {updating ? "Updating..." : "Change Status"}
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-gray-200"
              onClick={onClose}
            >
              Close
            </Button>

            <Button
              className="rounded-xl bg-blue-700 hover:bg-blue-800"
              onClick={() => window.print()}
            >
              Print Bill
            </Button>
          </div>
        </div>

        {/* PRINT ONLY */}
        <BillPrint order={order} subtotal={subtotal} tax={tax} total={total} />
      </DialogContent>
    </Dialog>
  );
}

/* -----------------------------------------
 * UI HELPERS
 * ----------------------------------------*/
function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white/60 px-3 py-2">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
