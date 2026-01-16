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
        className="w-24 rounded-xl bg-rose-100 text-rose-800 border-rose-200"
        size="sm"
        onClick={() => onConfirm(r.id)}>
          Confirm
        </Button>
      )}
      {r.status === "CONFIRMED" && (
        <Button
        className="w-24 rounded-xl bg-[#FB7185] hover:bg-[#F43F5E]"
        size="sm"
        onClick={() => onSeat(r.id)}>
          Seat
        </Button>
      )}
      {r.status !== "CANCELLED" && r.status !== "SEATED" && (
        <Button
        variant="outline"
        size="sm"
        className="w-24 rounded-xl border-gray-200"
        onClick={() => onCancel(r.id)}>
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
      <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Reservations List
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Tap a reservation to view full details.
          </p>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={[
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all self-start sm:self-auto",
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
            className={`w-4 h-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {/* Filters */}
      <div
      className={`transition-all duration-300 ease-in-out ${
        showFilters
        ? "max-h-125 opacity-100"
        : "max-h-0 opacity-0 overflow-hidden"
        }`}>
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wide">
              Refine Results
            </h3>

            {activeFilterCount > 0 && (
              <button
                onClick={() => setStatusFilter("ALL")}
                className="text-xs font-bold flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

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
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden p-4 space-y-3">
        {filteredReservations.map((r) => (
          <div
            key={r.id}
            onClick={() => onOpen(r)}
            className="rounded-2xl border border-gray-200 p-4 shadow-sm cursor-pointer"
          >
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold truncate">{r.customerName}</p>
                <p className="text-xs truncate">{r.phone}</p>
              </div>

              <span
                className={[
                  "inline-flex items-center rounded-full border w-28 px-3 py-1 justify-center font-bold",
                  statusPill(r.status),
                ].join(" ")}
              >
                {r.status}
              </span>
            </div>

            <div
              className="mt-4 flex pt-3 border-t justify-center"
              onClick={(e) => e.stopPropagation()}>
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

      {/* Desktop table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full text-sm">
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
        <th className="text-left px-6 py-4">Customer</th>
        <th className="text-left px-6 py-4 whitespace-nowrap">Phone</th>
        <th className="px-6 py-4 text-center whitespace-nowrap">Date</th>
        <th className="px-6 py-4 text-center whitespace-nowrap">Time</th>
        <th className="px-6 py-4 text-center whitespace-nowrap">Guests</th>
        <th className="px-6 py-4 text-center whitespace-nowrap">Table</th>
        <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
        <th className="text-right px-6 py-4 whitespace-nowrap">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredReservations.map((r) => (
        <tr
          key={r.id}
          onClick={() => onOpen(r)}
          className="group cursor-pointer transition-colors hover:bg-gray-50"
        >
          {/* Customer */}
          <td className="px-6 py-5">
            <div className="flex flex-col">
              <p className="font-semibold text-gray-900 leading-tight">
                {r.customerName}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                ID: {r.id}
              </p>
            </div>
          </td>

          {/* Phone */}
          <td className="px-6 py-5 whitespace-nowrap font-medium text-gray-800">
            {r.phone ?? "—"}
          </td>

          {/* Date */}
          <td className="px-6 py-5 text-center whitespace-nowrap text-gray-700">
            {r.dateISO}
          </td>

          {/* Time */}
          <td className="px-6 py-5 text-center whitespace-nowrap text-gray-700">
            {r.time}
          </td>

          {/* Guests */}
          <td className="px-6 py-5 text-center whitespace-nowrap font-semibold text-gray-900">
            {r.guests}
          </td>

          {/* Table */}
          <td className="px-6 py-5 text-center whitespace-nowrap text-gray-700">
            {r.table ?? "—"}
          </td>

          {/* Status */}
          <td className="px-6 py-5 text-center whitespace-nowrap">
            <span
              className={[
                "inline-flex items-center rounded-full border w-28 px-3 py-1 justify-center font-bold",
                statusPill(r.status),
              ].join(" ")}
            >
              {r.status}
            </span>
          </td>

          {/* Actions */}
          <td
            className="px-6 py-5 text-right whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex justify-end">
              <ActionButtons
                r={r}
                onConfirm={onConfirm}
                onSeat={onSeat}
                onCancel={onCancel}
              />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
