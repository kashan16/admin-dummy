import { Calendar, Clock, IndianRupee, ShoppingCart, Users } from "lucide-react";

interface Props {
  data: {
    revenue: number;
    orders: number;
    customers: number;
    prepTime: number;
    reservations: number;
  };
}

export function KPIGrid({ data }: Props) {
  const items = [
    { label: "Revenue Today", value: `₹${data.revenue}`, icon: IndianRupee, tint: "bg-indigo-50" },
    { label: "Active Orders", value: data.orders, icon: ShoppingCart, tint: "bg-card" },
    { label: "Customers Today", value: data.customers, icon: Users, tint: "bg-card" },
    { label: "Avg Prep Time", value: `${data.prepTime} min`, icon: Clock, tint: "bg-indigo-50" },
    { label: "Reservations", value: data.reservations, icon: Calendar, tint: "bg-card" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {items.map((item) => (
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
          </div>

          <div className={`h-11 w-11 rounded-2xl ${item.tint} border border-border flex items-center justify-center shrink-0`}>
            <item.icon className="h-5 w-5 text-blue-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
