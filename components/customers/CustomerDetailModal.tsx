/* eslint-disable @typescript-eslint/no-explicit-any */
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
      <DialogContent className="bg-white border border-rose-200 shadow-xl rounded-3xl p-0 max-w-180">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-rose-200">
          <DialogTitle className="text-sm font-semibold text-rose-900">
            Customer Details
          </DialogTitle>
          <p className="text-xs text-rose-600 mt-1">
            View repeat customer profile (read-only).
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto no-scrollbar space-y-5">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-900">
                  {customer.name}
                </h3>
                <p className="text-xs text-rose-600 mt-1">{customer.id}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-rose-600">Last Order</p>
                <p className="text-sm font-semibold text-rose-900 mt-1">
                  {formatDate(customer.lastOrderAtISO)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Stat
              icon={ReceiptText}
              label="Orders"
              value={customer.totalOrders}
            />
            <Stat
              icon={IndianRupee}
              label="Total Spent"
              value={formatINR(customer.totalSpent)}
            />
            <Stat
              icon={Clock}
              label="Avg Order"
              value={formatINR(customer.avgOrderValue)}
            />
            <Stat
              icon={Building2}
              label="Outlets"
              value={outletNames.length}
            />
          </div>

          {/* Outlet list */}
          <div className="bg-white border border-rose-200 shadow-sm rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-rose-900">
              Visited Outlets
            </h4>
            <p className="text-xs text-rose-600 mt-1">
              Branches where this customer placed repeat orders.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {outletNames.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-full bg-rose-50 text-xs text-rose-900 border border-rose-200"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-rose-200 flex justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-rose-300 text-rose-900 hover:bg-rose-50"
            onClick={onClose}
          >
            Close
          </Button>

          <Button className="rounded-xl bg-[#FB7185] hover:bg-[#F43F5E] text-white">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border border-rose-200 shadow-sm rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wide">
        <Icon className="h-4 w-4 text-rose-500" />
        {label}
      </div>
      <div className="text-2xl font-bold text-rose-900 mt-2">{value}</div>
    </div>
  );
}
