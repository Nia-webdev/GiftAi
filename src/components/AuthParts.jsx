import { AnimatePresence, motion } from "framer-motion";

// Input with an icon, a glowing focus ring and an optional right-side slot.
export function AuthField({ id, label, icon: Icon, right, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>

      <div className="group flex items-center rounded-xl border border-[#164E82] bg-[#020D20] transition-all duration-500 focus-within:border-[#22D3EE] focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]">
        {Icon && (
          <span className="pl-4 text-[#5F7FA3] transition-colors duration-500 group-focus-within:text-[#22D3EE]">
            <Icon size={18} />
          </span>
        )}

        <input
          id={id}
          {...inputProps}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-[#4F6F92]"
        />

        {right}
      </div>
    </div>
  );
}

// Error that shakes in, so it is impossible to miss.
export function AuthError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          key={message}
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// Submit button with spinner and success tick.
// status: "idle" | "loading" | "success"
export function AuthButton({ status = "idle", children, loadingText, successText }) {
  return (
    <motion.button
      type="submit"
      disabled={status !== "idle"}
      whileHover={status === "idle" ? { scale: 1.02, y: -2 } : undefined}
      whileTap={status === "idle" ? { scale: 0.97 } : undefined}
      className={`btn-shine flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-[#001329] shadow-[0_14px_40px_-14px_rgba(34,211,238,0.7)] transition-colors duration-500 ${
        status === "success" ? "bg-emerald-400" : "bg-[#22D3EE] hover:bg-[#52E7FF]"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {status === "loading" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#001329]/30 border-t-[#001329]" />
          )}
          {status === "success" && <span>✓</span>}
          {status === "idle" ? children : status === "loading" ? loadingText : successText}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
