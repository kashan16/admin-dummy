"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Reservation, ReservationStatus } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; badge: string; next: ReservationStatus[] }
> = {
  PENDING: {
    label: "Pending",
    badge: "bg-slate-200 text-slate-800",
    next: ["CONFIRMED", "CANCELLED"],
  },
  CONFIRMED: {
    label: "Confirmed",
    badge: "bg-emerald-200 text-emerald-800",
    next: ["SEATED", "CANCELLED"],
  },
  SEATED: {
    label: "Seated",
    badge: "bg-blue-200 text-blue-800",
    next: [],
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-rose-200 text-rose-800",
    next: [],
  },
};

function formatDate(dateISO: string) {
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function ReservationModal({
  reservation,
  onClose,
  onStatusChange,
}: {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange?: (reservationId: string, newStatus: ReservationStatus) => void;
}) {
  const [currentStatus, setCurrentStatus] = useState<ReservationStatus>(
    reservation.status
  );
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const statusConfig = STATUS_CONFIG[currentStatus];

  const dateText = useMemo(
    () => formatDate(reservation.dateISO),
    [reservation.dateISO]
  );

  const handleStatusChange = async (newStatus: ReservationStatus) => {
    setStatusLoading(true);
    setCurrentStatus(newStatus);
    onStatusChange?.(reservation.id, newStatus);
    setStatusMenuOpen(false);
    setStatusLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 no-scrollbar">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* STATUS BADGE */}
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Main Info */}
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">{reservation.customerName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {dateText} • {reservation.time}
              </p>
              {reservation.phone && (
                <p className="text-xs text-gray-500 mt-1">
                  Phone: <span className="font-semibold">{reservation.phone}</span>
                </p>
              )}
            </div>

            <Badge className="shrink-0">
              {reservation.guests} Guests
            </Badge>
          </div>

          {/* Table + Notes */}
          <div className="rounded-2xl border bg-gray-50 p-4 space-y-2">
            <Row label="Table" value={reservation.table ?? "—"} />
            <Row label="Guests" value={`${reservation.guests}`} />
            <Row label="Status" value={currentStatus} bold />
            {reservation.notes && (
              <div className="pt-2 border-t">
                <p className="text-xs font-bold text-gray-700 mb-1">Notes</p>
                <p className="text-sm text-gray-800">{reservation.notes}</p>
              </div>
            )}
          </div>

          {/* STATUS CHANGE SECTION */}
          <div className="border-t pt-4 flex justify-center relative">
            <AnimatePresence>
              {statusMenuOpen && statusConfig.next.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-3 w-[85%] rounded-2xl border bg-background shadow-lg overflow-hidden"
                >
                  {statusConfig.next.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="w-full px-4 py-2 text-left hover:bg-muted capitalize text-sm"
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="outline"
              className="w-[85%]"
              disabled={statusLoading || statusConfig.next.length === 0}
              onClick={() => setStatusMenuOpen((p) => !p)}
            >
              {statusLoading
                ? "Updating…"
                : statusConfig.next.length === 0
                ? statusConfig.label
                : "Change Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-bold" : ""}`}>
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
