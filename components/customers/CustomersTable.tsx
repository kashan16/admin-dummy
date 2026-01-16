"use client";

import type { Customer } from "@/lib/mockCustomers";
import { getOutletNames } from "@/lib/mockCustomers";

type Props = {
  customers: Customer[];
  onRowClick: (customer: Customer) => void;
  formatDate: (iso: string) => string;
  formatINR: (n: number) => string;
};

export default function CustomersTable({
  customers,
  onRowClick,
  formatDate,
  formatINR,
}: Props) {
  if (!customers.length) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-rose-900">
          No customers found
        </p>
        <p className="text-xs text-rose-600 mt-1">
          Try changing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-rose-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-rose-200 flex justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-900">
            Repeat Customers
          </p>
          <p className="text-xs text-rose-600 mt-1">
            Tap a customer to view details.
          </p>
        </div>
        <p className="text-xs text-rose-600">
          Showing{" "}
          <span className="font-semibold text-rose-900">
            {customers.length}
          </span>
        </p>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden p-4 space-y-3">
        {customers.map((c) => {
          const outlets = getOutletNames(c.outletIds);
          return (
            <div
              key={c.id}
              onClick={() => onRowClick(c)}
              className="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <p className="font-semibold text-rose-900">{c.name}</p>
              <p className="text-xs text-rose-600">{c.phone}</p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Tile label="Orders" value={String(c.totalOrders)} />
                <Tile label="Avg Order" value={formatINR(c.avgOrderValue)} />
                <Tile label="Last Order" value={formatDate(c.lastOrderAtISO)} />
                <Tile label="Outlets" value={`${outlets.length}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-50">
            <tr className="text-xs font-semibold text-rose-600">
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">ID</th>
              <th className="px-5 py-3 text-right">Orders</th>
              <th className="px-5 py-3 text-right">Total Spent</th>
              <th className="px-5 py-3 text-right">Avg Order</th>
              <th className="px-5 py-3 text-right">Last Order</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => onRowClick(c)}
                className="border-t border-rose-200 hover:bg-rose-50 cursor-pointer"
              >
                <td className="px-5 py-4 font-semibold text-black-900">
                  {c.name}
                </td>
                <td className="px-5 py-4 text-grey-600">{c.phone}</td>
                <td className="px-5 py-4 text-right">{c.totalOrders}</td>
                <td className="px-5 py-4 text-right">
                  {formatINR(c.totalSpent)}
                </td>
                <td className="px-5 py-4 text-right">
                  {formatINR(c.avgOrderValue)}
                </td>
                <td className="px-5 py-4 text-right">
                  {formatDate(c.lastOrderAtISO)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
      <p className="text-[11px] font-medium text-rose-600">{label}</p>
      <p className="text-sm font-semibold text-rose-900 truncate">{value}</p>
    </div>
  );
}
