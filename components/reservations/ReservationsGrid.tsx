"use client";

import type { Reservation } from "@/types";
import ReservationCard from "./ReservationCard";

interface Props {
  reservations: Reservation[];
  onSelect: (r: Reservation) => void;
}

export function ReservationsGrid({ reservations, onSelect }: Props) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold">No reservations found</p>
        <p className="text-xs mt-1">Try changing filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
      {reservations.map((r) => (
        <div key={r.id} className="sm:h-full">
          <ReservationCard reservation={r} onClick={() => onSelect(r)} />
        </div>
      ))}
    </div>
  );
}
