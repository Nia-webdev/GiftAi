
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

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
    subtotal === 0 || subtotal >= 100 ? 0 : 5;

  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="mx-auto min-h-[65vh] w-full max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#22D3EE]">
            YOUR SHOPPING BAG
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Shopping Cart 🛒
          </h1>

          <p className="mt-3 text-sm text-[#94ABC1]">
            Review your gifts before completing your order.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-[#164E82] bg-[#071D3A] px-5 py-14 text-center">
            <div className="mb-4 text-6xl">🎁</div>

            <h2 className="text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-[#94ABC1]">
              Find something special for someone you love.
            </p>

            <Link
              to="/gifts"
              className="mt-6 inline-block rounded-lg bg-[#22D3EE] px-6 py-3 font-bold text-[#061A3A] transition hover:-translate-y-1 hover:bg-[#54E6FF]"
            >
              Explore Gifts →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_350px]">
            <section className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Your Items ({cartItems.length})
                </h2>

                <Link
                  to="/gifts"
                  className="text-sm text-[#22D3EE] transition hover:text-white"
                >
                  + Add more gifts
                </Link>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[#164E82] bg-[#071D3A] p-4 transition duration-300 hover:border-[#22D3EE] sm:flex-row sm:items-center"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-full rounded-xl object-cover sm:w-28"
                      />
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center rounded-xl bg-[#10365B] text-4xl sm:w-28">
                        🎁
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-[#94ABC1]">
                        Price per item
                      </p>

                      <p className="mt-1 font-bold text-[#22D3EE]">
                        ${item.price.toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="mt-3 text-xs text-[#94ABC1] transition hover:text-[#FF6685]"
                      >
                        Remove item
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="flex items-center rounded-lg border border-[#164E82]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="px-3 py-2 transition hover:bg-[#10365B] hover:text-[#22D3EE]"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="px-3 py-2 transition hover:bg-[#10365B] hover:text-[#22D3EE]"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="rounded-2xl border border-[#164E82] bg-[#071D3A] p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="mb-5 text-xl font-bold">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3 text-[#B9C7E6]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between gap-3 text-[#B9C7E6]">
                  <span>Delivery</span>
                  <span>
                    {delivery === 0
                      ? "FREE"
                      : `$${delivery.toFixed(2)}`}
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
                    <span className="text-[#22D3EE]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#22D3EE] px-4 py-3 text-sm font-bold text-[#061A3A] transition hover:-translate-y-1 hover:bg-[#54E6FF]"
              >
                Proceed to Checkout →
              </Link>

              <Link
                to="/gifts"
                className="mt-4 block text-center text-sm text-[#94ABC1] transition hover:text-[#22D3EE]"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 border-t border-[#164E82] pt-4 text-xs leading-6 text-[#94ABC1]">
                <p>🔒 Secure checkout</p>
                <p>🎁 Gifts for every special moment</p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
