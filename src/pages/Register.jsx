import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { AuthButton, AuthError, AuthField } from "../components/AuthParts";

const strengthLabels = ["Too short", "Weak", "Okay", "Good", "Strong"];
const strengthColors = ["#475569", "#F43F5E", "#F59E0B", "#22D3EE", "#34D399"];

function passwordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

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
  const [status, setStatus] = useState("idle");

  const strength = passwordStrength(form.password);
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

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

    const savedUsers = JSON.parse(localStorage.getItem("giftai-users") || "[]");

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

    setStatus("loading");

    setTimeout(() => {
      localStorage.setItem("giftai-users", JSON.stringify([...savedUsers, newUser]));

      setStatus("success");

      setTimeout(
        () =>
          navigate("/login", {
            state: { registered: true },
          }),
        700
      );
    }, 800);
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join GiftAI and discover thoughtful gifts."
      footer={
        <>
          <p className="mt-6 text-center text-sm text-[#9BB5D0]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="hv-link font-semibold text-[#22D3EE] transition duration-500 hover:text-white"
            >
              Login
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="name"
          name="name"
          type="text"
          label="Full Name"
          icon={User}
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

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

        <div>
          <AuthField
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            icon={Lock}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            minLength={8}
            required
            right={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                className="px-4 text-[#5F7FA3] transition-colors duration-500 hover:text-[#22D3EE]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Strength meter */}
          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex flex-1 gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <motion.span
                  key={step}
                  className="h-1.5 flex-1 rounded-full"
                  animate={{
                    backgroundColor: step <= strength ? strengthColors[strength] : "#10365B",
                  }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>
            <span className="w-16 text-right text-xs" style={{ color: strengthColors[strength] }}>
              {form.password ? strengthLabels[strength] : ""}
            </span>
          </div>
        </div>

        <div>
          <AuthField
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            icon={Lock}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter password again"
            required
          />

          {form.confirmPassword && (
            <motion.p
              key={passwordsMatch ? "match" : "no-match"}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-xs ${passwordsMatch ? "text-emerald-300" : "text-amber-300"}`}
            >
              {passwordsMatch ? "✓ Passwords match" : "Passwords do not match yet"}
            </motion.p>
          )}
        </div>

        <AuthError message={error} />

        <AuthButton status={status} loadingText="Creating account…" successText="Account created!">
          Create Account
        </AuthButton>
      </form>
    </AuthShell>
  );
}

export default Register;
