/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IndianRupee, Repeat2, Users } from "lucide-react";
import { useMemo, useState } from "react";

import type { Customer } from "@/lib/mockCustomers";
import { getOutletNames } from "@/lib/mockCustomers";

import CustomersTable from "@/components/customers/CustomersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerDetailsModal from "./CustomerDetailModal";

import { Button } from "@/components/ui/button";
import { useExportCSV } from "@/hooks/useExportCSV";
import { formatISTDateTimeFilename } from "@/lib/mockData";
import { BiExport } from "react-icons/bi";

type Props = {
  initialCustomers: Customer[];
};

type SortKey = "most_orders" | "most_spent" | "recent";

/* ------------------ helpers ------------------ */
function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/* ------------------ component ------------------ */
export default function Customers({ initialCustomers }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("most_orders");
  const [selected, setSelected] = useState<Customer | null>(null);

  const { exportCSV } = useExportCSV();

  /* ------------------ KPI CALCULATION ------------------ */
  const kpi = useMemo(() => {
    const count = initialCustomers.length;

    if (!count) {
      return {
        loyalCustomers: 0,
        avgOrders: 0,
        avgSpend: 0,
        repeatRate: 0,
      };
    }

    const totalOrders = initialCustomers.reduce(
      (sum, c) => sum + c.totalOrders,
      0
    );

    const totalSpent = initialCustomers.reduce(
      (sum, c) => sum + c.totalSpent,
      0
    );

    const repeat3Plus = initialCustomers.filter((c) => c.totalOrders >= 3).length;

    return {
      loyalCustomers: count,
      avgOrders: totalOrders / count,
      avgSpend: totalSpent / count,
      repeatRate: Math.round((repeat3Plus / count) * 100),
    };
  }, [initialCustomers]);

  /* ------------------ FILTER + SORT ------------------ */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = initialCustomers.filter((c) => {
      if (!q) return true;
      const outlets = getOutletNames(c.outletIds).join(" ").toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        outlets.includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });

    if (sort === "most_orders") {
      list = [...list].sort((a, b) => b.totalOrders - a.totalOrders);
    }
    if (sort === "most_spent") {
      list = [...list].sort((a, b) => b.totalSpent - a.totalSpent);
    }
    if (sort === "recent") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.lastOrderAtISO).getTime() -
          new Date(a.lastOrderAtISO).getTime()
      );
    }

    return list;
  }, [initialCustomers, query, sort]);

  return (
    <div className="space-y-6 px-3 sm:px-6 lg:px-10 xl:px-14 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-rose-900">
            Customers
          </h1>
          <p className="text-sm text-rose-600">
            Repeat customers from the client app.
          </p>
        </div>

        {/* Export */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
            disabled={filtered.length === 0}
            onClick={() => {
              exportCSV(filtered, {
                filename: `customers_${formatISTDateTimeFilename()}.csv`,
                headers: {
                  id: "Customer ID",
                  name: "Customer Name",
                  phone: "Phone",
                  outletCount: "Outlets Visited",
                  outlets: "Outlet Names",
                  totalOrders: "Total Orders",
                  totalSpent: "Total Spent",
                  avgOrderValue: "Avg Order Value",
                  lastOrder: "Last Order (IST)",
                  lastOrderISO: "Last Order (ISO)",
                },
                mapRow: (c) => {
                  const outletNames = getOutletNames(c.outletIds);

                  return {
                    id: c.id,
                    name: c.name,
                    phone: c.phone ?? "—",
                    outletCount: outletNames.length,
                    outlets: outletNames.join(" | "),
                    totalOrders: c.totalOrders,
                    totalSpent: c.totalSpent,
                    avgOrderValue: Math.round(c.avgOrderValue),
                    lastOrder: formatDate(c.lastOrderAtISO),
                    lastOrderISO: c.lastOrderAtISO,
                  };
                },
              });
            }}
          >
            <BiExport className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi icon={Users} label="Loyal Customers" value={kpi.loyalCustomers} />
        <Kpi
          icon={Repeat2}
          label="Avg Orders / Customer"
          value={kpi.avgOrders.toFixed(1)}
        />
        <Kpi
          icon={IndianRupee}
          label="Avg Spend / Customer"
          value={formatINR(kpi.avgSpend)}
        />
        <Kpi label="Repeat Rate" value={`${kpi.repeatRate}%`} />
      </div>

      {/* Table */}
      <CustomersTable
        customers={filtered}
        onRowClick={setSelected}
        formatDate={formatDate}
        formatINR={formatINR}
      />

      {/* Modal */}
      <CustomerDetailsModal
        open={!!selected}
        customer={selected}
        onClose={() => setSelected(null)}
        formatDate={formatDate}
        formatINR={formatINR}
      />
    </div>
  );
}

/* ------------------ KPI Card ------------------ */
function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon?: any;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="bg-white border border-rose-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-rose-500" />}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-rose-900">{value}</div>
      </CardContent>
    </Card>
  );
}
