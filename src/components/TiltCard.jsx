import { useRef } from "react";

// Light 3D tilt. Only touches CSS variables, so it stays smooth even with many cards.
function TiltCard({ children, className = "", radius = "rounded-2xl", max = 8 }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const handleMove = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const element = ref.current;
    if (!element) return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;

      element.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
      element.style.setProperty("--rx", `${-(py - 0.5) * 2 * max}deg`);
      element.style.setProperty("--mx", `${px * 100}%`);
      element.style.setProperty("--my", `${py * 100}%`);
    });
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`fx-tilt relative ${radius} ${className}`}
    >
      {children}
      <div aria-hidden="true" className={`fx-tilt-glare ${radius}`} />
    </div>
  );
}

export default TiltCard;
