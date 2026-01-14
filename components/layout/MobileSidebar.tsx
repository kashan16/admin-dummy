"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarContent } from "../SidebarContent";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="
            md:hidden
            p-2 rounded-xl
            hover:bg-white/15
            transition-all duration-200
          "
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0 bg-black text-white border-none">
        <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-white/10">
          LOGO
        </div>

        <div className="p-4">
          <SidebarContent onNavigate={() => document.body.click()} />
        </div>

        <div className="p-4">
          <button
            className="
              w-full bg-blue-700 hover:bg-blue-800
              transition-all duration-200
              rounded-xl py-3 font-semibold
            "
          >
            LOGOUT
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
