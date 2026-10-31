import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderActions from "../components/OrderActions";
import AnimatedBackdrop from "../components/AnimatedBackdrop";
import AnimatedNumber from "../components/AnimatedNumber";
import OrbitGraphic from "../components/OrbitGraphic";
import ScrollProgress from "../components/ScrollProgress";
import SplitText from "../components/SplitText";
import {
  getOrders,
  getPaymentLabel,
  statusBadgeClasses,
} from "../utils/orders";

const ease = [0.22, 1, 0.36, 1];
const stages = ["Placed", "Processing", "Shipped", "Delivered"];

// How far along the delivery line an order is (null = no line, e.g. cancelled)
function stageIndex(status = "") {
  const value = status.toLowerCase();
  if (value.includes("cancel") || value.includes("return")) return null;
  if (value.includes("deliver")) return 3;
  if (value.includes("ship") || value.includes("transit") || value.includes("out for")) return 2;
  if (value.includes("process") || value.includes("confirm") || value.includes("pack")) return 1;
  return 0;
}

const confetti = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const distance = 70 + (i % 3) * 28;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color: ["#22D3EE", "#A78BFA", "#34D399", "#FBBF24", "#F472B6"][i % 5],
    delay: (i % 6) * 0.03,
  };
});

function SuccessBanner({ orderId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease }}
      className="relative mb-6 overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5"
    >
      <div className="pointer-events-none absolute left-9 top-1/2">
        {confetti.map((piece, i) => (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: piece.x, y: piece.y, opacity: 0, scale: 0.4, rotate: 240 }}
            transition={{ duration: 1.3, delay: 0.3 + piece.delay, ease: "easeOut" }}
            className="absolute h-2 w-2 rounded-sm"
            style={{ background: piece.color }}
          />
        ))}
      </div>

      <div className="relative flex items-center gap-4">
        <motion.svg
          viewBox="0 0 52 52"
          className="h-14 w-14 shrink-0"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <circle cx="26" cy="26" r="23" fill="rgba(16,185,129,0.15)" stroke="#34D399" strokeWidth="2" />
          <motion.path
            d="M15 27 l8 8 l15 -17"
            fill="none"
            stroke="#34D399"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          />
        </motion.svg>

        <div>
          <h2 className="font-bold text-emerald-300">Order placed successfully!</h2>
          <p className="mt-1 text-sm">Your Order ID: {orderId}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DeliveryLine({ status }) {
  const index = stageIndex(status);
  if (index === null) return null;

  return (
    <div className="mt-5">
      <div className="relative h-1.5 rounded-full bg-[#0B2A52]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
          initial={{ width: 0 }}
          whileInView={{ width: `${(index / (stages.length - 1)) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider sm:text-xs">
        {stages.map((stage, i) => (
          <span key={stage} className={i <= index ? "text-cyan-300" : "text-[#4F6F92]"}>
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
}

function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState(() => getOrders());

  return (
    <div className="relative min-h-screen bg-[#020D20] text-white">
      <AnimatedBackdrop />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-10 sm:px-8">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.18em" }}
            transition={{ duration: 1.2, ease }}
            className="mb-2 text-sm font-semibold text-[#22D3EE]"
          >
            YOUR GIFT HISTORY
          </motion.p>

          <h1 className="mb-3 text-3xl font-bold sm:text-5xl">
            <SplitText
              delay={0.15}
              segments={[{ text: "My " }, { text: "Orders", className: "text-shimmer" }]}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease }}
            className="mb-8 text-sm text-[#94ABC1]"
          >
            View your orders, track their status, cancel, return or file a complaint.
          </motion.p>

          {location.state?.newOrderId && (
            <SuccessBanner orderId={location.state.newOrderId} />
          )}

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease }}
              className="glow-border flex flex-col items-center rounded-2xl border border-[#164E82] bg-[#071D3A] p-10 text-center"
            >
              <OrbitGraphic size={170} />

              <h2 className="mt-4 text-xl font-bold">No orders yet</h2>

              <p className="mt-2 text-sm text-[#94ABC1]">
                Your completed checkout orders will appear here.
              </p>

              <motion.div className="mt-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/gifts"
                  className="btn-shine inline-block rounded-lg bg-[#22D3EE] px-5 py-3 font-bold text-[#001329] transition duration-500 ease-out hover:bg-[#52E7FF]"
                >
                  Explore Gifts
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {orders.map((order, index) => (
                <motion.article
                  key={order.id}
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: Math.min(index, 4) * 0.1, ease }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[#164E82] bg-[#071D3A] p-5 transition-[border-color,box-shadow] duration-500 hover:border-[#22D3EE]/60 hover:shadow-[0_20px_50px_-28px_rgba(34,211,238,0.5)] sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <p className="text-xs text-[#94ABC1]">ORDER ID</p>

                      <h2 className="mt-1 break-all font-bold text-[#22D3EE]">{order.id}</h2>

                      <p className="mt-2 text-sm text-[#94ABC1]">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <p className="mt-2 text-sm text-[#C7D8E9]">
                        Payment: {getPaymentLabel(order.paymentMethod)}
                        {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-[#94ABC1]">Order Status</p>

                      <span
                        className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${statusBadgeClasses(order.status)}`}
                      >
                        <span className="fx-pulse h-1.5 w-1.5 rounded-full bg-current" />
                        {order.status}
                      </span>

                      <p className="mt-3 text-xl font-bold">
                        <AnimatedNumber value={Number(order.total)} decimals={2} prefix="$" />
                      </p>
                    </div>
                  </div>

                  <DeliveryLine status={order.status} />

                  <div className="my-5 border-t border-[#164E82]" />

                  <p className="mb-3 text-sm font-semibold">
                    Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
                  </p>

                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + itemIndex * 0.07, duration: 0.5, ease }}
                        className="flex justify-between gap-3 text-sm text-[#C7D8E9]"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div className="mt-5 inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      to={`/track-order?id=${encodeURIComponent(order.id)}`}
                      className="btn-shine inline-block rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] transition duration-500 ease-out hover:bg-[#52E7FF]"
                    >
                      Track Order →
                    </Link>
                  </motion.div>

                  <OrderActions order={order} onUpdate={setOrders} />
                </motion.article>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Orders;
