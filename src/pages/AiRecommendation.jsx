import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GiftCard from "../components/GiftCard";
import gifts from "../data/gifts";

/* ------------------------------------------------------------------ */
/*  Options                                                            */
/* ------------------------------------------------------------------ */

const occasions = [
  "Birthday",
  "Anniversary",
  "Graduation",
  "Wedding",
  "Valentine's",
  "Mother's Day",
  "Father's Day",
  "Custom Gifts",
];

const budgets = [
  { label: "Any Budget", value: "all" },
  { label: "Under Rs. 2,000", value: "2000" },
  { label: "Rs. 2,000 – 5,000", value: "5000" },
  { label: "Rs. 5,000 – 10,000", value: "10000" },
  { label: "Above Rs. 10,000", value: "above" },
];

const recipients = [
  "Anyone",
  "Mother",
  "Father",
  "Friend",
  "Partner",
  "Brother",
  "Sister",
  "Colleague",
];

const preferences = [
  "Any Type",
  "Flowers",
  "Technology",
  "Personalized",
  "Gift Hampers",
  "Jewelry",
  "Fashion",
];

/* ------------------------------------------------------------------ */
/*  Recommendation engine settings                                     */
/* ------------------------------------------------------------------ */

// gifts.js ki prices dollars mein hain to 280 rakho (apna rate laga lo).
// Agar gifts.js ki prices PKR mein kar do to isko 1 kar dena.
const PKR_PER_USD = 280;

// Budget ranges (PKR)
const budgetRanges = {
  all: [0, Infinity],
  "2000": [0, 2000],
  "5000": [2000, 5000],
  "10000": [5000, 10000],
  above: [10000, Infinity],
};

// Recipient ke hisaab se gift name/category mein dhoondne wale keywords
const recipientKeywords = {
  Mother: ["mother", "mom", "jewel", "necklace", "flower", "bouquet", "perfume", "bag", "scarf", "spa"],
  Father: ["father", "dad", "watch", "wallet", "tie", "cufflink", "shaving", "leather", "belt"],
  Friend: ["friend", "mug", "frame", "hamper", "speaker", "game", "friendship"],
  Partner: ["love", "romantic", "couple", "heart", "rose", "ring", "valentine", "anniversary"],
  Brother: ["brother", "watch", "wallet", "sneaker", "headphone", "speaker", "tech"],
  Sister: ["sister", "jewel", "bracelet", "bag", "makeup", "perfume", "scarf"],
  Colleague: ["desk", "planner", "pen", "notebook", "organizer", "mug", "office"],
};

// Gift type ke keywords
const preferenceKeywords = {
  Flowers: ["flower", "bouquet", "rose", "tulip", "lily", "orchid"],
  Technology: ["watch", "speaker", "headphone", "earbud", "charger", "power bank", "smart", "camera", "tech", "gadget"],
  Personalized: ["personalized", "personalised", "custom", "engraved", "photo", "monogram", "name"],
  "Gift Hampers": ["hamper", "basket", "box", "set"],
  Jewelry: ["jewel", "necklace", "ring", "bracelet", "earring", "pendant"],
  Fashion: ["bag", "wallet", "scarf", "sunglass", "perfume", "shirt", "tie", "watch"],
};

// "Valentine's" / "Valentines" / "Mother's Day" ko same tarah compare karne ke liye
const normalize = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9]/g, "");

