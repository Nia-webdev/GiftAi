import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GiftCard from "../components/GiftCard";
import AnimatedBackdrop from "../components/AnimatedBackdrop";
import AnimatedNumber from "../components/AnimatedNumber";
import OrbitGraphic from "../components/OrbitGraphic";
import ScrollProgress from "../components/ScrollProgress";
import SplitText from "../components/SplitText";
import TiltCard from "../components/TiltCard";
import gifts from "../data/gifts";

const categories = ["All Gifts", ...new Set(gifts.map((gift) => gift.category))];
const ease = [0.22, 1, 0.36, 1];
const PAGE_SIZE = 24;

const heroStats = [
  { label: "Curated gifts", value: gifts.length, suffix: "+" },
  { label: "Occasions", value: categories.length - 1 },
  { label: "Avg. rating", value: 4.6, decimals: 1 },
];

function Gifts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All Gifts";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const chooseCategory = (category) => {
    setSearchParams(category === "All Gifts" ? {} : { category });
  };

  const filteredGifts = useMemo(() => {
    let result = gifts.filter((gift) => {
      const term = search.trim().toLowerCase();

      const matchesSearch =
        gift.name.toLowerCase().includes(term) ||
        gift.category.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All Gifts" || gift.category === selectedCategory;

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

  // Start from the first page again whenever the filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, selectedCategory, sort]);

  // Load the next page when the bottom of the grid comes near the screen
  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((count) => count + PAGE_SIZE);
      },
      { rootMargin: "500px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visibleCount, filteredGifts.length]);

  const visibleGifts = filteredGifts.slice(0, visibleCount);

  return (
    <div className="relative min-h-screen bg-[#020D20] text-white">
      <AnimatedBackdrop />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10">
          {/* Hero banner */}
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease }}
            className="banner-flow relative mb-6 overflow-hidden rounded-2xl border border-[#103F69] p-6 sm:p-9"
          >
            <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.6em" }}
                  animate={{ opacity: 1, letterSpacing: "0.18em" }}
                  transition={{ duration: 1.2, ease }}
                  className="mb-3 text-sm font-semibold text-[#22D3EE]"
                >
                  FIND SOMETHING SPECIAL
                </motion.p>

                <h1 className="text-3xl font-bold sm:text-5xl">
                  <SplitText
                    delay={0.2}
                    segments={[
                      { text: "Explore Our " },
                      { text: "Gift Collection", className: "text-shimmer" },
                    ]}
                  />
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8, ease }}
                  className="mt-3 max-w-2xl text-sm leading-6 text-[#9BB5D0]"
                >
                  Thoughtful gifts for birthdays, anniversaries, celebrations and
                  every special moment.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8, ease }}
                >
                  <motion.div className="mt-5 inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      to="/ai-recommendation"
                      className="btn-shine inline-flex rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] transition duration-500 ease-out hover:bg-[#52E7FF]"
                    >
                      Find My Perfect Gift ✨
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              <div className="hidden md:block">
                <OrbitGraphic size={190} />
              </div>
            </div>
          </motion.section>

          {/* Counters */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease }}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-[#103F69] bg-[#071D3A] px-4 py-4 text-center transition-colors duration-500 hover:border-[#22D3EE]/60"
              >
                <div className="text-2xl font-bold text-white sm:text-3xl">
                  <AnimatedNumber value={stat.value} decimals={stat.decimals || 0} suffix={stat.suffix || ""} />
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#819BB5] sm:text-xs">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <section className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={selectedCategory}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease }}
                  className="text-xl font-bold"
                >
                  {selectedCategory === "All Gifts" ? "Browse Gifts" : selectedCategory}
                </motion.h2>
              </AnimatePresence>

              <p className="mt-1 text-sm text-[#9BB5D0]">
                <span className="font-semibold text-[#22D3EE]">
                  <AnimatedNumber value={filteredGifts.length} />
                </span>{" "}
                gifts found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7893AD] transition-colors duration-500 group-focus-within:text-[#22D3EE]">
                  ⌕
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search gifts..."
                  className="w-full rounded-lg border border-[#103F69] bg-[#071D3A] py-3 pl-9 pr-4 text-sm text-white outline-none transition-all duration-500 placeholder:text-[#7893AD] focus:border-[#22D3EE] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] sm:w-64 sm:focus:w-80"
                />
              </div>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-lg border border-[#103F69] bg-[#071D3A] px-4 py-3 text-sm text-white outline-none transition duration-500 focus:border-[#22D3EE]"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </section>

          {/* Category chips with a sliding highlight */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-3 pt-1">
            {categories.map((category, i) => {
              const active = selectedCategory === category;

              return (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => chooseCategory(category)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors duration-500 ease-out ${
                    active
                      ? "border-[#22D3EE]"
                      : "border-[#103F69] bg-[#071D3A] text-[#C7D8E9] hover:border-[#22D3EE] hover:text-[#22D3EE]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="gift-chip"
                      className="absolute inset-0 rounded-full bg-[#22D3EE] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? "font-semibold text-[#001329]" : ""}`}>
                    {category}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Grid */}
          {filteredGifts.length > 0 ? (
            <>
              <div
                key={`${selectedCategory}-${sort}`}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              >
                {visibleGifts.map((gift, i) => (
                  <div
                    key={gift.id}
                    className="fx-card-in"
                    style={{ animationDelay: `${(i % 6) * 60}ms` }}
                  >
                    <TiltCard radius="rounded-[11px]" max={7}>
                      <GiftCard gift={gift} />
                    </TiltCard>
                  </div>
                ))}
              </div>

              <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-3 pb-4">
                <p className="text-xs text-[#819BB5]">
                  Showing {visibleGifts.length} of {filteredGifts.length} gifts
                </p>

                {visibleCount < filteredGifts.length && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="btn-shine rounded-lg border border-[#22D3EE]/60 px-6 py-2.5 text-sm font-semibold text-[#22D3EE] transition duration-500 hover:bg-[#22D3EE]/10"
                  >
                    Load more gifts
                  </button>
                )}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease }}
              className="flex flex-col items-center rounded-2xl border border-[#103F69] bg-[#071D3A] px-5 py-14 text-center"
            >
              <OrbitGraphic size={150} />
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
                className="btn-shine mt-5 rounded-lg bg-[#22D3EE] px-5 py-3 text-sm font-bold text-[#001329] transition duration-500 hover:bg-[#52E7FF]"
              >
                Show All Gifts
              </button>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Gifts;
