"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reservation } from "@/types";

type Props = {
  reservation: Reservation;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  onSeat: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
};

function pill(status: Reservation["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-rose-100 text-rose-800";
    case "SEATED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
  }
}

export default function ReservationModal({
  reservation,
  onClose,
  onConfirm,
  onSeat,
  onCancel,
}: Props) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl bg-white border border-rose-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-rose-900">
            Reservation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pill(
              reservation.status
            )}`}
          >
            {reservation.status}
          </span>

          <Info label="Customer" value={reservation.customerName} />
          <Info label="Guests" value={String(reservation.guests)} />
          <Info label="Date" value={reservation.dateISO} />
          <Info label="Time" value={reservation.time} />
          <Info label="Table" value={reservation.table ?? "—"} />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <div className="flex gap-2">
            {reservation.status === "PENDING" && (
              <Button
                className="bg-[#FB7185] hover:bg-[#F43F5E]"
                onClick={() => onConfirm(reservation.id)}
              >
                Confirm
              </Button>
            )}
            {reservation.status === "CONFIRMED" && (
              <Button
                className="bg-[#FB7185] hover:bg-[#F43F5E]"
                onClick={() => onSeat(reservation.id)}
              >
                Seat
              </Button>
            )}
            {reservation.status !== "CANCELLED" &&
              reservation.status !== "SEATED" && (
                <Button variant="outline" onClick={() => onCancel(reservation.id)}>
                  Cancel
                </Button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
      <p className="text-xs font-semibold text-rose-600 uppercase">{label}</p>
      <p className="text-sm font-semibold text-rose-900">{value}</p>
    </div>
  );
}
