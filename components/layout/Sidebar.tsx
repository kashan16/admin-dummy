"use client";

import { SidebarContent } from "../SidebarContent";

export function Sidebar() {
  return (
    <aside
      className="
        w-64 hidden md:flex flex-col
        bg-[#FFF1F2] text-[#7F1D1D]
        border-r border-rose-200
        p-6
      "
    >
      {/* Logo */}
      <div className="text-xl font-bold mb-10 tracking-wide">
        LOGO
      </div>

      {/* Nav */}
      <div className="flex-1">
        <SidebarContent />
      </div>

      {/* Logout */}
      <button
        className="
          w-full mt-6
          bg-[#FB7185] hover:bg-[#F43F5E]
          text-white
          transition-all duration-200
          rounded-xl py-3 font-semibold
        "
      >
        LOGOUT
      </button>
    </aside>
  );
}
