"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOutlet } from "@/context/OutletContext";
import { ChevronDown } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";

export function Topbar() {
  const { outlets, selectedOutlet, setSelectedOutlet, isMultiOutlet } =
    useOutlet();

  return (
    <header className="fixed top-0 z-40 w-full md:w-[calc(100%-16rem)] md:ml-64 h-16 bg-blue-700 text-white">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <MobileSidebar />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Outlet Switch */}
          {isMultiOutlet && (
            <div className="relative">
              <select
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="appearance-none rounded-xl bg-white/15 px-4 py-2 pr-10 text-sm outline-none border border-white/10 hover:bg-white/20 transition-all duration-200 max-w-42.5 truncate"
              >
                <option value="ALL">All Outlets</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />
            </div>
          )}

          {/* Profile */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold">Admin</span>
            <Avatar className="h-9 w-9 border border-white/15">
              {/* Optional image */}
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-white/20 text-white">
                AD
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile Avatar (if name hidden) */}
          <div className="sm:hidden">
            <Avatar className="h-9 w-9 border border-white/15">
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-white/20 text-white">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
