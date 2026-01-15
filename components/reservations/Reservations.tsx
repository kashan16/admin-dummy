"use client";

import { mockReservations } from "@/lib/mockData";
import { Reservation, ReservationStatus } from "@/types";
import { ChevronDown, ListFilter, Plus } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () => (status === "ALL" ? rows : rows.filter((r) => r.status === status)),
    [rows, status]
  );

  const activeFilterCount = status === "ALL" ? 0 : 1;

  return (
    <div className="space-y-4 px-3 sm:px-6 lg:px-10 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-rose-900">
            Reservations
          </h1>
          <p className="text-sm text-rose-600">
            Manage table bookings
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
          >
            <ListFilter className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 text-[10px] bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Create Button */}
          <button
            onClick={() => setCreateOpen(true)}
            className="h-10 w-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
            aria-label="Create reservation"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar - Now collapsible */}
      <div
        className={`transition-all duration-300 ${
          showFilters
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <ReservationsToolbar
          status={status}
          onStatusChange={setStatus}
          counts={{}}
        />
      </div>

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