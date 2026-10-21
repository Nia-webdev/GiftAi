import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderActions from "../components/OrderActions";
import {
  getOrders,
  getPaymentLabel,
  statusBadgeClasses,
} from "../utils/orders";

function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState(() => getOrders());

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-10 sm:px-8">
        <p className="mb-2 text-sm font-semibold text-[#22D3EE]">
          YOUR GIFT HISTORY
        </p>

        <h1 className="mb-3 text-3xl font-bold">
          My Orders
        </h1>

        <p className="mb-8 text-sm text-[#94ABC1]">
          View your orders, track their status, cancel, return or file a complaint.
        </p>

        {location.state?.newOrderId && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5">
            <h2 className="font-bold text-emerald-300">
              Order placed successfully!
            </h2>

            <p className="mt-2 text-sm">
              Your Order ID: {location.state.newOrderId}
            </p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[#164E82] bg-[#071D3A] p-10 text-center">
            <div className="text-5xl">🎁</div>

            <h2 className="mt-4 text-xl font-bold">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-[#94ABC1]">
              Your completed checkout orders will appear here.
            </p>

            <Link
              to="/gifts"
              className="mt-6 inline-block rounded-lg bg-[#22D3EE] px-5 py-3 font-bold text-[#001329]"
            >
              Explore Gifts
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#164E82] bg-[#071D3A] p-5 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="text-xs text-[#94ABC1]">
                      ORDER ID
                    </p>

                    <h2 className="mt-1 break-all font-bold text-[#22D3EE]">
                      {order.id}
                    </h2>

                    <p className="mt-2 text-sm text-[#94ABC1]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="mt-2 text-sm text-[#C7D8E9]">
                      Payment: {getPaymentLabel(order.paymentMethod)}
                      {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-[#94ABC1]">
                      Order Status
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-sm ${statusBadgeClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <p className="mt-3 text-xl font-bold">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="my-5 border-t border-[#164E82]" />

                <p className="mb-3 text-sm font-semibold">
                  Items ({order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )})
                </p>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3 text-sm text-[#C7D8E9]"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <span>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/track-order?id=${encodeURIComponent(order.id)}`}
                  className="mt-5 inline-block rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] transition hover:bg-[#52E7FF]"
                >
                  Track Order →
                </Link>

                <OrderActions order={order} onUpdate={setOrders} />
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Orders;