"use client";

import { mockReservations } from "@/lib/mockData";
import type { Reservation, ReservationStatus } from "@/types";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter, Plus, X } from "lucide-react";
import { BiExport } from "react-icons/bi";

import { useExportCSV } from "@/hooks/useExportCSV";

import { CreateReservationModal } from "./CreateReservationModal";
import { ReservationModal } from "./ReservationModal";
import { ReservationsGrid } from "./ReservationsGrid";

const STATUS_OPTIONS: Array<{
  label: string;
  value: "all" | ReservationStatus;
  color: string;
}> = [
  { label: "All", value: "all", color: "bg-black text-white hover:bg-black/90" },
  { label: "Pending", value: "PENDING", color: "bg-slate-500 text-white hover:bg-slate-600" },
  { label: "Confirmed", value: "CONFIRMED", color: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { label: "Seated", value: "SEATED", color: "bg-blue-500 text-white hover:bg-blue-600" },
  { label: "Cancelled", value: "CANCELLED", color: "bg-rose-500 text-white hover:bg-rose-600" },
];

type DateFilter = "all" | "today" | "tomorrow";

function toISODateIST(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  const day = parts.find((p) => p.type === "day")?.value ?? "00";

  return `${y}-${m}-${day}`;
}

function formatISTDateTimeFilename(prefix: string) {
  const d = new Date();

  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const dd = parts.day;
  const mm = parts.month;
  const yyyy = parts.year;
  const hh = parts.hour;
  const min = parts.minute;
  const ampm = parts.dayPeriod?.toUpperCase() ?? "NA";

  return `${prefix}_${dd}-${mm}-${yyyy}_${hh}-${min}${ampm}`;
}

export default function Reservations() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [status, setStatus] = useState<"all" | ReservationStatus>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  // ✅ local state list (so creating works)
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);

  const [createOpen, setCreateOpen] = useState(false);

  const { exportCSV } = useExportCSV();

  const todayISO = useMemo(() => toISODateIST(new Date()), []);
  const tomorrowISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODateIST(d);
  }, []);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (dateFilter === "today" && r.dateISO !== todayISO) return false;
      if (dateFilter === "tomorrow" && r.dateISO !== tomorrowISO) return false;
      return true;
    });
  }, [reservations, status, dateFilter, todayISO, tomorrowISO]);

  const activeFilterCount = [status !== "all", dateFilter !== "all"].filter(Boolean).length;

  return (
    <div className="space-y-4 w-full min-w-0 px-3 sm:px-6 lg:px-10 xl:px-14 mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Reservations
          </h1>
          <p className="text-sm text-gray-500">
            Manage table bookings and customer requests
          </p>
        </div>

        {/* ✅ Actions: Create + Export */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ✅ Create (baby pink like Orders export) */}
          <Button
            variant="outline"
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          {/* ✅ Export (exact same button style as Orders module) */}
          <Button
            variant="outline"
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
            disabled={filtered.length === 0}
            onClick={() => {
              exportCSV(filtered, {
                filename: `${formatISTDateTimeFilename("reservations")}.csv`,
                headers: {
                  id: "Reservation ID",
                  customerName: "Customer Name",
                  phone: "Phone",
                  guests: "Guests",
                  dateISO: "Reservation Date (ISO)",
                  time: "Reservation Time",
                  table: "Table",
                  notes: "Notes",
                  status: "Status",
                  createdAtISO: "Created At (ISO)",
                },
                mapRow: (r) => ({
                  id: r.id,
                  customerName: r.customerName,
                  phone: r.phone ?? "",
                  guests: r.guests,
                  dateISO: r.dateISO,
                  time: r.time,
                  table: r.table ?? "—",
                  notes: r.notes ?? "",
                  status: r.status,
                  createdAtISO: r.createdAtISO,
                }),
              });
            }}
          >
            <BiExport className="w-5 h-5" />
          </Button>
        </div>

        {/* ✅ Filters button (exactly like Orders) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors shrink-0"
        >
          <ListFilter className="w-4 h-4" />
          <span className="text-sm font-semibold hidden sm:inline">Filters</span>

          {activeFilterCount > 0 && (
            <span className="w-5 h-5 text-[10px] bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
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
        className={`transition-all duration-300 ${
          showFilters ? "max-h-250 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 border space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold">Refine Results</h3>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setStatus("all");
                  setDateFilter("all");
                }}
                className="text-xs font-bold flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-3 h-3" /> Reset All
              </button>
            )}
          </div>

          <div className="grid gap-6">
            {/* Date filter */}
            <div>
              <p className="text-xs font-bold mb-3 text-gray-700">Date</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "all" as const },
                  { label: "Today", value: "today" as const },
                  { label: "Tomorrow", value: "tomorrow" as const },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDateFilter(d.value)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      dateFilter === d.value
                        ? "bg-blue-500 text-white shadow-md sm:scale-105"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div>
              <p className="text-xs font-bold mb-3 text-gray-700">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      status === s.value
                        ? `${s.color} shadow-md sm:scale-105`
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReservationsGrid reservations={filtered} onSelect={setSelectedReservation} />

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={(id, newStatus) => {
            setReservations((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
            );
          }}
        />
      )}

      {/* Create Reservation Modal */}
      <CreateReservationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        existingCount={reservations.length}
        onCreate={(newReservation) => {
          setReservations((prev) => [newReservation, ...prev]);
        }}
      />
    </div>
  );
}
