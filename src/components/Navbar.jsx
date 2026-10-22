import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Gifts", to: "/gifts" },
  { label: "AI Recommendation", to: "/ai-recommendation" },
  { label: "Orders", to: "/orders" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[100] flex h-[70px] items-center justify-between border-b border-[#0B5A9A] bg-[#031329] px-[20px] py-[10px]">
      <Link
        to="/"
        className="flex items-center gap-2 text-[22px] font-bold sm:text-[25px]"
      >
        <span className="text-[28px] sm:text-[32px]">🎁</span>
        <span>
          Gift<span className="text-[#22D3EE]">AI</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden items-center gap-[clamp(12px,2.5vw,38px)] md:flex">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `relative text-[14px] transition hover:text-[#08D9FF] ${
                isActive
                  ? "text-[#08D9FF] after:absolute after:-bottom-[26px] after:left-1/2 after:h-[2px] after:w-8 after:-translate-x-1/2 after:bg-[#08D9FF] after:content-['']"
                  : "text-[#D6DFED]"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3 sm:gap-[15px]">
        <Link
          to="/gifts"
          aria-label="Search gifts"
          className="text-xl text-white transition hover:text-[#08D9FF]"
        >
          ⌕
        </Link>
        <Link
          to="/cart"
          aria-label="Shopping cart"
          className="text-xl text-white transition hover:text-[#08D9FF]"
        >
          🛒
        </Link>
        <Link
          to="/login"
          aria-label="Account"
          className="text-xl text-white transition hover:text-[#08D9FF]"
        >
          ♙
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-2xl leading-none text-white transition hover:text-[#08D9FF] md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-[#0B5A9A] bg-[#031329] px-5 pb-4 pt-2 shadow-lg shadow-black/40 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 text-[15px] transition ${
                  isActive
                    ? "bg-[#08D9FF]/10 text-[#08D9FF]"
                    : "text-[#D6DFED] hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;