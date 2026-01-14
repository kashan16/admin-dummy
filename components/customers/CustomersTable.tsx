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
  if (customers.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-gray-900">No customers found</p>
        <p className="text-xs text-gray-500 mt-1">
          Try switching filters to view other customers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      {/* Header (same as reservations style) */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Repeat Customers</p>
          <p className="text-xs text-gray-500 mt-1">
            Tap a customer to view full details.
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">{customers.length}</span>
        </div>
      </div>

      {/* ✅ MOBILE VIEW (Cards) */}
      <div className="block md:hidden p-4 space-y-3">
        {customers.map((c) => {
          const outletNames = getOutletNames(c.outletIds);

          return (
            <div
              key={c.id}
              onClick={() => onRowClick(c)}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 truncate">{c.id}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatINR(c.totalSpent)}
                  </p>
                </div>
              </div>

              {/* info grid (same as reservations tiles style) */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <InfoTile label="Orders" value={String(c.totalOrders)} />
                <InfoTile label="Avg Order" value={formatINR(c.avgOrderValue)} />
                <InfoTile label="Last Order" value={formatDate(c.lastOrderAtISO)} />
                <InfoTile
                  label="Outlets"
                  value={`${outletNames.length} outlet${
                    outletNames.length > 1 ? "s" : ""
                  }`}
                />
              </div>

              {/* outlets chips */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-[11px] font-medium text-gray-500 mb-2">
                  Outlet Visits
                </p>

                <div className="flex flex-wrap gap-2">
                  {outletNames.slice(0, 3).map((name) => (
                    <span
                      key={name}
                      className="px-2 py-1 rounded-full bg-gray-50 text-xs text-gray-700 border border-gray-200"
                    >
                      {name}
                    </span>
                  ))}

                  {outletNames.length > 3 && (
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-500 border border-gray-200">
                      +{outletNames.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ DESKTOP VIEW (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-xs font-semibold text-gray-500">
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Customer ID</th>
              <th className="text-left px-5 py-3">Outlets</th>
              <th className="text-right px-5 py-3">Orders</th>
              <th className="text-right px-5 py-3">Total Spent</th>
              <th className="text-right px-5 py-3">Avg Order</th>
              <th className="text-right px-5 py-3 whitespace-nowrap">
                Last Order
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => {
              const outletNames = getOutletNames(c.outletIds);

              return (
                <tr
                  key={c.id}
                  onClick={() => onRowClick(c)}
                  className="border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {outletNames.length} outlet
                        {outletNames.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">{c.id}</td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {outletNames.slice(0, 2).map((name) => (
                        <span
                          key={name}
                          className="px-2 py-1 rounded-full bg-gray-50 text-xs text-gray-700 border border-gray-200"
                        >
                          {name}
                        </span>
                      ))}

                      {outletNames.length > 2 && (
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-500 border border-gray-200">
                          +{outletNames.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-gray-900">
                    {c.totalOrders}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-gray-900">
                    {formatINR(c.totalSpent)}
                  </td>

                  <td className="px-5 py-4 text-right text-gray-600">
                    {formatINR(c.avgOrderValue)}
                  </td>

                  <td className="px-5 py-4 text-right text-gray-600 whitespace-nowrap">
                    {formatDate(c.lastOrderAtISO)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -----------------------------------------
 * Tile helper (same feel as reservations cards)
 * ----------------------------------------*/
function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}
