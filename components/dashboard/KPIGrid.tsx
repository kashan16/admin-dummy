import {
  Calendar,
  Clock,
  IndianRupee,
  ShoppingCart,
  Users,
} from "lucide-react";
import type { KPI } from "@/types";

interface Props {
  data: KPI[];
}

const ICON_MAP: Record<string, any> = {
  Revenue: IndianRupee,
  Orders: ShoppingCart,
  Customers: Users,
  "Avg Prep Time": Clock,
  Reservations: Calendar,
};

export function KPIGrid({ data }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {data.map((item) => {
        const Icon = ICON_MAP[item.label] ?? IndianRupee;

        return (
          <div
            key={item.label}
            className="
              bg-card border border-border shadow-sm
              rounded-2xl p-5
              flex items-center justify-between gap-4
              transition-all duration-200
              hover:shadow-md hover:-translate-y-px
            "
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {item.label}
              </p>

              <p className="text-2xl font-bold text-foreground mt-1 truncate">
                {item.value}
              </p>

              {item.trend && item.trendValue && (
                <p
                  className={`text-xs mt-1 font-semibold ${
                    item.trend === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.trend === "up" ? "▲" : "▼"} {item.trendValue}
                </p>
              )}
            </div>

            <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-border flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-indigo-700" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
