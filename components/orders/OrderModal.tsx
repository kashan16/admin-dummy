"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Order, OrderStatus } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BillPrint } from "./BillPrint";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    badge: string;
    next: OrderStatus[];
  }
> = {
  pending: {
    label: "Pending",
    badge: "bg-gray-300 text-gray-800",
    next: ["delivered", "cancelled"],
  },
  delivered: {
    label: "Delivered",
    badge: "bg-green-200 text-green-800",
    next: [],
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-200 text-red-800",
    next: [],
  },
};

export function OrderModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order & { outletName?: string };
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const subtotal = useMemo(
    () => order.items.reduce((s, i) => s + i.price * i.quantity, 0),
    [order.items]
  );

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const statusConfig = STATUS_CONFIG[currentStatus];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setStatusLoading(true);
    setCurrentStatus(newStatus);
    onStatusChange?.(order.id, newStatus);
    setStatusMenuOpen(false);
    setStatusLoading(false);
  };

  useEffect(() => {
    if (statusMenuOpen) {
      // Optional: you can add a toast notification here
    }
  }, [statusMenuOpen]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* STATUS BADGE */}
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}
            >
              {statusConfig.label}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{order.customer}</p>
              <p className="text-xs text-gray-500">
                {order.outletName ?? order.outlet}
              </p>
            </div>
            <Badge>₹{total}</Badge>
          </div>

          <div className="space-y-2">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="truncate">{i.name}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-2 space-y-1 text-sm">
            <Row label="Subtotal" value={`₹${subtotal}`} />
            <Row label="Tax" value={`₹${tax}`} />
            <Row label="Total" value={`₹${total}`} bold />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <Button onClick={() => window.print()}>Print</Button>
          </div>

          {/* STATUS CHANGE SECTION */}
          <div className="border-t pt-4 flex justify-center relative">
            <AnimatePresence>
              {statusMenuOpen && statusConfig.next.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-3 w-[85%] rounded-2xl border bg-background shadow-lg overflow-hidden"
                >
                  {statusConfig.next.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="w-full px-4 py-2 text-left hover:bg-muted capitalize text-sm"
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="outline"
              className="w-[85%]"
              disabled={statusLoading || statusConfig.next.length === 0}
              onClick={() => setStatusMenuOpen((p) => !p)}
            >
              {statusLoading ? "Updating…" : statusConfig.next.length === 0 ? order.status : 'Pending'}
            </Button>
          </div>
        </div>

        <BillPrint order={order} subtotal={subtotal} tax={tax} total={total} />
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}