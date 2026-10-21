const STORAGE_KEY = "giftai-orders";

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

// Presentation/testing ke liye true rakho: Track page par "demo" button aata hai
// jo order ka status aage barhata hai (Delivered ke baad Return test ho sakta hai).
// Final submission se pehle false kar dena ya admin panel se status update karo.
export const DEMO_MODE = true;

export const RETURN_WINDOW_DAYS = 7;

export const STATUS_FLOW = ["Order Placed", "Processing", "Shipped", "Delivered"];
export const CANCELLABLE_STATUSES = ["Order Placed", "Processing"];

export const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Delivery time is too long",
  "Want to change address or items",
  "Other",
];

export const RETURN_REASONS = [
  "Item is damaged",
  "Wrong item received",
  "Item not as described",
  "Quality is not good",
  "Other",
];

export const COMPLAINT_TYPES = [
  "Delivery delay",
  "Damaged or wrong item",
  "Payment issue",
  "Refund issue",
  "Customer service",
  "Other",
];

export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "💵",
    description: "Pay in cash when your order arrives.",
    wallet: false,
  },
  {
    id: "easypaisa",
    label: "Easypaisa",
    icon: "📱",
    description: "Pay with your Easypaisa mobile account.",
    wallet: true,
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    icon: "📲",
    description: "Pay with your JazzCash mobile account.",
    wallet: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                    */
/* ------------------------------------------------------------------ */

export function getOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// Ek order ko update karke poori updated list return karta hai
function updateOrder(orderId, updater) {
  const updated = getOrders().map((order) =>
    order.id === orderId ? updater(order) : order,
  );
  saveOrders(updated);
  return updated;
}

/* ------------------------------------------------------------------ */
/*  Payment                                                            */
/* ------------------------------------------------------------------ */

export function getPaymentLabel(methodId) {
  return PAYMENT_METHODS.find((m) => m.id === methodId)?.label ?? "Not specified";
}

// Checkout par form submit se pehle call karo. Error text return karta hai ("" = theek).
export function validatePayment(methodId, mobile = "") {
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);

  if (!method) return "Please select a payment method.";

  if (method.wallet && !/^03\d{9}$/.test(mobile.trim())) {
    return `Enter a valid ${method.label} number (format: 03XXXXXXXXX).`;
  }

  return "";
}

// Order object mein spread karo: { ...buildPaymentFields(method, mobile) }
// Poora mobile number save nahi hota, sirf aakhri 4 digits.
export function buildPaymentFields(methodId, mobile = "") {
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);

  if (method?.wallet) {
    return {
      paymentMethod: method.id,
      paymentStatus: "Paid",
      payerNumber: `*******${mobile.trim().slice(-4)}`,
    };
  }

  return { paymentMethod: "cod", paymentStatus: "Pay on Delivery" };
}

/* ------------------------------------------------------------------ */
/*  Cancel                                                             */
/* ------------------------------------------------------------------ */

export function canCancel(order) {
  return CANCELLABLE_STATUSES.includes(order?.status);
}

export function cancelOrder(orderId, reason = "") {
  return updateOrder(orderId, (order) => {
    if (!canCancel(order)) return order;

    let paymentStatus = order.paymentStatus;
    if (paymentStatus === "Paid") paymentStatus = "Refund Pending";
    if (paymentStatus === "Pay on Delivery") paymentStatus = "Not Charged";

    return {
      ...order,
      status: "Cancelled",
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
      paymentStatus,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Return                                                             */
/* ------------------------------------------------------------------ */

// Return sirf Delivered order par, 7 din ke andar, aur sirf ek dafa
export function canReturn(order) {
  if (order?.status !== "Delivered" || order.returnRequest) return false;

  const deliveredAt = new Date(order.deliveredAt || order.createdAt).getTime();
  return Date.now() - deliveredAt <= RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export function requestReturn(orderId, reason, details = "") {
  return updateOrder(orderId, (order) =>
    canReturn(order)
      ? {
          ...order,
          returnRequest: {
            reason,
            details,
            status: "Return Requested",
            requestedAt: new Date().toISOString(),
          },
        }
      : order,
  );
}

/* ------------------------------------------------------------------ */
/*  Complaint                                                          */
/* ------------------------------------------------------------------ */

export function fileComplaint(orderId, type, message) {
  return updateOrder(orderId, (order) => ({
    ...order,
    complaints: [
      ...(order.complaints || []),
      {
        id: `CMP-${Date.now()}`,
        type,
        message,
        status: "Open",
        createdAt: new Date().toISOString(),
      },
    ],
  }));
}

/* ------------------------------------------------------------------ */
/*  Status update (admin panel ya demo button ke liye)                 */
/* ------------------------------------------------------------------ */

export function updateOrderStatus(orderId, status) {
  return updateOrder(orderId, (order) => {
    const next = { ...order, status };

    if (status === "Delivered") {
      next.deliveredAt = new Date().toISOString();
      // Cash on Delivery ka payment delivery par hota hai
      if (order.paymentStatus === "Pay on Delivery") next.paymentStatus = "Paid";
    }

    return next;
  });
}

/* ------------------------------------------------------------------ */
/*  Badge colors                                                       */
/* ------------------------------------------------------------------ */

export function statusBadgeClasses(status) {
  if (status === "Cancelled") return "bg-rose-500/10 text-rose-300";
  if (status === "Delivered") return "bg-emerald-500/10 text-emerald-300";
  if (status === "Return Requested") return "bg-amber-500/10 text-amber-300";
  return "bg-cyan-400/10 text-cyan-300";
}