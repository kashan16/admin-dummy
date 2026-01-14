"use client";

import { Building2, Clock, IndianRupee, ReceiptText } from "lucide-react";

import type { Customer } from "@/lib/mockCustomers";
import { getOutletNames } from "@/lib/mockCustomers";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  formatDate: (iso: string) => string;
  formatINR: (n: number) => string;
};

export default function CustomerDetailsModal({
  open,
  customer,
  onClose,
  formatDate,
  formatINR,
}: Props) {
  if (!customer) return null;

  const outletNames = getOutletNames(customer.outletIds);

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="bg-card border border-border shadow-xl rounded-3xl p-0 max-w-180">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Customer Details
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            View repeat customer profile (read-only).
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto no-scrollbar space-y-5">
          <div className="bg-indigo-50 border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{customer.id}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Order</p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {formatDate(customer.lastOrderAtISO)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <ReceiptText className="h-4 w-4 text-blue-700" />
                Orders
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {customer.totalOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Repeat customer</p>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <IndianRupee className="h-4 w-4 text-blue-700" />
                Total Spent
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {formatINR(customer.totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all orders</p>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Clock className="h-4 w-4 text-blue-700" />
                Avg Order
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {formatINR(customer.avgOrderValue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average value</p>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Building2 className="h-4 w-4 text-blue-700" />
                Outlets
              </div>
              <div className="text-2xl font-bold text-foreground mt-2">
                {outletNames.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Visited branches</p>
            </div>
          </div>

          {/* Outlet list */}
          <div className="bg-card border border-border shadow-sm rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-foreground">Visited Outlets</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Branches where this customer has placed repeat orders.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {outletNames.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-full bg-indigo-50 text-xs text-foreground border border-border"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            className="rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-all duration-200"
            onClick={onClose}
          >
            Close
          </Button>

          <Button className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white transition-all duration-200">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