const hasKeyword = (text, words = []) =>
  words.some((word) => text.includes(word));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function AIRecommendation() {
  const [occasion, setOccasion] = useState("Birthday");
  const [recipient, setRecipient] = useState("Anyone");
  const [budget, setBudget] = useState("all");
  const [preference, setPreference] = useState("Any Type");
  const [submitted, setSubmitted] = useState(false);

  const recommendations = useMemo(() => {
    if (!submitted) return [];

    const [min, max] = budgetRanges[budget];

    // 1. Pehle occasion match karo (agar us occasion ke gifts hain)
    const occasionKey = normalize(occasion);
    const occasionPool = gifts.filter((gift) =>
      normalize(`${gift.category} ${gift.name}`).includes(occasionKey),
    );
    const pool = occasionPool.length > 0 ? occasionPool : gifts;

    // 2. Har gift ko score do
    const scored = pool.map((gift) => {
      const text = `${gift.name || ""} ${gift.category || ""}`.toLowerCase();
      const pricePKR = (Number(gift.price) || 0) * PKR_PER_USD;
      let score = 0;

      // Budget (sab se zyada weight)
      const inBudget = pricePKR >= min && pricePKR <= max;
      if (inBudget) {
        score += 50;
      } else {
        const gap = pricePKR < min ? min - pricePKR : pricePKR - max;
        const reference = max === Infinity ? min : max;
        score += Math.max(0, 50 - (gap / reference) * 100);
      }

      // Gift type
      if (
        preference !== "Any Type" &&
        hasKeyword(text, preferenceKeywords[preference])
      ) {
        score += 30;
      }

      // Recipient
      if (
        recipient !== "Anyone" &&
        hasKeyword(text, recipientKeywords[recipient])
      ) {
        score += 20;
      }

      // Tie-break: behtar rating wale gifts upar
      score += (Number(gift.rating) || 0) / 5;

      return { ...gift, _score: score, _inBudget: inBudget };
    });

    // 3. Best score wale top 8
    return scored.sort((a, b) => b._score - a._score).slice(0, 8);
  }, [occasion, recipient, budget, preference, submitted]);

  // Agar kuch gifts budget se bahar hain to user ko batao
  const hasOutOfBudget = recommendations.some((gift) => !gift._inBudget);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#020d20] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-8 lg:pb-16 lg:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
            <span>✦</span> GiftAI Smart Assistant
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Find the <span className="text-cyan-400">Perfect Gift</span>
            <br className="hidden sm:block" /> for Every Moment
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Tell us about your special occasion, your recipient and your
            budget. We'll help you discover thoughtful gift ideas.
          </p>
        </div>
      </section>

      {/* Recommendation Form */}
      <section className="px-4 pb-14 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-cyan-400/20 bg-[#07182e] p-5 shadow-2xl shadow-cyan-950/20 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Personalize your search
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Let's find your ideal gift
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Choose the options below to get matching gift suggestions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Occasion */}
            <div>
              <label
                htmlFor="occasion"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                1. What's the occasion?
              </label>

              <select
                id="occasion"
                value={occasion}
                onChange={(event) => setOccasion(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020d20] px-4 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                {occasions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient */}
            <div>
              <label
                htmlFor="recipient"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                2. Who are you buying for?
              </label>

              <select
                id="recipient"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020d20] px-4 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                {recipients.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                3. What's your budget?
              </label>

              <select
                id="budget"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020d20] px-4 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                {budgets.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gift Preference */}
            <div>
              <label
                htmlFor="preference"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                4. What kind of gift do you prefer?
              </label>

              <select
                id="preference"
                value={preference}
                onChange={(event) => setPreference(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#020d20] px-4 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                {preferences.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-[#020d20] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 active:translate-y-0"
            >
              <span>✦</span>
              Get Gift Recommendations
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      {submitted && (
        <section className="px-4 pb-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Your gift matches
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Recommended for you
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Occasion: {occasion} · Recipient: {recipient} · Budget:{" "}
                  {budgets.find((item) => item.value === budget)?.label}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="self-start rounded-lg border border-cyan-400/40 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10 sm:self-auto"
              >
                Change Preferences
              </button>
            </div>

            {recommendations.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-slate-400">
                  {hasOutOfBudget
                    ? "Only a few gifts fit your exact budget, so we're also showing the closest matches."
                    : `Showing ${recommendations.length} matching gift suggestions.`}
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {recommendations.map((gift) => (
                    <GiftCard key={gift.id} gift={gift} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-700 bg-[#07182e] px-5 py-12 text-center">
                <div className="text-5xl">🎁</div>

                <h3 className="mt-4 text-xl font-bold">
                  No exact matches found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Try another budget or gift preference to explore more
                  options from our catalogue.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setBudget("all");
                    setPreference("Any Type");
                    setRecipient("Anyone");
                    setSubmitted(true);
                  }}
                  className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#020d20] transition hover:bg-cyan-300"
                >
                  Show More Options
                </button>
              </div>
            )}

            <div className="mt-12 text-center">
              <p className="text-slate-300">
                Still exploring? Browse our complete gift collection.
              </p>

              <Link
                to="/gifts"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Explore All Gifts <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {!submitted && (
        <section className="px-4 pb-20 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: "🎉",
                title: "Choose an Occasion",
                description:
                  "Select the celebration or special moment you're shopping for.",
              },
              {
                number: "02",
                icon: "💝",
                title: "Set Your Preferences",
                description:
                  "Tell us who the gift is for and how much you want to spend.",
              },
              {
                number: "03",
                icon: "🎁",
                title: "Explore Gift Ideas",
                description:
                  "Discover matching items from the GiftAI gift catalogue.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-800 bg-[#07182e] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default AIRecommendation;
