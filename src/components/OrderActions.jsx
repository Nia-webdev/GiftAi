import { useState } from "react";
import {
  cancelOrder,
  canCancel,
  canReturn,
  requestReturn,
  fileComplaint,
  CANCEL_REASONS,
  RETURN_REASONS,
  COMPLAINT_TYPES,
  RETURN_WINDOW_DAYS,
  statusBadgeClasses,
} from "../utils/orders";

const PANELS = {
  cancel: {
    title: "Cancel this order",
    label: "Reason for cancelling",
    options: CANCEL_REASONS,
    needsMessage: false,
    submit: "Confirm Cancellation",
    success: "Your order has been cancelled.",
  },
  return: {
    title: "Request a return",
    label: "Reason for return",
    options: RETURN_REASONS,
    needsMessage: true,
    submit: "Submit Return Request",
    success: "Return request submitted. We will contact you soon.",
  },
  complaint: {
    title: "File a complaint",
    label: "Complaint type",
    options: COMPLAINT_TYPES,
    needsMessage: true,
    submit: "Submit Complaint",
    success: "Complaint submitted. Our team will review it.",
  },
};

const fieldClass =
  "w-full rounded-lg border border-[#164E82] bg-[#020D20] px-4 py-3 text-sm outline-none focus:border-[#22D3EE]";

function OrderActions({ order, onUpdate }) {
  const [panel, setPanel] = useState(null); // "cancel" | "return" | "complaint"
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const openPanel = (name) => {
    if (panel === name) {
      setPanel(null);
      return;
    }

    setPanel(name);
    setReason(PANELS[name].options[0]);
    setMessage("");
    setError("");
    setNotice("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const config = PANELS[panel];

    if (config.needsMessage && message.trim().length < 10) {
      setError("Please describe the problem (at least 10 characters).");
      return;
    }

    let updated;

    if (panel === "cancel") updated = cancelOrder(order.id, reason);
    if (panel === "return") updated = requestReturn(order.id, reason, message.trim());
    if (panel === "complaint") updated = fileComplaint(order.id, reason, message.trim());

    onUpdate(updated);
    setNotice(config.success);
    setPanel(null);
  };

  const complaints = order.complaints || [];

  return (
    <div className="mt-5 space-y-4">
      {/* Cancelled info */}
      {order.status === "Cancelled" && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          This order was cancelled
          {order.cancelledAt
            ? ` on ${new Date(order.cancelledAt).toLocaleDateString()}`
            : ""}
          {order.cancelReason ? ` (${order.cancelReason})` : ""}.
          {order.paymentStatus === "Refund Pending" &&
            " Your payment will be refunded to your wallet."}
        </div>
      )}

      {/* Return info */}
      {order.returnRequest && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses(
              order.returnRequest.status
            )}`}
          >
            {order.returnRequest.status}
          </span>

          <p className="mt-2 text-amber-200">
            Reason: {order.returnRequest.reason}
          </p>
        </div>
      )}

      {/* Complaints */}
      {complaints.length > 0 && (
        <div className="rounded-lg border border-[#164E82] bg-[#020D20] p-4">
          <p className="mb-2 text-sm font-semibold">
            Complaints ({complaints.length})
          </p>

          <div className="space-y-2">
            {complaints.map((item) => (
              <div key={item.id} className="text-sm text-[#C7D8E9]">
                <span className="font-medium">{item.type}</span>
                <span className="ml-2 rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-300">
                  {item.status}
                </span>
                <p className="mt-1 text-xs text-[#94ABC1]">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {notice && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {notice}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {canCancel(order) && (
          <button
            type="button"
            onClick={() => openPanel("cancel")}
            className="rounded-lg border border-rose-400/50 px-5 py-3 text-sm font-semibold text-rose-300 transition duration-500 ease-out hover:bg-rose-400/10"
          >
            Cancel Order
          </button>
        )}

        {canReturn(order) && (
          <button
            type="button"
            onClick={() => openPanel("return")}
            className="rounded-lg border border-amber-400/50 px-5 py-3 text-sm font-semibold text-amber-300 transition duration-500 ease-out hover:bg-amber-400/10"
          >
            Return Order
          </button>
        )}

        <button
          type="button"
          onClick={() => openPanel("complaint")}
          className="rounded-lg border border-[#164E82] px-5 py-3 text-sm font-semibold text-[#C7D8E9] transition duration-500 ease-out hover:border-cyan-400/50 hover:text-white"
        >
          File Complaint
        </button>
      </div>

      {order.status === "Delivered" && !order.returnRequest && !canReturn(order) && (
        <p className="text-xs text-[#94ABC1]">
          The {RETURN_WINDOW_DAYS}-day return window for this order has ended.
        </p>
      )}

      {/* Form panel */}
      {panel && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-[#164E82] bg-[#020D20] p-5"
        >
          <h3 className="font-bold">{PANELS[panel].title}</h3>

          <div>
            <label className="mb-2 block text-sm text-[#94ABC1]">
              {PANELS[panel].label}
            </label>

            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={fieldClass}
            >
              {PANELS[panel].options.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {PANELS[panel].needsMessage && (
            <div>
              <label className="mb-2 block text-sm text-[#94ABC1]">
                Details
              </label>

              <textarea
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us what happened..."
                className={fieldClass}
              />
            </div>
          )}

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] transition duration-500 ease-out hover:bg-[#52E7FF]"
            >
              {PANELS[panel].submit}
            </button>

            <button
              type="button"
              onClick={() => setPanel(null)}
              className="rounded-lg border border-[#164E82] px-5 py-3 text-sm text-[#C7D8E9] hover:text-white"
            >
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default OrderActions;