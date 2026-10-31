import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackdrop from "../components/AnimatedBackdrop";
import AnimatedNumber from "../components/AnimatedNumber";
import OrbitGraphic from "../components/OrbitGraphic";
import ScrollProgress from "../components/ScrollProgress";
import SplitText from "../components/SplitText";
import { useCart } from "../context/CartContext";

const ease = [0.22, 1, 0.36, 1];
const FREE_DELIVERY_AT = 100;
const steps = ["Cart", "Checkout", "Complete"];

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Example delivery rule: free delivery on orders of $100 or more.
  const delivery =
    subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : 5;

  const total = subtotal + delivery;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100);
  const qualifies = subtotal >= FREE_DELIVERY_AT;

  return (
    <div className="relative min-h-screen bg-[#020D20] text-white">
      <AnimatedBackdrop />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto min-h-[65vh] w-full max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.18em" }}
              transition={{ duration: 1.2, ease }}
              className="mb-2 text-sm font-medium text-[#22D3EE]"
            >
              YOUR SHOPPING BAG
            </motion.p>

            <h1 className="text-3xl font-bold sm:text-5xl">
              <SplitText
                delay={0.15}
                segments={[{ text: "Shopping " }, { text: "Cart", className: "text-shimmer" }]}
              />{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -40 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 12 }}
                className="inline-block"
              >
                🛒
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease }}
              className="mt-3 text-sm text-[#94ABC1]"
            >
              Review your gifts before completing your order.
            </motion.p>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease }}
              className="mt-6 flex max-w-md items-center"
            >
              {steps.map((step, index) => (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${
                        index === 0
                          ? "fx-pulse-ring border-[#22D3EE] bg-[#22D3EE] text-[#001329]"
                          : "border-[#164E82] text-[#5F7FA3]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-xs ${index === 0 ? "text-white" : "text-[#5F7FA3]"}`}>
                      {step}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-[#164E82]">
                      {index === 0 && (
                        <motion.div
                          className="h-px bg-[#22D3EE]"
                          initial={{ width: 0 }}
                          animate={{ width: "35%" }}
                          transition={{ delay: 1.2, duration: 1, ease }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.9, ease }}
              className="glow-border flex flex-col items-center rounded-2xl border border-[#164E82] bg-[#071D3A] px-5 py-14 text-center"
            >
              <OrbitGraphic size={170} />

              <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>

              <p className="mt-3 text-sm text-[#94ABC1]">
                Find something special for someone you love.
              </p>

              <motion.div className="mt-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/gifts"
                  className="btn-shine inline-block rounded-lg bg-[#22D3EE] px-6 py-3 font-bold text-[#061A3A] transition duration-500 ease-out hover:bg-[#54E6FF]"
                >
                  Explore Gifts →
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_350px]">
              <section className="min-w-0">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Your Items ({cartItems.length})
                  </h2>

                  <Link
                    to="/gifts"
                    className="hv-link text-sm text-[#22D3EE] transition duration-500 ease-out hover:text-white"
                  >
                    + Add more gifts
                  </Link>
                </div>

                {/* Free delivery progress */}
                <div className="mb-5 rounded-2xl border border-[#164E82] bg-[#071D3A] p-4">
                  <p className="mb-3 text-sm text-[#C7D8E9]">
                    {qualifies ? (
                      <span className="font-semibold text-emerald-300">🎉 You unlocked free delivery!</span>
                    ) : (
                      <>
                        Add <span className="font-bold text-[#22D3EE]">${(FREE_DELIVERY_AT - subtotal).toFixed(2)}</span>{" "}
                        more to get free delivery
                      </>
                    )}
                  </p>

                  <div className="relative h-2 rounded-full bg-[#0B2A52]">
                    <motion.div
                      className={`h-full rounded-full ${qualifies ? "bg-gradient-to-r from-emerald-400 to-cyan-300" : "bg-gradient-to-r from-cyan-400 to-sky-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease }}
                    />
                    <motion.span
                      className="absolute -top-3 text-lg"
                      initial={{ left: 0 }}
                      animate={{ left: `calc(${progress}% - 14px)` }}
                      transition={{ duration: 1, ease }}
                    >
                      🚚
                    </motion.span>
                  </div>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false} mode="popLayout">
                    {cartItems.map((item, index) => (
                      <motion.article
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: index * 0.07, duration: 0.6, ease },
                        }}
                        exit={{ opacity: 0, x: 90, scale: 0.94, transition: { duration: 0.35 } }}
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                        className="group flex flex-col gap-4 rounded-2xl border border-[#164E82] bg-[#071D3A] p-4 transition-[border-color,box-shadow] duration-500 ease-out hover:border-[#22D3EE] hover:shadow-[0_18px_40px_-24px_rgba(34,211,238,0.45)] sm:flex-row sm:items-center"
                      >
                        {item.image ? (
                          <div className="h-28 w-full overflow-hidden rounded-xl sm:w-28">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                            />
                          </div>
                        ) : (
                          <div className="flex h-28 w-full items-center justify-center rounded-xl bg-[#10365B] text-4xl sm:w-28">
                            🎁
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">{item.name}</h3>

                          <p className="mt-2 text-sm text-[#94ABC1]">Price per item</p>

                          <p className="mt-1 font-bold text-[#22D3EE]">
                            ${item.price.toFixed(2)}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#94ABC1] transition duration-500 ease-out hover:text-[#FF6685]"
                          >
                            <Trash2 size={13} />
                            Remove item
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <div className="flex items-center overflow-hidden rounded-lg border border-[#164E82]">
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="px-3 py-2 transition duration-500 ease-out hover:bg-[#10365B] hover:text-[#22D3EE]"
                            >
                              −
                            </motion.button>

                            <span className="relative block h-9 min-w-9 overflow-hidden text-center text-sm">
                              <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ y: -18, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: 18, opacity: 0 }}
                                  transition={{ duration: 0.22 }}
                                  className="absolute inset-0 grid place-items-center"
                                >
                                  {item.quantity}
                                </motion.span>
                              </AnimatePresence>
                            </span>

                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                              className="px-3 py-2 transition duration-500 ease-out hover:bg-[#10365B] hover:text-[#22D3EE]"
                            >
                              +
                            </motion.button>
                          </div>

                          <p className="font-bold">
                            <AnimatedNumber value={item.price * item.quantity} decimals={2} prefix="$" />
                          </p>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              </section>

              <motion.aside
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease }}
                className="glow-border rounded-2xl border border-[#164E82] bg-[#071D3A] p-5 sm:p-6 lg:sticky lg:top-24"
              >
                <h2 className="mb-5 text-xl font-bold">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3 text-[#B9C7E6]">
                    <span>Subtotal</span>
                    <span>
                      <AnimatedNumber value={subtotal} decimals={2} prefix="$" />
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-[#B9C7E6]">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? "font-semibold text-emerald-300" : ""}>
                      {delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
                    </span>
                  </div>

                  <p className="text-xs text-[#22D3EE]">
                    {subtotal >= 100
                      ? "You qualify for free delivery!"
                      : `Spend $${(100 - subtotal).toFixed(2)} more for free delivery.`}
                  </p>

                  <div className="border-t border-[#164E82] pt-4">
                    <div className="flex justify-between gap-3 text-base font-bold">
                      <span>Total</span>
                      <span className="text-xl text-[#22D3EE]">
                        <AnimatedNumber value={total} decimals={2} prefix="$" />
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div className="mt-6" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/checkout"
                    className="btn-shine flex w-full items-center justify-center rounded-lg bg-[#22D3EE] px-4 py-3 text-sm font-bold text-[#061A3A] shadow-[0_14px_40px_-14px_rgba(34,211,238,0.7)] transition duration-500 ease-out hover:bg-[#54E6FF]"
                  >
                    Proceed to Checkout →
                  </Link>
                </motion.div>

                <Link
                  to="/gifts"
                  className="mt-4 block text-center text-sm text-[#94ABC1] transition duration-500 ease-out hover:text-[#22D3EE]"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 space-y-1 border-t border-[#164E82] pt-4 text-xs leading-6 text-[#94ABC1]">
                  {["🔒 Secure checkout", "🎁 Gifts for every special moment"].map((line, index) => (
                    <motion.p
                      key={line}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.15, duration: 0.5 }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </motion.aside>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Cart;
