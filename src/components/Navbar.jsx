
import { Link, NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Gifts", to: "/gifts" },
  { label: "AI Recommendation", to: "/ai-recommendation" },
  { label: "Orders", to: "/orders" },
];

function Navbar() {
  return (
    
<nav className="sticky top-0 z-[100] flex h-[70px] items-center justify-between border-b border-[#063F70] bg-[#031329] px-[20px] py-[10px]">

      <Link to="/" className="flex items-center gap-2 text-[22px] font-bold sm:text-[25px]">
        <span className="text-[28px] sm:text-[32px]">🎁</span>
        <span>
          Gift<span className="text-[#22D3EE]">AI</span>
        </span>
      </Link>

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
      </div>
    </nav>
  );
}

export default Navbar;
