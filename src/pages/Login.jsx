import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { AuthButton, AuthError, AuthField } from "../components/AuthParts";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

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

    setStatus("loading");

    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem("giftai-users") || "[]");

      const user = savedUsers.find(
        (item) =>
          item.email.toLowerCase() === form.email.trim().toLowerCase() &&
          item.password === form.password
      );

      if (!user) {
        setStatus("idle");
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
      window.dispatchEvent(new Event("giftai-auth-change"));

      setStatus("success");
      setTimeout(() => navigate("/"), 700);
    }, 800);
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Login to continue your GiftAI journey."
      footer={
        <>
          <p className="mt-6 text-center text-sm text-[#9BB5D0]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="hv-link font-semibold text-[#22D3EE] transition duration-500 hover:text-white"
            >
              Register
            </Link>
          </p>

          <Link
            to="/gifts"
            className="group mt-5 block text-center text-sm text-[#9BB5D0] transition duration-500 hover:text-[#22D3EE]"
          >
            <span className="inline-block transition-transform duration-500 group-hover:-translate-x-1">←</span>{" "}
            Continue browsing gifts
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {location.state?.registered && (
          <motion.p
            role="status"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-300"
          >
            Account created successfully! Please login to continue. 🎉
          </motion.p>
        )}

        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          icon={Mail}
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <AuthField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          icon={Lock}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          right={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="px-4 text-[#5F7FA3] transition-colors duration-500 hover:text-[#22D3EE]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <AuthError message={error} />

        <AuthButton status={status} loadingText="Signing in…" successText="Welcome back!">
          Login
        </AuthButton>
      </form>
    </AuthShell>
  );
}

export default Login;
