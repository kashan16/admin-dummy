"use client";

import { Badge } from "@/components/ui/badge";
import type { Reservation, ReservationStatus } from "@/types";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Phone, Table2, Users } from "lucide-react";
import { useMemo } from "react";

interface ReservationCardProps {
  reservation: Reservation;
  onClick: () => void;
}

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-slate-200 text-slate-800",
  CONFIRMED: "bg-emerald-200 text-emerald-800",
  SEATED: "bg-blue-200 text-blue-800",
  CANCELLED: "bg-rose-200 text-rose-800",
};

const STATUS_BORDER: Record<ReservationStatus, string> = {
  PENDING: "border-l-slate-500",
  CONFIRMED: "border-l-emerald-500",
  SEATED: "border-l-blue-500",
  CANCELLED: "border-l-rose-500",
};

function formatDate(dateISO: string) {
  // dateISO = "2026-01-14"
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export default function ReservationCard({
  reservation,
  onClick,
}: ReservationCardProps) {
  const statusClass = STATUS_STYLES[reservation.status];
  const borderAccent = STATUS_BORDER[reservation.status];

  const dateText = useMemo(() => formatDate(reservation.dateISO), [reservation.dateISO]);

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
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold truncate text-gray-900">
            {reservation.customerName}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {dateText}
            </span>
            <span className="opacity-60">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {reservation.time}
            </span>
          </div>
        </div>

        {/* Guests */}
        <Badge className="text-xs bg-black/10 text-black border-black/15 shrink-0">
          <Users className="h-3.5 w-3.5 mr-1" />
          {reservation.guests}
        </Badge>
      </div>

      {/* Status + Table */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={[
            "inline-block px-2 py-0.5 text-[10px] rounded-md font-semibold",
            statusClass,
          ].join(" ")}
        >
          {reservation.status}
        </span>

        <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-semibold text-gray-900 border border-black/5 shrink-0 inline-flex items-center gap-1">
          <Table2 className="h-3.5 w-3.5" />
          {reservation.table ?? "—"}
        </span>
      </div>

      {/* Phone + Notes */}
      <div className="mt-3 space-y-1 flex-1">
        {reservation.phone && (
          <p className="text-xs text-gray-600 inline-flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" /> {reservation.phone}
          </p>
        )}

        {reservation.notes ? (
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">
            {reservation.notes}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">No notes</p>
        )}
      </div>
    </motion.article>
  );
}
