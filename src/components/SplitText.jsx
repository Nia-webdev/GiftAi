import { motion } from "framer-motion";

// Letter by letter reveal with blur. segments = [{ text, className?, br? }]
function SplitText({ segments, delay = 0, stagger = 0.03, className = "" }) {
  let index = 0;
  const label = segments.map((s) => s.text || " ").join("");

  return (
    <span className={className} aria-label={label}>
      {segments.map((seg, si) => {
        if (seg.br) return <br key={`br-${si}`} className="hidden sm:block" />;

        return seg.text.split(/(\s+)/).map((word, wi) => {
          if (word === "") return null;
          if (/^\s+$/.test(word)) return " ";

          return (
            <span
              key={`${si}-${wi}`}
              aria-hidden="true"
              className={`inline-block whitespace-nowrap ${seg.className || ""}`}
            >
              {[...word].map((char, ci) => (
                <motion.span
                  key={ci}
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.7em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: delay + index++ * stagger,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          );
        });
      })}
    </span>
  );
}

export default SplitText;
