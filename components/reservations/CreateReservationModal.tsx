"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Reservation, ReservationStatus } from "@/types";
import { useMemo, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (r: Reservation) => Promise<void>;
};

function todayISO() {
  // Basic local date ISO (yyyy-mm-dd)
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CreateReservationModal({ open, onClose, onCreate }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [dateISO, setDateISO] = useState(todayISO());
  const [time, setTime] = useState("07:30 PM");
  const [table, setTable] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ReservationStatus>("PENDING");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return customerName.trim().length >= 2 && guests >= 1 && dateISO && time;
  }, [customerName, guests, dateISO, time]);

  async function handleSubmit() {
    if (!canSubmit) return;

    setSaving(true);

    const newReservation: Reservation = {
      id: `RSV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      phone: phone.trim() || undefined,
      guests,
      dateISO,
      time,
      table: table.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
      createdAtISO: new Date().toISOString(),
    };

    await onCreate(newReservation);

    setSaving(false);
    onClose();

    // reset
    setCustomerName("");
    setPhone("");
    setGuests(2);
    setDateISO(todayISO());
    setTime("07:30 PM");
    setTable("");
    setNotes("");
    setStatus("PENDING");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-lg w-[92%]
          rounded-3xl bg-white border border-gray-200 shadow-xl
          p-0 overflow-hidden
        "
      >
        <DialogHeader className="p-5 border-b border-gray-200">
          <DialogTitle className="text-sm font-semibold text-gray-900">
            Add Reservation
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            Create a new table booking entry.
          </p>
        </DialogHeader>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar">
          {/* Customer */}
          <Field label="Customer Name" required>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ayaan Khan"
              className="
                w-full h-11 rounded-xl bg-white
                border border-gray-200 px-4 text-sm
                outline-none
                focus:ring-2 focus:ring-blue-700/30
              "
            />
          </Field>

          {/* Phone */}
          <Field label="Phone (optional)">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98765 43210"
              className="
                w-full h-11 rounded-xl bg-white
                border border-gray-200 px-4 text-sm
                outline-none
                focus:ring-2 focus:ring-blue-700/30
              "
            />
          </Field>

          {/* Guests + Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Guests" required>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="
                  w-full h-11 rounded-xl bg-white
                  border border-gray-200 px-4 text-sm
                  outline-none
                  focus:ring-2 focus:ring-blue-700/30
                "
              />
            </Field>

            <Field label="Table (optional)">
              <input
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="e.g. T-12"
                className="
                  w-full h-11 rounded-xl bg-white
                  border border-gray-200 px-4 text-sm
                  outline-none
                  focus:ring-2 focus:ring-blue-700/30
                "
              />
            </Field>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date" required>
              <input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="
                  w-full h-11 rounded-xl bg-white
                  border border-gray-200 px-4 text-sm
                  outline-none
                  focus:ring-2 focus:ring-blue-700/30
                "
              />
            </Field>

            <Field label="Time" required>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="
                  w-full h-11 rounded-xl bg-white
                  border border-gray-200 px-4 text-sm
                  outline-none
                  focus:ring-2 focus:ring-blue-700/30
                "
              >
                {[
                  "06:30 PM",
                  "07:00 PM",
                  "07:30 PM",
                  "08:00 PM",
                  "08:30 PM",
                  "09:00 PM",
                  "09:30 PM",
                  "10:00 PM",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Status */}
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReservationStatus)}
              className="
                w-full h-11 rounded-xl bg-white
                border border-gray-200 px-4 text-sm
                outline-none
                focus:ring-2 focus:ring-blue-700/30
              "
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SEATED">Seated</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Field>

          {/* Notes */}
          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              className="
                w-full min-h-22.5 rounded-2xl bg-white
                border border-gray-200 px-4 py-3 text-sm
                outline-none resize-none
                focus:ring-2 focus:ring-blue-700/30
              "
            />
          </Field>

          {!canSubmit && (
            <div className="text-xs text-gray-500 bg-[#F7F7FB] border border-gray-200 rounded-2xl p-4">
              Please enter <span className="font-semibold text-gray-900">Customer Name</span>,
              choose a <span className="font-semibold text-gray-900">Date</span> and a{" "}
              <span className="font-semibold text-gray-900">Time</span>.
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-200 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            className="rounded-xl bg-blue-700 hover:bg-blue-800"
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
          >
            {saving ? "Creating..." : "Create Reservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        {required && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Required
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
