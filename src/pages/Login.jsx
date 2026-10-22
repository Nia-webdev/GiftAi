
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    const savedUsers = JSON.parse(
      localStorage.getItem("giftai-users") || "[]"
    );

    const user = savedUsers.find(
      (item) =>
        item.email.toLowerCase() === form.email.trim().toLowerCase() &&
        item.password === form.password
    );

    if (!user) {
      setError("Invalid email or password. Please register first.");
      return;
    }

    localStorage.setItem(
      "giftai-current-user",
      JSON.stringify({
        name: user.name,
        email: user.email,
      })
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#020D20] text-white">
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-2xl border border-[#164E82] bg-[#071D3A] p-6 shadow-xl sm:p-8">
          <div className="mb-6 text-center">
            <div className="text-5xl">🎁</div>

            <h1 className="mt-4 text-3xl font-bold">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-[#9BB5D0]">
              Login to continue your GiftAI journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="flex rounded-lg border border-[#164E82] bg-[#020D20] focus-within:border-[#22D3EE]">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-sm text-[#22D3EE]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

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
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9BB5D0]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#22D3EE] hover:text-white"
            >
              Register
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

export default Login;
