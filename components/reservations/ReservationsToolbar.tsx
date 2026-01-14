"use client";

import { ReservationStatus } from "@/types";

type Props = {
  status: "ALL" | ReservationStatus;
  onStatusChange: (s: "ALL" | ReservationStatus) => void;
  counts: Record<string, number>;
};

export default function ReservationsToolbar({
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="bg-white border border-rose-200 rounded-2xl p-4 flex gap-2">
      {["ALL", "PENDING", "CONFIRMED", "SEATED", "CANCELLED"].map((s) => (
        <button
          key={s}
          onClick={() => onStatusChange(s as any)}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            status === s
              ? "bg-[#FB7185] text-white"
              : "bg-rose-50 text-rose-800 hover:bg-rose-100"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
