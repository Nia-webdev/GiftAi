
import { Link } from "react-router-dom";

function Footer() {
  const linkStyle =
    "w-fit text-xs text-[#94ABC1] transition-all duration-300 hover:text-[#22D3EE] hover:translate-x-1";

  const socialStyle =
    "text-xs text-[#22D3EE] transition-all duration-300 hover:text-white hover:-translate-y-1";

  return (
    <footer className="border-t border-[#12334F] bg-[#031329] px-[5%] py-8 text-[#94ABC1] sm:px-[9%]">
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">

        {/* BRAND */}
        <div>
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-xl font-bold text-white transition-colors duration-300 hover:text-[#22D3EE]"
          >
            🎁 Gift<span className="text-[#22D3EE]">AI</span>
          </Link>

          <p className="mt-3 max-w-[260px] text-xs leading-5">
            Discover thoughtful gifts and make every special moment memorable.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={socialStyle}
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={socialStyle}
            >
              Instagram
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">
            Quick Links
          </h3>

          <div className="flex flex-col items-start gap-2">
            <Link className={linkStyle} to="/">
              Home
            </Link>

            <Link className={linkStyle} to="/gifts">
              Explore Gifts
            </Link>

            <Link className={linkStyle} to="/ai-recommendation">
              AI Recommendation
            </Link>
          </div>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">
            Customer Service
          </h3>

          <div className="flex flex-col items-start gap-2">
            <Link className={linkStyle} to="/orders">
              Track Orders
            </Link>

            <Link className={linkStyle} to="/cart">
              Shopping Cart
            </Link>

            <a
              className={linkStyle}
              href="mailto:support@giftai.com"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">
            Stay Connected
          </h3>

          <p className="mb-3 text-xs">
            Get updates about gifts and special occasions.
          </p>

          <form
            className="flex max-w-[280px]"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              aria-label="Your email"
              className="min-w-0 flex-1 rounded-l-md border border-[#254B6C] bg-[#102B48] px-3 py-2 text-xs text-white outline-none transition-colors duration-300 placeholder:text-[#8199B2] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]"
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="rounded-r-md bg-[#22D3EE] px-3 text-xs font-bold text-[#001329] transition-all duration-300 hover:bg-white"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-7 flex flex-col gap-2 border-t border-[#12334F] pt-3 text-[10px] text-[#607991] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} GiftAI. All rights reserved.</p>

        <p className="transition-colors duration-300 hover:text-[#22D3EE]">
          Made to make gifting easier.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
