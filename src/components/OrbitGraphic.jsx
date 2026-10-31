// Spinning rings with a glowing icon in the middle.
function OrbitGraphic({ icon = "🎁", size = 180 }) {
  return (
    <div
      aria-hidden="true"
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <span className="fx-spin absolute inset-0 rounded-full border border-dashed border-cyan-400/40" />
      <span className="fx-spin-rev absolute inset-[14%] rounded-full border border-cyan-400/25" />
      <span className="fx-pulse absolute inset-[26%] rounded-full bg-cyan-400/15 blur-xl" />

      <span className="fx-spin absolute inset-0">
        <i className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_#22d3ee]" />
      </span>
      <span className="fx-spin-rev absolute inset-[14%]">
        <i className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-300 shadow-[0_0_12px_#a78bfa]" />
      </span>

      <span
        className="fx-float relative drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]"
        style={{ fontSize: size * 0.34 }}
      >
        {icon}
      </span>
    </div>
  );
}

export default OrbitGraphic;
