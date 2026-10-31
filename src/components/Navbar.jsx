
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", to: "/" },
  { label: "Gifts", to: "/gifts" },
  { label: "AI Recommendation", to: "/ai-recommendation" },
  { label: "Orders", to: "/orders" },
];

function getLoggedInUser() {
  try {
   const keys = [
  "giftai-current-user",
  "giftai-user",
  "giftaiUser",
  "currentUser",
  "loggedInUser",
  "user",
];

    for (const key of keys) {
      const saved = localStorage.getItem(key);
      if (!saved) continue;

      const user = JSON.parse(saved);

      if (user && typeof user === "object" &&
          (user.name || user.fullName || user.username || user.email)) {
        return user;
      }
    }
  } catch (error) {
    console.error("Unable to read user:", error);
  }

  return null;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getLoggedInUser);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => setUser(getLoggedInUser());

    window.addEventListener("storage", updateUser);
    window.addEventListener("giftai-auth-change", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("giftai-auth-change", updateUser);
    };
  }, []);

  function handleLogout() {
  [
    "giftai-current-user",
    "giftai-user",
    "giftaiUser",
    "currentUser",
    "loggedInUser",
    "user",
  ].forEach((key) => localStorage.removeItem(key));

  setUser(null);
  setMenuOpen(false);

  window.dispatchEvent(new Event("giftai-auth-change"));

  navigate("/login");
}

  const username =
    user?.name || user?.fullName || user?.username || user?.email;

  return (
    <nav className="sticky top-0 z-[100] flex min-h-[70px] items-center justify-between gap-3 border-b border-[#0B5A9A] bg-[#031329] px-5 py-3 text-white">
      <Link to="/" className="flex shrink-0 items-center gap-2 text-[22px] font-bold sm:text-[25px]">
        <span className="text-[28px] sm:text-[32px]">🎁</span>
        <span>Gift<span className="text-[#22D3EE]">AI</span></span>
      </Link>

      <motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
  className="hidden items-center gap-[clamp(12px,2.5vw,38px)] md:flex"
>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `hv-link text-sm transition duration-500 ease-out hover:text-[#08D9FF] ${
                isActive ? "text-[#08D9FF]" : "text-[#D6DFED]"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </motion.div>

      <div className="flex items-center gap-3">
        <Link to="/gifts" aria-label="Search gifts" className="text-xl hover:text-[#08D9FF]">
          ⌕
        </Link>

        <Link to="/cart" aria-label="Shopping cart" className="text-xl hover:text-[#08D9FF]">
          🛒
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[120px] truncate text-sm text-[#22D3EE] sm:inline">
              Hi, {username}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[#08D9FF]/50 px-3 py-2 text-sm transition duration-500 ease-out hover:bg-[#08D9FF]/10"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            aria-label="Login"
            className="rounded-lg border border-[#08D9FF]/50 px-3 py-2 text-sm transition duration-500 ease-out hover:bg-[#08D9FF]/10"
          >
            Login
          </Link>
        )}

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-2xl md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full border-b border-[#0B5A9A] bg-[#031329] px-5 pb-4 pt-2 shadow-lg md:hidden"
    >
      {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 text-[15px] ${
                  isActive
                    ? "bg-[#08D9FF]/10 text-[#08D9FF]"
                    : "text-[#D6DFED] hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
    </motion.div>
  )}
</AnimatePresence>
 

          {user && (
            <div className="mt-2 border-t border-white/10 pt-3">
              <p className="mb-3 text-sm text-[#22D3EE]">{username}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[#08D9FF]/50 px-3 py-2 text-sm"
              >
                Logout
              </button>
            </div>
          )}
      
  </nav>
  )}


export default Navbar;
