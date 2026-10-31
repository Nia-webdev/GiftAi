
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  Phone,
  X,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState("");

  const contactOptions = [
    {
      title: "WhatsApp",
      description: "Chat with us on WhatsApp",
      value: "+92 336 4217364",
      href: "https://wa.me/923364217364",
      icon: MessageCircle,
    },
    {
      title: "Email",
      description: "Send us your questions",
      value: "fizirana9@gmail.com",
      href: "mailto:fizirana9@gmail.com",
      icon: Mail,
    },
    {
      title: "Phone",
      description: "Call us directly",
      value: "03364217364",
      href: "tel:+923364217364",
      icon: Phone,
    },
  ];

  function handleSubscribe(event) {
    event.preventDefault();

    if (!email.trim()) return;

    // Demo only: no email is sent or stored on a server.
    setSubscribedEmail(email.trim());
    setEmail("");
  }

  return (
    <>
      <footer className="border-t border-cyan-400/20 bg-[#031329] text-gray-300">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-white"
            >
              <span className="text-3xl">🎁</span>
              Gift<span className="text-cyan-400">AI</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
              Thoughtful gifts, personalized recommendations, and happier
              moments — all in one place.
            </p>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400 hover:text-[#031329]"
            >
              Contact Us
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link className="transition hover:text-cyan-300" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-cyan-300" to="/gifts">
                  Explore Gifts
                </Link>
              </li>
              <li>
                <Link
                  className="transition hover:text-cyan-300"
                  to="/ai-recommendation"
                >
                  AI Recommendation
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-cyan-300" to="/orders">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="text-left transition hover:text-cyan-300"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <a
                  href="mailto:fizirana9@gmail.com"
                  className="transition hover:text-cyan-300"
                >
                  Email Support
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/923364217364"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-cyan-300"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Stay Connected
            </h3>

            <p className="mb-4 text-sm leading-6 text-gray-400">
              Subscribe for a demo confirmation and stay connected with GiftAI.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="footer-email" className="sr-only">
                Your email address
              </label>

              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscribedEmail("");
                }}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-cyan-400/20 bg-[#020d20] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-bold text-[#031329] transition hover:bg-cyan-300"
              >
                Subscribe
              </button>
            </form>

            {subscribedEmail && (
              <p
                role="status"
                className="mt-3 flex items-start gap-2 text-sm leading-5 text-green-300"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                Demo confirmation! {subscribedEmail} has been accepted for this
                demo only.
              </p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Demo only — your email is not sent or saved to a server.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} GiftAI. All rights reserved.
        </div>
      </footer>

      {/* Contact Us popup */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setIsContactOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-popup-title"
            className="relative w-full max-w-md rounded-2xl border border-cyan-400/30 bg-[#031329] p-6 shadow-2xl shadow-cyan-950/40 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close contact popup"
              onClick={() => setIsContactOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6 pr-8">
              <p className="mb-2 text-sm font-semibold text-cyan-300">
                WE ARE HERE TO HELP
              </p>
              <h2
                id="contact-popup-title"
                className="text-2xl font-bold text-white"
              >
                Contact GiftAI
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Choose how you would like to contact us.
              </p>
            </div>

            <div className="space-y-3">
              {contactOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <a
                    key={option.title}
                    href={option.href}
                    target={
                      option.title === "WhatsApp" ? "_blank" : undefined
                    }
                    rel={
                      option.title === "WhatsApp" ? "noreferrer" : undefined
                    }
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#020d20] p-4 transition hover:border-cyan-400/60 hover:bg-cyan-400/5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                      <Icon size={21} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-400">
                        {option.description}
                      </span>
                      <span className="mt-1 block break-words text-sm text-cyan-300">
                        {option.value}
                      </span>
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="shrink-0 text-gray-500"
                    />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsContactOpen(false)}
              className="mt-6 w-full rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default Footer;
