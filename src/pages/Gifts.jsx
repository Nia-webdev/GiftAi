import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GiftCard from "../components/GiftCard";
import gifts from "../data/gifts";

const categories = ["All Gifts", ...new Set(gifts.map((gift) => gift.category))];
function Gifts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All Gifts";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const chooseCategory = (category) => {
    setSearchParams(
      category === "All Gifts" ? {} : { category }
    );
  };

  const filteredGifts = useMemo(() => {
    let result = gifts.filter((gift) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        gift.name.toLowerCase().includes(term) ||
        gift.category.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All Gifts" ||
        gift.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, selectedCategory, sort]);

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10">
        <section className="mb-8 rounded-2xl border border-[#103F69] bg-gradient-to-r from-[#071D3A] to-[#062849] p-6 sm:p-9">
          <p className="mb-3 text-sm font-semibold text-[#22D3EE]">
            FIND SOMETHING SPECIAL
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Explore Our{" "}
            <span className="text-[#22D3EE]">Gift Collection</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9BB5D0]">
            Thoughtful gifts for birthdays, anniversaries, celebrations and
            every special moment.
          </p>

          <Link
            to="/ai-recommendation"
            className="mt-5 inline-flex rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] transition hover:bg-[#52E7FF]"
          >
            Find My Perfect Gift ✨
          </Link>
        </section>

        <section className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {selectedCategory === "All Gifts"
                ? "Browse Gifts"
                : selectedCategory}
            </h2>

            <p className="mt-1 text-sm text-[#9BB5D0]">
              {filteredGifts.length} gifts found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search gifts..."
              className="w-full rounded-lg border border-[#103F69] bg-[#071D3A] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7893AD] focus:border-[#22D3EE] sm:w-64"
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-[#103F69] bg-[#071D3A] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </section>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => chooseCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                selectedCategory === category
                  ? "border-[#22D3EE] bg-[#22D3EE] font-semibold text-[#001329]"
                  : "border-[#103F69] bg-[#071D3A] text-[#C7D8E9] hover:border-[#22D3EE] hover:text-[#22D3EE]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredGifts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filteredGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#103F69] bg-[#071D3A] px-5 py-16 text-center">
            <div className="text-4xl">🎁</div>
            <h3 className="mt-4 text-xl font-bold">No gifts found</h3>
            <p className="mt-2 text-sm text-[#9BB5D0]">
              Try another search or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSort("featured");
                setSearchParams({});
              }}
              className="mt-5 rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] hover:bg-[#52E7FF]"
            >
              Show All Gifts
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Gifts;
