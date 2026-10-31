
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

function GiftDetails() {
  const location = useLocation();
  const gift = location.state?.gift;

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  const price = Number(
    String(gift?.price ?? 0).replace(/[$,]/g, "")
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(gift);
    }

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (!gift) {
    return (
      <div className="min-h-screen bg-[#020D20] text-white">
        <Navbar />

        <main className="px-5 py-20 text-center">
          <h1 className="text-2xl font-bold">
            Please select a gift first 🎁
          </h1>

          <p className="mt-3 text-[#9BB5D0]">
            Choose a gift to see its details.
          </p>

          <Link
            to="/gifts"
            className="mt-6 inline-block rounded-lg bg-[#22D3EE] px-6 py-3 font-bold text-[#001329] hover:bg-[#52E7FF]"
          >
            Browse Gifts
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Link
          to="/gifts"
          className="mb-8 inline-block text-sm text-[#22D3EE] hover:text-white"
        >
          ← Back to Gifts
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-[#103F69] bg-[#071D3A] p-3">
            <img
              src={gift.image}
              alt={gift.name}
              className="h-[300px] w-full rounded-xl object-cover sm:h-[420px]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-3 w-fit rounded-full border border-[#087E9A] bg-[#073047] px-3 py-1 text-xs text-[#22D3EE]">
              {gift.category || "Special Gift"}
            </span>

            <h1 className="text-3xl font-bold sm:text-4xl">
              {gift.name}
            </h1>

            <p className="mt-4 text-sm text-[#9BB5D0]">
              A thoughtful gift to make someone's special moment
              even more memorable.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-lg text-[#FFC642]">
                ★ {gift.rating ?? "New"}
              </span>

              {gift.reviews != null && (
                <span className="text-sm text-[#9BB5D0]">
                  ({gift.reviews} reviews)
                </span>
              )}
            </div>

            <p className="mt-6 text-3xl font-bold text-[#22D3EE]">
              ${price.toFixed(2)}
            </p>

            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#103F69]">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="px-4 py-2 text-xl transition duration-500 ease-out hover:bg-[#103F69]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="min-w-12 text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => current + 1)
                  }
                  className="px-4 py-2 text-xl transition duration-500 ease-out hover:bg-[#103F69]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#103F69] bg-[#071D3A] p-4">
              <span className="text-sm text-[#9BB5D0]">
                Total Price
              </span>

              <span className="text-xl font-bold">
                ${(price * quantity).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold transition-all duration-500 ease-out active:scale-[0.99] ${
                isAdded
                  ? "scale-[1.02] bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-[#22D3EE] text-[#001329] shadow-md shadow-cyan-400/10 hover:bg-[#52E7FF] hover:shadow-lg hover:shadow-cyan-400/20"
              }`}
            >
              {isAdded ? (
                <>
                  <span className="text-lg">✓</span>
                  Added to Cart!
                </>
              ) : (
                <>
                  <span className="text-lg">🛒</span>
                  Add to Cart
                </>
              )}
            </button>

            {isAdded && (
              <p className="mt-3 text-center text-sm font-medium text-green-400">
                🎁 Your gift has been added to the cart!
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default GiftDetails;
