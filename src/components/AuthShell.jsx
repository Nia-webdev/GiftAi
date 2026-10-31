import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedBackdrop from "./AnimatedBackdrop";
import OrbitGraphic from "./OrbitGraphic";
import TypeWords from "./TypeWords";

const ease = [0.22, 1, 0.36, 1];
const words = ["with AI.", "for Birthdays.", "for Weddings.", "for Anniversaries."];
const perks = [
  { icon: "🎁", text: "755+ curated gifts for every occasion" },
  { icon: "🤖", text: "Smart AI gift recommendations" },
  { icon: "🚚", text: "Fast delivery and secure payment" },
];

// Shared two-panel layout for Login and Register.
function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen bg-[#020D20] text-white">
      <AnimatedBackdrop />

      <div className="relative z-10">
        <Navbar />

        <main className="flex min-h-[78vh] items-center justify-center px-4 py-10 sm:px-6">
          <motion.section
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease }}
            className="glow-border grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#164E82] bg-[#071D3A] shadow-2xl shadow-cyan-950/40 lg:grid-cols-[1.05fr_1fr]"
          >
            {/* Promo panel */}
            <div className="banner-flow relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/15" />

              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-[#22D3EE]">
                  GIFTAI
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight">
                  Find the perfect gift <br />
                  <TypeWords words={words} />
                </h2>
              </div>

              <div className="my-8 flex justify-center">
                <OrbitGraphic size={200} />
              </div>

              <ul className="space-y-3">
                {perks.map((perk, index) => (
                  <motion.li
                    key={perk.text}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.15, duration: 0.7, ease }}
                    className="flex items-center gap-3 rounded-xl border border-[#164E82] bg-[#020D20]/40 px-4 py-3 text-sm text-[#C7D8E9]"
                  >
                    <span className="text-lg">{perk.icon}</span>
                    {perk.text}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Form panel */}
            <div className="p-6 sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7, ease }}
                className="mb-7 text-center lg:text-left"
              >
                <div className="fx-float inline-block text-5xl lg:hidden">🎁</div>
                <h1 className="mt-3 text-3xl font-bold lg:mt-0">{title}</h1>
                <p className="mt-2 text-sm text-[#9BB5D0]">{subtitle}</p>
              </motion.div>

              {children}

              {footer}
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AuthShell;
