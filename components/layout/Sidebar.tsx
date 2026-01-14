"use client";

import { SidebarContent } from "../SidebarContent";

export function Sidebar() {
  return (
    <aside
      className="
        w-64 hidden md:flex flex-col
        bg-black text-white
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
          bg-blue-700 hover:bg-blue-800
          transition-all duration-200
          rounded-xl py-3 font-semibold
        "
      >
        LOGOUT
      </button>
    </aside>
  );
}
