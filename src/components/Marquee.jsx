// Endless moving words. Pauses on hover, each word lights up on hover.
function Marquee({ items, reverse = false, speed = 45, size = "lg" }) {
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span
            className={`cursor-default whitespace-nowrap transition-colors duration-500 ease-out hover:text-[#22D3EE] ${
              size === "lg"
                ? "px-6 text-4xl font-bold text-[#123763] sm:px-10 sm:text-6xl"
                : "accent px-5 text-2xl !text-[#5F7FA3] hover:!text-[#22D3EE] sm:px-8 sm:text-3xl"
            }`}
          >
            {item}
          </span>
          <span className="text-xs text-[#22D3EE]/70">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" style={{ "--dur": `${speed}s` }}>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {row}
        {row}
      </div>
    </div>
  );
}

export default Marquee;
