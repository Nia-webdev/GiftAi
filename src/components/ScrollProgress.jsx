import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

// Thin progress line at the top + animated back-to-top button.
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[300] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400"
        style={{ scaleX }}
      />

      <AnimatePresence>
        {show && (
          <motion.button
            key="to-top"
            type="button"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-[250] grid h-12 w-12 place-items-center rounded-full border border-cyan-400/50 bg-[#061A3A]/90 text-lg text-cyan-300 shadow-[0_10px_30px_-10px_rgba(34,211,238,0.6)] backdrop-blur"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default ScrollProgress;
