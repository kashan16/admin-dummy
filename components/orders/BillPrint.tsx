import { Order } from "@/types";

export function BillPrint({
  order,
  subtotal,
  tax,
  total,
}: {
  order: Order;
  subtotal: number;
  tax: number;
  total: number;
}) {
  return (
    <div id="bill-print" className="hidden print:block print:p-2">
      <div style={{ fontFamily: "monospace", fontSize: "12px" }}>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          Restaurant Name
        </div>

        <hr />

        {order.items.map((i, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ maxWidth: "70%", overflow: "hidden" }}>
              {i.name} ×{i.quantity}
            </span>
            <span>₹{i.price * i.quantity}</span>
          </div>
        ))}

        <hr />

        <Line label="Subtotal" value={subtotal} />
        <Line label="Tax" value={tax} />
        <Line label="Total" value={total} bold />

        <p style={{ textAlign: "center", marginTop: 8 }}>Thank you</p>
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: bold ? "bold" : "normal" }}>
      <span>{label}</span>
      <span>₹{value}</span>
    </div>
  );
}
