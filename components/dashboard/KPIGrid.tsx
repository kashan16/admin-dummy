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
    { label: "Revenue Today", value: `₹${data.revenue}`, icon: IndianRupee },
    { label: "Active Orders", value: data.orders, icon: ShoppingCart },
    { label: "Customers Today", value: data.customers, icon: Users },
    { label: "Avg Prep Time", value: `${data.prepTime} min`, icon: Clock },
    { label: "Reservations", value: data.reservations, icon: Calendar },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="
            bg-white border border-gray-200 shadow-sm
            rounded-2xl p-5
            flex items-center justify-between
            transition-all duration-200
            hover:shadow-md
          "
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {item.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
              {item.value}
            </p>
          </div>

          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <item.icon className="h-5 w-5 text-blue-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
