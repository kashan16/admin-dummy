// BillPrint.tsx
import { Order } from "@/types";
import { forwardRef } from "react";

interface BillPrintProps {
  order: Order & { outletName?: string };
  subtotal: number;
  tax: number;
  total: number;
}

export const BillPrint = forwardRef<HTMLDivElement, BillPrintProps>(
  ({ order, subtotal, tax, total }, ref) => {
    // Format numbers to 2 decimal places
    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

    // Get current date/time
    const billDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return (
      <div ref={ref} style={{ padding: "8px" }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.4",
            maxWidth: "80mm",
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            RESTAURANT NAME
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              marginBottom: "2px",
            }}
          >
            Your Address Line 1
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              marginBottom: "2px",
            }}
          >
            City, State - PIN
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              marginBottom: "6px",
            }}
          >
            Ph: +91-XXXXXXXXXX
          </div>

          <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "4px 0" }} />

          {/* Bill Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              marginBottom: "2px",
            }}
          >
            <span>Order #: {order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              marginBottom: "2px",
            }}
          >
            <span>Date: {billDate}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              marginBottom: "2px",
            }}
          >
            <span>Customer: {order.customer}</span>
          </div>
          {order.outletName && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                marginBottom: "4px",
              }}
            >
              <span>Outlet: {order.outletName}</span>
            </div>
          )}

          <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "4px 0" }} />

          {/* Items */}
          <div style={{ marginBottom: "6px" }}>
            {order.items.map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span
                    style={{
                      maxWidth: "70%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  {item.quantity} × {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "4px 0" }} />

          {/* Totals */}
          <Line label="Subtotal" value={formatCurrency(subtotal)} />
          <Line label="GST (5%)" value={formatCurrency(tax)} />
          <div
            style={{
              borderTop: "1px solid #000",
              marginTop: "4px",
              paddingTop: "4px",
            }}
          >
            <Line label="TOTAL" value={formatCurrency(total)} bold />
          </div>

          <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "8px 0 4px" }} />

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              marginTop: "8px",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            Thank You! Visit Again
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "9px",
              marginTop: "4px",
            }}
          >
            GSTIN: XXXXXXXXXXXX
          </p>
        </div>
      </div>
    );
  }
);

BillPrint.displayName = "BillPrint";

function Line({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: bold ? "bold" : "normal",
        marginBottom: "2px",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}