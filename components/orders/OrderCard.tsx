"use client";

import type { Order, OrderStatus, OrderType } from "@/types";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bike,
  ChevronDown,
  ChevronUp,
  Package,
  Utensils,
} from "lucide-react";

interface OrderCardProps {
  order: Order & { outletName?: string };
  onClick: () => void;
}

/* ---------------------------------- */
/* Status pill styles */
/* ---------------------------------- */
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gray-200 text-gray-700",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

/* ---------------------------------- */
/* Left border accent by STATUS */
/* ---------------------------------- */
const STATUS_BORDER_STYLES: Record<OrderStatus, string> = {
  pending: "border-l-gray-500",
  delivered: "border-l-green-500",
  cancelled: "border-l-red-500",
};

/* ---------------------------------- */
/* Icon-first service type config */
/* ---------------------------------- */
const TYPE_ICON: Record<
  OrderType,
  {
    Icon: React.ElementType;
    className: string;
    label: string;
  }
> = {
  DINE_IN: {
    Icon: Utensils,
    className: "bg-red-500/15 text-red-700 border-red-500/20",
    label: "Dine In",
  },
  PACK: {
    Icon: Package,
    className: "bg-yellow-500/15 text-yellow-800 border-yellow-500/20",
    label: "Takeaway",
  },
  ORDER: {
    Icon: Bike,
    className: "bg-green-500/15 text-green-800 border-green-500/20",
    label: "Delivery",
  },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const items = useMemo(() => order.items ?? [], [order.items]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    [items]
  );

  const amount = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 0),
        0
      ),
    [items]
  );

  const statusClass = STATUS_STYLES[order.status];
  const borderAccent =
    STATUS_BORDER_STYLES[order.status] ?? STATUS_BORDER_STYLES.pending;

  const typeIcon = TYPE_ICON[order.type];
  const TypeIcon = typeIcon.Icon;

  const timeText = useMemo(
    () => formatTime(order.createdAt),
    [order.createdAt]
  );

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
        "cursor-pointer rounded-2xl border border-l-4 bg-white p-4 shadow-sm transition-all",
        "hover:shadow-md hover:scale-[1.02]",
        "h-full flex flex-col",
        borderAccent,
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-semibold truncate text-gray-900">
              {order.customer}
            </h3>

            {/* Service type icons */}
            <div className="flex items-center gap-1 shrink-0">
              <span
                title={typeIcon.label}
                aria-label={typeIcon.label}
                className={[
                  "inline-flex h-6 w-6 items-center justify-center rounded-full border",
                  "transition-transform hover:scale-105",
                  typeIcon.className,
                ].join(" ")}
              >
                <TypeIcon className="h-3.5 w-3.5" />
              </span>

              {(order.type === "DINE_IN" || order.type === "PACK") &&
                order.table && (
                  <span
                    title={`Table ${order.table}`}
                    aria-label={`Table ${order.table}`}
                    className="h-6 min-w-6 px-1.5 rounded-full
                               flex items-center justify-center
                               text-[11px] font-bold
                               bg-black/10 text-black"
                  >
                    {order.table}
                  </span>
                )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1 truncate">
            <span className="font-medium text-gray-700">
              {order.outletName ?? order.outlet}
            </span>{" "}
            <span className="opacity-70">•</span> {timeText}
          </p>
        </div>

        {/* Amount */}
        <Badge className="text-xs bg-black/10 text-black border-black/15 shrink-0">
          ₹{amount}
        </Badge>
      </div>

      {/* STATUS + ITEM COUNT */}
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

      {/* ITEMS - flex-1 to take remaining space */}
      <div className="mt-3 space-y-1 flex-1 flex flex-col">
        <div className="space-y-1">
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
        </div>

        {/* SEE MORE / LESS - push to bottom */}
        {items.length > 2 && (
          <div className="pt-2 mt-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
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