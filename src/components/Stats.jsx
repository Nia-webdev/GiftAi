import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "./Reveal";

function Count({ to, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let frame;
    let start;

    const step = (time) => {
      start ??= time;
      const progress = Math.min((time - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const stats = [
  { to: 755, suffix: "+", label: "Curated gifts" },
  { to: 8, suffix: "", label: "Occasions" },
  { to: 3, suffix: "", label: "Payment methods" },
  { to: 100, suffix: "%", label: "Secure checkout" },
];

function Stats() {
  return (
    <Reveal className="mx-[15px] my-[25px]">
      <div className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-[#103F69] bg-[#061A32] md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="group border-b border-r border-[#103F69]/70 px-5 py-7 transition-colors duration-500 ease-out hover:bg-[#071D3A] md:border-b-0"
          >
            <div className="text-4xl font-bold text-white transition-colors duration-500 group-hover:text-[#22D3EE] sm:text-5xl">
              <Count to={item.to} suffix={item.suffix} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#819BB5]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default Stats;
