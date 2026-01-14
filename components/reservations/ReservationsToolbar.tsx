"use client";

import { ReservationStatus } from "@/types";

type Props = {
  status: "ALL" | ReservationStatus;
  onStatusChange: (s: "ALL" | ReservationStatus) => void;
  counts: Record<string, number>;
};

const FILTERS: Array<{
  key: "ALL" | ReservationStatus;
  label: string;
}> = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SEATED", label: "Seated" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function ReservationsToolbar({
  status,
  onStatusChange,
  counts,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = status === f.key;

          return (
            <button
              key={f.key}
              onClick={() => onStatusChange(f.key)}
              className={[
                "px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200",
                active
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              {f.label}
              <span
                className={[
                  "ml-2 text-xs px-2 py-0.5 rounded-full",
                  active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600",
                ].join(" ")}
              >
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
