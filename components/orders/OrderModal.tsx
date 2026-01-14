"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import { useMemo } from "react";
import { BillPrint } from "./BillPrint";

export function OrderModal({
  order,
  onClose,
}: {
  order: Order & { outletName?: string };
  onClose: () => void;
}) {
  const subtotal = useMemo(
    () => order.items.reduce((s, i) => s + i.price * i.quantity, 0),
    [order.items]
  );

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.print()}>Print</Button>
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
