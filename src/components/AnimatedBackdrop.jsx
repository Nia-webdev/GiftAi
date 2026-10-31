const particles = Array.from({ length: 8 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: 3 + (i % 4) * 2,
  delay: (i % 7) * 1.1,
  duration: 9 + (i % 5) * 2.5,
}));

// Floating glow orbs, soft grid and rising sparkles behind a page.
function AnimatedBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      <div className="fx-orb fx-orb-a" />
      <div className="fx-orb fx-orb-b" />
      <div className="fx-orb fx-orb-c" />
      <div className="fx-grid" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="fx-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default AnimatedBackdrop;
