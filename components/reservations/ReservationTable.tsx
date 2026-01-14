"use client";

import { Button } from "@/components/ui/button";
import { Reservation } from "@/types";
import { ChevronDown, ListFilter, X } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  reservations: Reservation[];
  onOpen: (r: Reservation) => void;
  onConfirm: (id: string) => Promise<void>;
  onSeat: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
};

type StatusFilter = "ALL" | Reservation["status"];

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

function pillClass(active: boolean, status?: Reservation["status"]) {
  const base =
    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap";

  if (!active)
    return `${base} bg-transparent border-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600`;

  if (!status)
    return `${base} bg-gray-900 text-white border-gray-900 shadow-sm`;

  return `${base} ${statusPill(status)} shadow-sm ring-2 ring-black/5`;
}

function ActionButtons({
  r,
  onConfirm,
  onSeat,
  onCancel,
}: {
  r: Reservation;
  onConfirm: (id: string) => Promise<void>;
  onSeat: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {r.status === "PENDING" && (
        <Button
          className="rounded-xl bg-blue-700 hover:bg-blue-800"
          size="sm"
          onClick={() => onConfirm(r.id)}
        >
          Confirm
        </Button>
      )}

      {r.status === "CONFIRMED" && (
        <Button
          className="rounded-xl bg-blue-700 hover:bg-blue-800"
          size="sm"
          onClick={() => onSeat(r.id)}
        >
          Seat
        </Button>
      )}

      {r.status !== "CANCELLED" && r.status !== "SEATED" && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-gray-200"
          onClick={() => onCancel(r.id)}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}

export default function ReservationsTable({
  reservations,
  onOpen,
  onConfirm,
  onSeat,
  onCancel,
}: Props) {
  const [showFilters, setShowFilters] = useState(false);

  // ✅ hidden filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filteredReservations = useMemo(() => {
    if (statusFilter === "ALL") return reservations;
    return reservations.filter((r) => r.status === statusFilter);
  }, [reservations, statusFilter]);

  const counts = useMemo(() => {
    const base = {
      PENDING: 0,
      CONFIRMED: 0,
      SEATED: 0,
      CANCELLED: 0,
    };
    for (const r of reservations) base[r.status] += 1;
    return base;
  }, [reservations]);

  const activeFilterCount = statusFilter !== "ALL" ? 1 : 0;

  const clearFilters = () => {
    setStatusFilter("ALL");
  };

  // ✅ Empty state based on FILTERED data (better UX)
  if (filteredReservations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
        <p className="text-sm font-semibold text-gray-900">
          No reservations found
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Try switching filters to view other reservations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Reservations List
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tap a reservation to view full details.
          </p>
        </div>

        {/* ✅ Toggle Filters button */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={[
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
            showFilters || activeFilterCount > 0
              ? "bg-white border-gray-900 text-gray-900 shadow-sm"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-300",
          ].join(" ")}
        >
          <ListFilter className="w-4 h-4" />
          <span className="text-sm font-semibold">Filters</span>

          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-[10px] bg-gray-900 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}

          <ChevronDown
            className={[
              "w-4 h-4 transition-transform duration-300",
              showFilters ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {/* ✅ Collapsible Filter Section (hidden by default) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showFilters
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 overflow-hidden"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-gray-50/50 border-b border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Refine Results
              </h3>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-rose-600 flex items-center gap-1 hover:opacity-80"
                >
                  <X className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">
                Reservation Status
              </span>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={pillClass(statusFilter === "ALL")}
                >
                  All
                </button>

                {(["PENDING", "CONFIRMED", "SEATED", "CANCELLED"] as const).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={pillClass(statusFilter === s, s)}
                    >
                      {s}
                      <span className="ml-1.5 opacity-50 font-normal">
                        {counts[s]}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-900">
                {filteredReservations.length}
              </span>{" "}
              reservations.
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MOBILE VIEW (Cards) */}
      <div className="block md:hidden p-4 space-y-3">
        {filteredReservations.map((r) => (
          <div
            key={r.id}
            onClick={() => onOpen(r)}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {r.customerName}
                </p>
                <p className="text-xs text-gray-500 truncate">{r.id}</p>
              </div>

              <span
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold shrink-0",
                  statusPill(r.status),
                ].join(" ")}
              >
                {r.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <InfoTile label="Date" value={r.dateISO} />
              <InfoTile label="Time" value={r.time} />
              <InfoTile label="Guests" value={String(r.guests)} />
              <InfoTile label="Table" value={r.table ?? "—"} />
            </div>

            <div
              className="mt-4 pt-3 border-t border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <ActionButtons
                r={r}
                onConfirm={onConfirm}
                onSeat={onSeat}
                onCancel={onCancel}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ DESKTOP VIEW (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-xs font-semibold text-gray-500">
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3 whitespace-nowrap">Date</th>
              <th className="text-left px-5 py-3 whitespace-nowrap">Time</th>
              <th className="text-left px-5 py-3">Guests</th>
              <th className="text-left px-5 py-3">Table</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredReservations.map((r) => (
              <tr
                key={r.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onOpen(r)}
              >
                <td className="px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {r.customerName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{r.id}</p>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                  {r.dateISO}
                </td>
                <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                  {r.time}
                </td>
                <td className="px-5 py-4 text-gray-700">{r.guests}</td>
                <td className="px-5 py-4 text-gray-700">{r.table ?? "—"}</td>

                <td className="px-5 py-4">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold",
                      statusPill(r.status),
                    ].join(" ")}
                  >
                    {r.status}
                  </span>
                </td>

                <td
                  className="px-5 py-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons
                    r={r}
                    onConfirm={onConfirm}
                    onSeat={onSeat}
                    onCancel={onCancel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -----------------------------------------
 * Small UI helper for mobile tiles
 * ----------------------------------------*/
function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}
