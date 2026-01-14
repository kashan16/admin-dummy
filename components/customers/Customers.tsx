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

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function Customers({ initialCustomers }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("most_orders");
  const [selected, setSelected] = useState<Customer | null>(null);

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
        (a, b) => new Date(b.lastOrderAtISO).getTime() - new Date(a.lastOrderAtISO).getTime()
      );
    }

    return list;
  }, [initialCustomers, query, sort]);

  // KPI values
  const kpi = useMemo(() => {
    const loyalCount = initialCustomers.length;
    const totalOrders = initialCustomers.reduce((s, c) => s + c.totalOrders, 0);
    const totalSpent = initialCustomers.reduce((s, c) => s + c.totalSpent, 0);

    const avgOrders = loyalCount ? totalOrders / loyalCount : 0;
    const avgSpend = loyalCount ? totalSpent / loyalCount : 0;

    // "Repeat Rate Proxy": % of customers with >= 3 orders
    const repeat3 = initialCustomers.filter((c) => c.totalOrders >= 3).length;
    const repeatRateProxy = loyalCount ? Math.round((repeat3 / loyalCount) * 100) : 0;

    return {
      loyalCount,
      avgOrders,
      avgSpend,
      repeatRateProxy,
    };
  }, [initialCustomers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Customers</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Customers who ordered multiple times — loyalty reflection from the client app.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[320px]">
          </div>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-11 w-full sm:w-47.5 rounded-xl bg-card border border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="most_orders">Most Orders</SelectItem>
              <SelectItem value="most_spent">Most Spent</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="h-11 rounded-xl bg-blue-700 hover:bg-blue-800 transition-all duration-200 text-white"
            onClick={() => setQuery("")}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-700" />
              Loyal Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{kpi.loyalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Ordered 2+ times</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Repeat2 className="h-4 w-4 text-blue-700" />
              Avg Orders / Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {kpi.avgOrders.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">From loyal cohort</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-blue-700" />
              Avg Spend / Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {formatINR(kpi.avgSpend)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across repeat customers</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Repeat Rate Proxy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{kpi.repeatRateProxy}%</div>
            <p className="text-xs text-muted-foreground mt-1">Customers with 3+ orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <CustomersTable
        customers={filtered}
        onRowClick={(c) => setSelected(c)}
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
