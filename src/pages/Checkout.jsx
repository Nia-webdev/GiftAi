import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaymentMethods from "../components/PaymentMethods";
import { useCart } from "../context/CartContext";
import { validatePayment, buildPaymentFields } from "../utils/orders";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [walletNumber, setWalletNumber] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal === 0 || subtotal >= 100 ? 0 : 5;
  const total = subtotal + delivery;

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleMethodChange = (methodId) => {
    setPaymentMethod(methodId);
    setPaymentError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add a gift first.");
      return;
    }

    // Payment check (wallet number sahi hai ya nahi)
    const paymentProblem = validatePayment(paymentMethod, walletNumber);

    if (paymentProblem) {
      setPaymentError(paymentProblem);
      return;
    }

    const order = {
      id: `GAI-${Date.now()}`,
      customer: { ...form },
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      delivery,
      total,
      ...buildPaymentFields(paymentMethod, walletNumber),
      status: "Order Placed",
      createdAt: new Date().toISOString(),
    };

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("giftai-orders") || "[]"
      );

      localStorage.setItem(
        "giftai-orders",
        JSON.stringify([order, ...savedOrders])
      );

      clearCart();

      navigate("/orders", {
        state: { newOrderId: order.id },
      });
    } catch {
      setError("Unable to save your order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <h1 className="mb-2 text-3xl font-bold">
          Checkout
        </h1>

        <p className="mb-8 text-sm text-[#94ABC1]">
          Enter your details to complete your gift order.
        </p>

        {cartItems.length === 0 ? (
          <section className="rounded-2xl border border-[#164E82] bg-[#071D3A] p-8 text-center">
            <p className="text-xl font-semibold">
              Your cart is empty
            </p>

            <Link
              to="/gifts"
              className="mt-5 inline-block rounded-lg bg-[#22D3EE] px-5 py-3 font-bold text-[#001329]"
            >
              Explore Gifts
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-[#164E82] bg-[#071D3A] p-6"
            >
              <h2 className="text-xl font-bold">
                Delivery Information
              </h2>

              {[
                { name: "fullName", label: "Full Name", type: "text" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "phone", label: "Phone Number", type: "tel" },
                { name: "address", label: "Delivery Address", type: "text" },
                { name: "city", label: "City", type: "text" },
                { name: "postalCode", label: "Postal Code", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm text-[#C7D8E9]"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-[#164E82] bg-[#020D20] px-4 py-3 outline-none focus:border-[#22D3EE]"
                  />
                </div>
              ))}

              {/* Payment */}
              <div className="border-t border-[#164E82] pt-6">
                <h2 className="mb-4 text-xl font-bold">
                  Payment
                </h2>

                <PaymentMethods
                  method={paymentMethod}
                  onMethodChange={handleMethodChange}
                  mobile={walletNumber}
                  onMobileChange={setWalletNumber}
                  error={paymentError}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-rose-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-[#22D3EE] px-5 py-3 font-bold text-[#001329] transition duration-500 ease-out hover:bg-[#52E7FF]"
              >
                {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"} · ${total.toFixed(2)}
              </button>
            </form>

            <aside className="h-fit rounded-2xl border border-[#164E82] bg-[#071D3A] p-6">
              <h2 className="mb-5 text-xl font-bold">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="text-[#C7D8E9]">
                      {item.name} × {item.quantity}
                    </span>

                    <span className="shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-[#164E82] pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-3 flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>
                      {delivery === 0
                        ? "FREE"
                        : `$${delivery.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="mt-5 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#22D3EE]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;