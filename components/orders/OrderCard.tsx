"use client";

import type { Order, OrderStatus, OrderType } from "@/types";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OrderCardProps {
  order: Order & { outletName?: string }; // ✅ optional, if you pass outletName from Orders page
  onClick: () => void;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gray-200 text-gray-700",
  accepted: "bg-purple-200 text-purple-800",
  preparing: "bg-yellow-200 text-yellow-800",
  ready: "bg-blue-200 text-blue-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

const TYPE_TINT_STYLES: Record<OrderType, string> = {
  DINE_IN: "bg-red-100 border-red-200",
  PACK: "bg-yellow-100 border-yellow-200",
  ORDER: "bg-green-100 border-green-200",
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
  // createdAt is already ISO, so just render time cleanly
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const items = useMemo(() => order.items ?? [], [order.items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }, [items]);

  const amount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const statusClass = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
  const typeTint = TYPE_TINT_STYLES[order.type] ?? "bg-white border-gray-200";
  const typeBadge = TYPE_BADGE[order.type];

  const timeText = useMemo(() => formatTime(order.createdAt), [order.createdAt]);

  const contextText =
    order.type === "ORDER"
      ? order.customer // delivery context
      : order.table
        ? `#${order.table}`
        : "—";

  const visibleItems = expanded ? items : items.slice(0, 2);
  const remainingCount = Math.max(0, items.length - 2);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={[
        "cursor-pointer rounded-2xl border p-4 shadow-sm transition-all",
        "hover:shadow-md hover:scale-[1.02]",
        typeTint,
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-semibold truncate text-gray-900">
              {order.customer}
            </h3>

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

          <p className="text-xs text-gray-500 mt-1 truncate">
            <span className="font-medium text-gray-700">
              {order.outletName ?? order.outlet}
            </span>{" "}
            <span className="opacity-70">•</span>{" "}
            {order.type === "ORDER"
              ? "Delivery"
              : order.type === "PACK"
                ? "Pack"
                : "Table"}{" "}
            <span className="opacity-70">•</span> {contextText}{" "}
            <span className="opacity-70">•</span> {timeText}
          </p>
        </div>

        {/* Amount */}
        <Badge className="text-xs bg-black/10 text-black border-black/15 shrink-0">
          ₹{amount}
        </Badge>
      </div>

      {/* STATUS + COUNT */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={[
            "inline-block px-2 py-0.5 text-[10px] rounded-md font-semibold capitalize",
            statusClass,
          ].join(" ")}
        >
          {order.status}
        </span>

        <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-semibold text-gray-900 border border-black/5 shrink-0">
          {totalItems} items
        </span>
      </div>

      {/* ITEMS */}
      <div className="mt-3 space-y-1">
        {visibleItems.map((item, idx) => {
          const name = item.name?.trim() || "Item";
          const qty = item.quantity ?? 0;

          return (
            <div key={idx} className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-gray-900">
                {name}
              </p>

              <span className="shrink-0 px-2 py-0.5 text-[11px] font-extrabold rounded-md border bg-white/70">
                ×{qty}
              </span>
            </div>
          );
        })}

        {/* SEE MORE / LESS */}
        {items.length > 2 && (
          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // ✅ don't open modal
                setExpanded((v) => !v);
              }}
              className="h-8 px-2 text-xs text-gray-500 hover:text-gray-900"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  See less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  See {remainingCount} more
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
