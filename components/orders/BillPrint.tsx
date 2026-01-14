import { Order } from "@/types";

interface Props {
  order: Order;
  subtotal: number;
  tax: number;
  total: number;
}

export function BillPrint({ order, subtotal, tax, total }: Props) {
  return (
    <div id="bill-print" className="hidden print:block">
      <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            Restaurant Name
          </div>
          <div>{order.outlet}</div>
          <div>Table {order.table}</div>
        </div>

        <hr style={{ margin: "8px 0" }} />

        {/* ITEMS */}
        {order.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr style={{ margin: "8px 0" }} />

        {/* TOTALS */}
        <Line label="Subtotal" value={`₹${subtotal}`} />
        <Line label="Tax (5%)" value={`₹${tax}`} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginTop: "6px",
          }}
        >
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <hr style={{ margin: "8px 0" }} />

        {/* FOOTER */}
        <div style={{ textAlign: "center", fontSize: "10px" }}>
          Thank you 🙏
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
