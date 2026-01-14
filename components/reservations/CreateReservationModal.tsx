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
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function CreateReservationModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [dateISO, setDateISO] = useState(todayISO());
  const [time, setTime] = useState("07:30 PM");
  const [table, setTable] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ReservationStatus>("PENDING");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(
    () => customerName.trim().length >= 2 && guests >= 1 && dateISO && time,
    [customerName, guests, dateISO, time]
  );

  async function handleSubmit() {
    if (!canSubmit) return;
    setSaving(true);

    await onCreate({
      id: `RSV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      phone: phone || undefined,
      guests,
      dateISO,
      time,
      table: table || undefined,
      notes: notes || undefined,
      status,
      createdAtISO: new Date().toISOString(),
    });

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-rose-200 shadow-xl p-0">
        <DialogHeader className="p-5 border-b border-rose-200">
          <DialogTitle className="text-sm font-semibold text-rose-900">
            Add Reservation
          </DialogTitle>
          <p className="text-xs text-rose-600 mt-1">
            Create a new table booking.
          </p>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <Field label="Customer Name" required>
            <Input value={customerName} onChange={setCustomerName} />
          </Field>

          <Field label="Phone">
            <Input value={phone} onChange={setPhone} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Guests" required>
              <Input
                type="number"
                value={guests}
                onChange={(v) => setGuests(Number(v))}
              />
            </Field>

            <Field label="Table">
              <Input value={table} onChange={setTable} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date" required>
              <Input type="date" value={dateISO} onChange={setDateISO} />
            </Field>

            <Field label="Time" required>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 rounded-xl border border-rose-200 px-4 text-sm focus:ring-2 focus:ring-rose-400/30"
              >
                {["07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"].map(
                  (t) => (
                    <option key={t}>{t}</option>
                  )
                )}
              </select>
            </Field>
          </div>

          <Field label="Status">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ReservationStatus)
              }
              className="w-full h-11 rounded-xl border border-rose-200 px-4 text-sm focus:ring-2 focus:ring-rose-400/30"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SEATED">Seated</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Field>

          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm focus:ring-2 focus:ring-rose-400/30"
            />
          </Field>
        </div>

        <div className="p-5 border-t border-rose-200 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#FB7185] hover:bg-[#F43F5E]"
            disabled={!canSubmit || saving}
            onClick={handleSubmit}
          >
            {saving ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string | number;
  onChange: (v: any) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 rounded-xl border border-rose-200 px-4 text-sm focus:ring-2 focus:ring-rose-400/30"
    />
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
      <p className="text-xs font-semibold text-rose-600 uppercase">
        {label} {required && "*"}
      </p>
      {children}
    </div>
  );
}
