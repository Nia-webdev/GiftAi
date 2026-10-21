import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderActions from "../components/OrderActions";
import {
  DEMO_MODE,
  STATUS_FLOW,
  getOrders,
  getPaymentLabel,
  statusBadgeClasses,
  updateOrderStatus,
} from "../utils/orders";

function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [searchedId, setSearchedId] = useState(searchParams.get("id") || "");
  const [orders, setOrders] = useState(() => getOrders());

  const order = orders.find(
    (item) => item.id.toLowerCase() === searchedId.trim().toLowerCase()
  );

  const nextStatus = order
    ? STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]
    : undefined;

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanId = orderId.trim();

    setSearchedId(cleanId);
    setSearchParams({ id: cleanId });
    setOrders(getOrders());
  };

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-12 sm:px-8">
        <p className="mb-2 text-sm font-semibold text-[#22D3EE]">
          ORDER UPDATES
        </p>

        <h1 className="text-3xl font-bold">
          Track Your Order
        </h1>

        <p className="mt-3 text-sm text-[#94ABC1]">
          Enter the Order ID provided after checkout.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Example: GAI-123456789"
            required
            className="min-w-0 flex-1 rounded-lg border border-[#164E82] bg-[#071D3A] px-4 py-3 outline-none focus:border-[#22D3EE]"
          />

          <button
            type="submit"
            className="rounded-lg bg-[#22D3EE] px-6 py-3 font-bold text-[#001329] hover:bg-[#52E7FF]"
          >
            Track
          </button>
        </form>

        {searchedId && (
          order ? (
            <section className="mt-8 rounded-2xl border border-[#164E82] bg-[#071D3A] p-6">
              <p className="text-sm text-[#94ABC1]">
                Order ID
              </p>

              <h2 className="mt-1 break-all text-lg font-bold text-[#22D3EE]">
                {order.id}
              </h2>

              <div className="mt-6 rounded-xl bg-[#020D20] p-5">
                <p className="text-sm text-[#94ABC1]">
                  Current Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-4 py-1.5 text-lg font-bold ${statusBadgeClasses(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-5 text-sm text-[#C7D8E9]">
                Customer: {order.customer.fullName}
              </p>

              <p className="mt-2 text-sm text-[#C7D8E9]">
                Total: ${Number(order.total).toFixed(2)}
              </p>

              <p className="mt-2 text-sm text-[#C7D8E9]">
                Delivery city: {order.customer.city}
              </p>

              <p className="mt-2 text-sm text-[#C7D8E9]">
                Payment: {getPaymentLabel(order.paymentMethod)}
                {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
              </p>

              <OrderActions order={order} onUpdate={setOrders} />

              {DEMO_MODE && nextStatus && order.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() => setOrders(updateOrderStatus(order.id, nextStatus))}
                  className="mt-5 rounded-lg border border-dashed border-cyan-400/50 px-4 py-2 text-xs text-cyan-300 hover:bg-cyan-400/10"
                >
                  Demo: move status to "{nextStatus}"
                </button>
              )}

              <p className="mt-4 text-xs text-[#94ABC1]">
                This is the status saved by your GiftAI application.
              </p>
            </section>
          ) : (
            <div className="mt-8 rounded-xl border border-rose-500/30 bg-[#071D3A] p-5">
              <p className="font-semibold text-rose-300">
                Order not found
              </p>

              <p className="mt-2 text-sm text-[#94ABC1]">
                Check the Order ID or open tracking from your Orders page.
              </p>
            </div>
          )
        )}

        <Link
          to="/orders"
          className="mt-6 inline-block text-sm text-[#22D3EE] hover:text-white"
        >
          ← Back to My Orders
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default TrackOrder;