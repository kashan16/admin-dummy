'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types";

interface Props {
  status: "all" | Order["status"];
  onStatusChange: (v: "all" | Order["status"]) => void;
}

export function OrdersToolbar({ status, onStatusChange }: Props) {
  return (
    <div
      className="
        bg-white border border-gray-200 shadow-sm
        rounded-2xl p-4
        flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between
      "
    >
      <div>
        <p className="text-sm font-semibold text-gray-900">Filters</p>
        <p className="text-xs text-gray-500 mt-1">
          Quickly filter orders by status
        </p>
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger
          className="
            w-full sm:w-56
            h-11 rounded-xl
            border-gray-200
            focus:ring-2 focus:ring-blue-700/30
          "
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="preparing">Preparing</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
