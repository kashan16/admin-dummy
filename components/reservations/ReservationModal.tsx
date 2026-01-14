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

function statusPill(status: Reservation["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "SEATED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
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
      <DialogContent
        className="
          max-w-lg w-[92%]
          rounded-3xl bg-white border border-gray-200 shadow-xl
          p-0 overflow-hidden
          no-scrollbar
        "
      >
        <DialogHeader className="p-5 border-b border-gray-200">
          <DialogTitle className="text-sm font-semibold text-gray-900">
            Reservation Details
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">{reservation.id}</p>
        </DialogHeader>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar">
          {/* Status */}
          <div className="flex justify-center">
            <span
              className={[
                "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold",
                statusPill(reservation.status),
              ].join(" ")}
            >
              {reservation.status}
            </span>
          </div>

          <Info label="Customer" value={reservation.customerName} />
          {reservation.phone && <Info label="Phone" value={reservation.phone} />}
          <Info label="Guests" value={String(reservation.guests)} />
          <Info label="Date" value={reservation.dateISO} />
          <Info label="Time" value={reservation.time} />
          <Info label="Table" value={reservation.table ?? "—"} />

          {reservation.notes && (
            <div className="bg-[#F7F7FB] border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Notes
              </p>
              <p className="text-sm text-gray-900 mt-1">{reservation.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200"
            onClick={onClose}
          >
            Close
          </Button>

          <div className="flex gap-2">
            {reservation.status === "PENDING" && (
              <Button
                className="rounded-xl bg-blue-700 hover:bg-blue-800"
                onClick={async () => {
                  await onConfirm(reservation.id);
                  onClose();
                }}
              >
                Confirm
              </Button>
            )}

            {reservation.status === "CONFIRMED" && (
              <Button
                className="rounded-xl bg-blue-700 hover:bg-blue-800"
                onClick={async () => {
                  await onSeat(reservation.id);
                  onClose();
                }}
              >
                Mark Seated
              </Button>
            )}

            {reservation.status !== "CANCELLED" &&
              reservation.status !== "SEATED" && (
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200"
                  onClick={async () => {
                    await onCancel(reservation.id);
                    onClose();
                  }}
                >
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
    <div className="bg-[#F7F7FB] border border-gray-200 rounded-2xl p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-1 wrap-break-words">
        {value}
      </p>
    </div>
  );
}
