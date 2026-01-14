import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#e9e9ff] p-6 flex justify-center">
      <div className="w-full max-w-7xl rounded-3xl overflow-hidden shadow-xl bg-white flex min-h-[90vh]">
        <Sidebar />

        <div className="flex-1 bg-[#F7F7FB] relative">
          <Topbar />

          <main className="pt-20 px-6 pb-8 md:ml-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
