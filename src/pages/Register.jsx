
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const savedUsers = JSON.parse(
      localStorage.getItem("giftai-users") || "[]"
    );

    const email = form.email.trim().toLowerCase();

    const existingUser = savedUsers.some(
      (user) => user.email.toLowerCase() === email
    );

    if (existingUser) {
      setError("This email is already registered. Please login.");
      return;
    }

    const newUser = {
      name: form.name.trim(),
      email,
      password: form.password,
    };

    localStorage.setItem(
      "giftai-users",
      JSON.stringify([...savedUsers, newUser])
    );

    navigate("/login", {
      state: { registered: true },
    });
  };

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-2xl border border-[#164E82] bg-[#071D3A] p-6 shadow-xl sm:p-8">
          <div className="mb-6 text-center">
            <div className="text-5xl">🎁</div>

            <h1 className="mt-4 text-3xl font-bold">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-[#9BB5D0]">
              Join GiftAI and discover thoughtful gifts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-[#164E82] bg-[#020D20] px-4 py-3 outline-none focus:border-[#22D3EE]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-[#164E82] bg-[#020D20] px-4 py-3 outline-none focus:border-[#22D3EE]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="w-full rounded-lg border border-[#164E82] bg-[#020D20] px-4 py-3 outline-none focus:border-[#22D3EE]"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter password again"
                required
                className="w-full rounded-lg border border-[#164E82] bg-[#020D20] px-4 py-3 outline-none focus:border-[#22D3EE]"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#9BB5D0]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) =>
                  setShowPassword(event.target.checked)
                }
                className="accent-cyan-400"
              />
              Show passwords
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-[#22D3EE] px-5 py-3 font-bold text-[#001329] transition hover:bg-[#52E7FF]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9BB5D0]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#22D3EE] hover:text-white"
            >
              Login
            </Link>
          </p>

          <Link
            to="/gifts"
            className="mt-5 block text-center text-sm text-[#9BB5D0] hover:text-[#22D3EE]"
          >
            ← Continue browsing gifts
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
