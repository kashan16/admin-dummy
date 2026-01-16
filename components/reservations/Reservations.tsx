"use client";

import { formatISTDateTimeFilename, mockReservations } from "@/lib/mockData";
import type { Reservation, ReservationStatus } from "@/types";
import { ChevronDown, ListFilter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import CreateReservationModal from "./CreateReservationModal";
import ReservationModal from "./ReservationModal";
import ReservationsToolbar from "./ReservationsToolbar";
import ReservationsTable from "./ReservationTable";

import { Button } from "@/components/ui/button";
import { useExportCSV } from "@/hooks/useExportCSV";
import { BiExport } from "react-icons/bi";

/* ------------------ ADVANCED EXPORT HELPERS ------------------ */

function formatISTDate(isoDate: string) {
  // isoDate like: "2026-01-14"
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function dayOfWeekFromISODate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });
}

function normalizePhone(phone?: string) {
  if (!phone) return "";
  return phone.replace(/\D/g, ""); // digits only
}

function formatPhoneIN(phone?: string) {
  const digits = normalizePhone(phone);
  if (digits.length !== 10) return phone ?? "";
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function parseTimeToMinutes(time: string) {
  // input example: "07:30 PM"
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!m) return -1;

  let hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();

  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;

  return hh * 60 + mm;
}

function timeSlotBucket(time: string) {
  const mins = parseTimeToMinutes(time);
  if (mins < 0) return "Unknown";

  // 5:00–11:59 => Breakfast
  // 12:00–16:59 => Lunch
  // 17:00–19:59 => Evening
  // 20:00–22:59 => Dinner
  // 23:00–04:59 => Late Night
  if (mins >= 300 && mins < 720) return "Breakfast";
  if (mins >= 720 && mins < 1020) return "Lunch";
  if (mins >= 1020 && mins < 1200) return "Evening";
  if (mins >= 1200 && mins < 1380) return "Dinner";
  return "Late Night";
}

function statusPriority(status: ReservationStatus) {
  // lower number => more urgent / active
  switch (status) {
    case "PENDING":
      return 1;
    case "CONFIRMED":
      return 2;
    case "SEATED":
      return 3;
    case "CANCELLED":
      return 4;
    default:
      return 99;
  }
}

/* ------------------ COMPONENT ------------------ */

export default function Reservations() {
  const [rows, setRows] = useState<Reservation[]>(mockReservations);
  const [status, setStatus] = useState<"ALL" | ReservationStatus>("ALL");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { exportCSV } = useExportCSV();

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
          <p className="text-sm text-rose-600">Manage table bookings</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* ✅ Export CSV (Advanced) */}
          <Button
            variant="outline"
            className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
            disabled={filtered.length === 0}
            onClick={() => {
              exportCSV(filtered, {
                filename: `reservations_${formatISTDateTimeFilename()}.csv`,
                headers: {
                  id: "Reservation ID",
                  customerName: "Customer",
                  phonePretty: "Phone",
                  phoneDigits: "Phone Digits",
                  guests: "Guests",
                  dateISO: "Date ISO",
                  datePretty: "Date (IST)",
                  dayOfWeek: "Day",
                  time: "Time",
                  timeSlot: "Time Slot",
                  table: "Table",
                  status: "Status",
                  statusPriority: "Status Priority",
                  createdAtISO: "Created At (ISO)",
                  notes: "Notes",
                  hasNotes: "Has Notes",
                  hasTable: "Has Table",
                  isWalkIn: "Walk-in",
                },
                mapRow: (r) => ({
                  id: r.id,
                  customerName: r.customerName,

                  phonePretty: formatPhoneIN(r.phone),
                  phoneDigits: normalizePhone(r.phone),

                  guests: r.guests,

                  dateISO: r.dateISO,
                  datePretty: formatISTDate(r.dateISO),
                  dayOfWeek: dayOfWeekFromISODate(r.dateISO),

                  time: r.time,
                  timeSlot: timeSlotBucket(r.time),

                  table: r.table ?? "—",
                  status: r.status,
                  statusPriority: statusPriority(r.status),

                  createdAtISO: r.createdAtISO,

                  notes: r.notes ?? "",
                  hasNotes: Boolean(r.notes && r.notes.trim().length > 0),

                  hasTable: Boolean(r.table && r.table.trim().length > 0),

                  // Example proxy: no phone => walk-in
                  isWalkIn: !(r.phone && r.phone.trim().length > 0),
                }),
              });
            }}
          >
            <BiExport className="w-5 h-5" />
          </Button>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition-colors"
          >
            <ListFilter className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:inline">
              Filters
            </span>
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
              r.map((x) => (x.id === id ? { ...x, status: "CONFIRMED" } : x))
            );
            toast.success("Confirmed");
          }}
          onSeat={async (id) => {
            setRows((r) =>
              r.map((x) => (x.id === id ? { ...x, status: "SEATED" } : x))
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
