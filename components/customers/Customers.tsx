"use client";

import { IndianRupee, Repeat2, Users } from "lucide-react";
import { useMemo, useState } from "react";

import type { Customer } from "@/lib/mockCustomers";
import { getOutletNames } from "@/lib/mockCustomers";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CustomersTable from "@/components/customers/CustomersTable";
import CustomerDetailsModal from "./CustomerDetailModal";

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

  /* ------------------ KPI CALCULATION (FIX) ------------------ */
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

    // % customers with 3+ orders (repeat proxy)
    const repeat3Plus = initialCustomers.filter(
      (c) => c.totalOrders >= 3
    ).length;

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-rose-900">Customers</h1>
        <p className="text-xs text-rose-600 mt-1">
          Repeat customers from the client app.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi
          icon={Users}
          label="Loyal Customers"
          value={kpi.loyalCustomers}
        />

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

        <Kpi
          label="Repeat Rate"
          value={`${kpi.repeatRate}%`}
        />
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
        <CardTitle className="text-sm font-semibold text-black-900 flex items-center gap-2">
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
