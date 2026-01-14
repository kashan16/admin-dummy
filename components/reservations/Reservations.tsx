"use client";

import { mockReservations } from "@/lib/mockData";
import { Reservation, ReservationStatus } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CreateReservationModal from "./CreateReservationModal";
import ReservationModal from "./ReservationModal";
import ReservationsToolbar from "./ReservationsToolbar";
import ReservationsTable from "./ReservationTable";

export default function Reservations() {
  const [rows, setRows] = useState<Reservation[]>(mockReservations);

  const [status, setStatus] = useState<"ALL" | ReservationStatus>("ALL");
  const [selected, setSelected] = useState<Reservation | null>(null);

  // ✅ NEW: Create modal state
  const [createOpen, setCreateOpen] = useState(false);

  // ✅ dummy functions
  const confirmReservation = async (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "CONFIRMED" } : r))
    );
    toast.success("Reservation confirmed");
  };

  const seatReservation = async (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "SEATED" } : r))
    );
    toast.success("Marked as seated");
  };

  const cancelReservation = async (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" } : r))
    );
    toast.error("Reservation cancelled");
  };

  // ✅ NEW: Dummy create reservation
  const createReservation = async (newReservation: Reservation) => {
    setRows((prev) => [newReservation, ...prev]);
    toast.success("Reservation created");
  };

  const filtered = useMemo(() => {
    if (status === "ALL") return rows;
    return rows.filter((r) => r.status === status);
  }, [rows, status]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {
      ALL: rows.length,
      PENDING: 0,
      CONFIRMED: 0,
      SEATED: 0,
      CANCELLED: 0,
    };
    for (const r of rows) base[r.status] += 1;
    return base;
  }, [rows]);

  return (
    <div className="space-y-6">
      {/* ✅ Header + Add Button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Reservations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track table bookings and manage confirmations.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="
            h-11 px-4 rounded-xl
            bg-blue-700 hover:bg-blue-800
            text-white text-sm font-semibold
            transition-all duration-200
            shadow-sm
          "
        >
          <Plus className="w-5 h-5"/>
        </button>
      </div>

      <ReservationsToolbar
        status={status}
        onStatusChange={setStatus}
        counts={counts}
      />

      <ReservationsTable
        reservations={filtered}
        onOpen={(r) => setSelected(r)}
        onConfirm={confirmReservation}
        onSeat={seatReservation}
        onCancel={cancelReservation}
      />

      {selected && (
        <ReservationModal
          reservation={selected}
          onClose={() => setSelected(null)}
          onConfirm={confirmReservation}
          onSeat={seatReservation}
          onCancel={cancelReservation}
        />
      )}

      <CreateReservationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createReservation}
      />
    </div>
  );
}
