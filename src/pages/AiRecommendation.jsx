import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GiftCard from "../components/GiftCard";
import AnimatedBackdrop from "../components/AnimatedBackdrop";
import OrbitGraphic from "../components/OrbitGraphic";
import ScrollProgress from "../components/ScrollProgress";
import SplitText from "../components/SplitText";
import TiltCard from "../components/TiltCard";
import gifts from "../data/gifts";

const ease = [0.22, 1, 0.36, 1];

const thinkingSteps = [
  "Understanding your occasion…",
  "Matching your budget…",
  "Scoring every gift in the catalogue…",
  "Picking your best matches…",
];

// Pill selector with a sliding highlight
function ChipGroup({ name, options, value, onChange }) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        const active = value === optionValue;

        return (
          <motion.button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(optionValue)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            className={`relative rounded-full border px-4 py-2.5 text-sm transition-colors duration-500 ${
              active
                ? "border-cyan-400 text-[#020d20]"
                : "border-slate-700 text-slate-300 hover:border-cyan-400/60 hover:text-cyan-300"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`chip-${name}`}
                className="absolute inset-0 rounded-full bg-cyan-400 shadow-[0_8px_24px_-8px_rgba(34,211,238,0.8)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className={`relative z-10 ${active ? "font-semibold" : ""}`}>{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

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
  { label: "Under $25", value: "25" },
  { label: "$25 – $50", value: "50" },
  { label: "$50 – $100", value: "100" },
  { label: "Above $100", value: "above" },
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

// Budget ranges (USD, gifts.js ki prices dollars mein hain)
const budgetRanges = {
  all: [0, Infinity],
  "25": [0, 25],
  "50": [25, 50],
  "100": [50, 100],
  above: [100, Infinity],
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
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState({});
  const resultsRef = useRef(null);

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
      const price = Number(gift.price) || 0;
      let score = 0;

             // Budget (sab se zyada weight)
        const inBudget = price >= min && price <= max;
    if (inBudget) {
          score += 50;
      } else {
         const gap = price < min ? min - price : price - max;
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

  const pick = (key, setter) => (value) => {
    setter(value);
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const questions = [
    { key: "occasion", name: "occasion", label: "1. What's the occasion?", options: occasions, value: occasion, onChange: pick("occasion", setOccasion) },
    { key: "recipient", name: "recipient", label: "2. Who are you buying for?", options: recipients, value: recipient, onChange: pick("recipient", setRecipient) },
    { key: "budget", name: "budget", label: "3. What's your budget?", options: budgets, value: budget, onChange: pick("budget", setBudget) },
    { key: "preference", name: "preference", label: "4. What kind of gift do you prefer?", options: preferences, value: preference, onChange: pick("preference", setPreference) },
  ];

  const progress = Object.keys(touched).length / questions.length;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;

    setSubmitted(false);
    setLoading(true);
    setStepIndex(0);

    thinkingSteps.forEach((_, index) => {
      setTimeout(() => setStepIndex(index), index * 550);
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        200,
      );
    }, thinkingSteps.length * 550 + 150);
  };

  return (
    <div className="relative min-h-screen bg-[#020d20] text-white">
      <AnimatedBackdrop />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-8 lg:pb-16 lg:pt-16">
          <div className="relative mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease }}
              className="mx-auto mb-4 w-fit"
            >
              <OrbitGraphic icon="✦" size={120} />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300"
            >
              <span className="fx-pulse">✦</span> GiftAI Smart Assistant
            </motion.span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              <SplitText
                delay={0.35}
                segments={[
                  { text: "Find the " },
                  { text: "Perfect Gift", className: "text-shimmer" },
                  { br: true, text: "" },
                  { text: " for Every Moment" },
                ]}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8, ease }}
              className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base"
            >
              Tell us about your special occasion, your recipient and your
              budget. We'll help you discover thoughtful gift ideas.
            </motion.p>
          </div>
        </section>

        {/* Recommendation Form */}
        <section className="px-4 pb-14 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease }}
            className="glow-border mx-auto max-w-4xl rounded-3xl border border-cyan-400/20 bg-[#07182e] p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10"
          >
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

              <div className="mt-5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                    animate={{ width: `${Math.max(progress, 0.04) * 100}%` }}
                    transition={{ duration: 0.6, ease }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {Object.keys(touched).length}/{questions.length} chosen
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question, index) => (
                <motion.div
                  key={question.key}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: index * 0.05, ease }}
                >
                  <p className="mb-3 text-sm font-semibold text-slate-200">{question.label}</p>
                  <ChipGroup
                    name={question.name}
                    options={question.options}
                    value={question.value}
                    onChange={question.onChange}
                  />
                </motion.div>
              ))}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 font-bold text-[#020d20] shadow-[0_14px_40px_-14px_rgba(34,211,238,0.7)] transition-colors duration-500 ease-out hover:bg-cyan-300"
              >
                <span>✦</span>
                Get Gift Recommendations
              </motion.button>
            </form>
          </motion.div>
        </section>

        {/* Results */}
        <div ref={resultsRef} className="scroll-mt-24" />

        {submitted && (
          <section className="px-4 pb-20 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Your gift matches
                  </p>

                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Recommended <span className="accent">for you</span>
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Occasion: {occasion} · Recipient: {recipient} · Budget:{" "}
                    {budgets.find((item) => item.value === budget)?.label}
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSubmitted(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="self-start rounded-lg border border-cyan-400/40 px-4 py-2 text-sm font-medium text-cyan-300 transition duration-500 ease-out hover:bg-cyan-400/10 sm:self-auto"
                >
                  Change Preferences
                </motion.button>
              </motion.div>

              {recommendations.length > 0 ? (
                <>
                  <p className="mb-6 text-sm text-slate-400">
                    {hasOutOfBudget
                      ? "Only a few gifts fit your exact budget, so we're also showing the closest matches."
                      : `Showing ${recommendations.length} matching gift suggestions.`}
                  </p>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {recommendations.map((gift, index) => (
                      <motion.div
                        key={gift.id}
                        initial={{ opacity: 0, y: 50, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.09, duration: 0.7, ease }}
                        className="relative"
                      >
                        <motion.span
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.09, type: "spring", stiffness: 300, damping: 14 }}
                          className="absolute left-3 top-3 z-20 rounded-full bg-[#061A3A]/90 px-2.5 py-1 text-[10px] font-bold text-cyan-300 ring-1 ring-cyan-400/40"
                        >
                          {Math.max(1, Math.min(99, Math.round(gift._score)))}% match
                        </motion.span>

                        <TiltCard radius="rounded-[11px]" max={7}>
                          <GiftCard gift={gift} />
                        </TiltCard>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center rounded-2xl border border-slate-700 bg-[#07182e] px-5 py-12 text-center"
                >
                  <OrbitGraphic size={140} />

                  <h3 className="mt-4 text-xl font-bold">No exact matches found</h3>

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
                    className="btn-shine mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#020d20] transition duration-500 ease-out hover:bg-cyan-300"
                  >
                    Show More Options
                  </button>
                </motion.div>
              )}

              <div className="mt-12 text-center">
                <p className="text-slate-300">
                  Still exploring? Browse our complete gift collection.
                </p>

                <Link
                  to="/gifts"
                  className="group mt-4 inline-flex items-center gap-2 font-semibold text-cyan-400 transition duration-500 ease-out hover:text-cyan-300"
                >
                  Explore All Gifts{" "}
                  <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
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
                { number: "01", icon: "🎉", title: "Choose an Occasion", description: "Select the celebration or special moment you're shopping for." },
                { number: "02", icon: "💝", title: "Set Your Preferences", description: "Tell us who the gift is for and how much you want to spend." },
                { number: "03", icon: "🎁", title: "Explore Gift Ideas", description: "Discover matching items from the GiftAI gift catalogue." },
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease }}
                >
                  <TiltCard className="h-full" max={6}>
                    <div className="h-full rounded-2xl border border-slate-800 bg-[#07182e]/90 p-6 transition duration-500 ease-out hover:border-cyan-400/50">
                      <div className="flex items-center justify-between">
                        <span className="fx-float inline-block text-3xl" style={{ animationDelay: `${index * 0.6}s` }}>
                          {step.icon}
                        </span>
                        <span className="text-sm font-bold text-cyan-400">{step.number}</span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold">{step.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <Footer />
      </div>

      {/* Thinking overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[400] grid place-items-center bg-[#020d20]/90 px-6 backdrop-blur-md"
          >
            <div className="flex flex-col items-center text-center">
              <OrbitGraphic icon="✦" size={170} />

              <div className="mt-6 h-7">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stepIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="text-base font-medium text-cyan-300"
                  >
                    {thinkingSteps[stepIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-5 h-1.5 w-64 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: thinkingSteps.length * 0.55, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIRecommendation;
