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
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(
    () => (status === "ALL" ? rows : rows.filter((r) => r.status === status)),
    [rows, status]
  );

  return (
    <div className="space-y-4 px-3 sm:px-6 lg:px-10 max-w-screen-2xl mx-auto">
      {/* Header */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center justify-between sm:block">
    <div>
      <h1 className="text-lg font-semibold text-rose-900">
        Reservations
      </h1>
      <p className="text-sm text-rose-600">
        Manage table bookings
      </p>
    </div>

    {/* Mobile button */}
    <button
      onClick={() => setCreateOpen(true)}
      className="
        h-11 w-11
        rounded-xl
        bg-[#FB7185] hover:bg-[#F43F5E]
        text-white
        flex items-center justify-center
        sm:hidden
      "
    >
      <Plus />
    </button>
  </div>

  {/* Desktop button */}
  <button
    onClick={() => setCreateOpen(true)}
    className="
      h-11 w-11
      rounded-xl
      bg-[#FB7185] hover:bg-[#F43F5E]
      text-white
      flex items-center justify-center
      hidden sm:flex
    "
  >
    <Plus />
  </button>
</div>


      {/* Toolbar */}
      <ReservationsToolbar
        status={status}
        onStatusChange={setStatus}
        counts={{}}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <ReservationsTable
          reservations={filtered}
          onOpen={setSelected}
          onConfirm={async (id) => {
            setRows((r) =>
              r.map((x) =>
                x.id === id ? { ...x, status: "CONFIRMED" } : x
              )
            );
            toast.success("Confirmed");
          }}
          onSeat={async (id) => {
            setRows((r) =>
              r.map((x) =>
                x.id === id ? { ...x, status: "SEATED" } : x
              )
            );
            toast.success("Seated");
          }}
          onCancel={async (id) => {
            setRows((r) =>
              r.map((x) =>
                x.id === id ? { ...x, status: "CANCELLED" } : x
              )
            );
            toast.error("Cancelled");
          }}
        />
      </div>

      {/* View Modal */}
      {selected && (
        <ReservationModal
          reservation={selected}
          onClose={() => setSelected(null)}
          onConfirm={async () => {
            toast.success("Confirmed");
            setSelected(null);
          }}
          onSeat={async () => {}}
          onCancel={async () => {}}
        />
      )}

      {/* Create Modal */}
      <CreateReservationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (r) => {
          setRows((prev) => [r, ...prev]);
          toast.success("Reservation created");
        }}
      />
    </div>
  );
}
