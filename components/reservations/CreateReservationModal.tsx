"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Reservation, ReservationStatus } from "@/types";
import { useMemo, useState } from "react";

function generateReservationId(existingCount: number) {
  return `RSV-${1000 + existingCount + 1}`;
}

export function CreateReservationModal({
  open,
  onClose,
  onCreate,
  existingCount,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (reservation: Reservation) => void;
  existingCount: number;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState<number>(2);
  const [dateISO, setDateISO] = useState("");
  const [time, setTime] = useState("");
  const [table, setTable] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ReservationStatus>("PENDING");

  const canCreate = useMemo(() => {
    return customerName.trim().length > 1 && guests >= 1 && dateISO && time;
  }, [customerName, guests, dateISO, time]);

  const handleCreate = () => {
    if (!canCreate) return;

    const nowISO = new Date().toISOString();

    const reservation: Reservation = {
      id: generateReservationId(existingCount),
      customerName: customerName.trim(),
      phone: phone.trim() || undefined,
      guests,
      dateISO, // "2026-01-15"
      time, // "07:30 PM"
      table: table.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
      createdAtISO: nowISO,
    };

    onCreate(reservation);
    onClose();

    // reset
    setCustomerName("");
    setPhone("");
    setGuests(2);
    setDateISO("");
    setTime("");
    setTable("");
    setNotes("");
    setStatus("PENDING");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create Reservation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-700">Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ayaan Khan"
              className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-gray-700">Phone (optional)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98765 43210"
              className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
            />
          </div>

          {/* Guests + Status */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700">Guests</label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReservationStatus)}
                className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SEATED">SEATED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700">Date</label>
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 07:30 PM"
                className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
              />
            </div>
          </div>

          {/* Table */}
          <div>
            <label className="text-xs font-bold text-gray-700">Table (optional)</label>
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="e.g. T-4"
              className="mt-2 w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Birthday celebration"
              className="mt-2 w-full min-h-24 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-700/30"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!canCreate} onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
