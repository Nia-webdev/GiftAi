import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

// Number that counts smoothly whenever its value changes.
function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(Number(value) || 0);
  }, [value, motionValue]);

  useEffect(() => spring.on("change", (v) => setDisplay(v)), [spring]);

  return (
    <>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </>
  );
}

export default AnimatedNumber;
