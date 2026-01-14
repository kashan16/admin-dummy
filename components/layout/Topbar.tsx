"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOutlet } from "@/context/OutletContext";
import { ChevronDown } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";

export function Topbar() {
  const { outlets, selectedOutlet, setSelectedOutlet, isMultiOutlet } =
    useOutlet();

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#FFF1F2] border-b border-rose-200 text-[#7F1D1D]">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <MobileSidebar />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold">Admin</span>
            <Avatar className="h-9 w-9 border border-rose-300">
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-rose-200 text-rose-900">
                AD
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="sm:hidden">
            <Avatar className="h-9 w-9 border border-rose-300">
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-rose-200 text-rose-900">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
