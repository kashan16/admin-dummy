import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#e9e9ff] flex justify-center overflow-x-hidden">
      {/* ✅ responsive padding */}
      <div className="w-full max-w-7xl sm:p-6 p-0">
        <div className="w-full rounded-none sm:rounded-3xl overflow-hidden shadow-xl bg-white flex min-h-[100dvh] sm:min-h-[90vh]">
          <Sidebar />

          {/* ✅ prevent child overflow */}
          <div className="flex-1 bg-[#F7F7FB] relative min-w-0 overflow-x-hidden">
            <Topbar />

            {/* ✅ responsive main padding */}
            <main className="p-3 sm:p-6 min-w-0 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
