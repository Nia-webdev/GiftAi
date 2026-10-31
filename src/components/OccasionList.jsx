import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

// Numbered rows. On hover the title glides right and a photo follows the cursor.
function OccasionList({ items }) {
  const box = useRef(null);
  const [active, setActive] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    const rect = box.current.getBoundingClientRect();
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <Reveal className="mx-[15px] my-[25px]">
      <p className="mb-[5px] text-xs tracking-[0.2em] text-[#22D3EE]">02 · OCCASIONS</p>
      <h2 className="mb-6 text-2xl font-bold text-white sm:text-4xl">
        Gifts for every <span className="accent">occasion</span>
      </h2>

      <ul
        ref={box}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(null)}
        className="relative border-t border-[#103F69]"
      >
        {items.map((item, index) => (
          <li key={item.name} onMouseEnter={() => setActive(index)}>
            <Link
              to={`/gifts?category=${encodeURIComponent(item.name)}`}
              className="group flex items-center gap-4 border-b border-[#103F69] px-2 py-5 transition-colors duration-500 ease-out hover:bg-[#071D3A]/70 sm:gap-8"
            >
              <span className="w-8 text-xs text-[#4F6F92]">0{index + 1}</span>
              <span className="flex-1 text-lg font-semibold text-white transition duration-500 ease-out group-hover:translate-x-3 group-hover:text-[#22D3EE] sm:text-3xl">
                {item.name}
              </span>
              <span className="hidden text-sm text-[#819BB5] md:block">{item.count}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#164E82] transition duration-500 ease-out group-hover:border-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-[#001329]">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </li>
        ))}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 hidden h-40 w-56 overflow-hidden rounded-xl border border-[#22D3EE]/40 shadow-[0_18px_40px_-18px_rgba(34,211,238,0.45)] md:block"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(28px, -50%)",
            opacity: active === null ? 0 : 1,
            transition: "opacity .35s ease-out, left .2s ease-out, top .2s ease-out",
          }}
        >
          {items.map((item, index) => (
            <img
              key={item.name}
              src={item.image}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                active === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </ul>
    </Reveal>
  );
}

export default OccasionList;
