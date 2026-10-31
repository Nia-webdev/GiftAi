import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function GiftCard({ gift }) {
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className="group overflow-hidden rounded-[11px] border border-[#103F69] bg-[#071D3A] transition duration-500 ease-out hover:border-[#00CFFF] hover:shadow-[0_18px_40px_-22px_rgba(34,211,238,0.4)]">
      <div className="relative h-[135px] p-2">
        <Link
          to="/gift-details"
          state={{ gift }}
          aria-label={`View ${gift.name} details`}
          className={`block h-full w-full overflow-hidden rounded-[7px] ${loaded ? "" : "skeleton"}`}
        >
          <img
            ref={imageRef}
            src={gift.image}
            alt={gift.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full rounded-[7px] object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.06] ${
              loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
            }`}
          />
        </Link>

        <motion.button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          onClick={() => setLiked((value) => !value)}
          whileTap={{ scale: 0.7 }}
          animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`absolute right-[13px] top-[13px] flex h-[25px] w-[25px] items-center justify-center rounded-full bg-black/55 text-base transition-colors duration-500 ease-out ${
            liked ? "text-[#FF4F83]" : "text-white hover:text-[#FF4F83]"
          }`}
        >
          {liked ? "♥" : "♡"}
        </motion.button>
      </div>

      <div className="px-[10px] pb-[11px] pt-[7px]">
        <Link
          to="/gift-details"
          state={{ gift }}
          className="mb-[5px] block truncate text-[11px] font-semibold text-white transition duration-500 ease-out hover:text-[#22D3EE]"
        >
          {gift.name}
        </Link>

        <div className="text-[10px] text-[#FFC642]">
          ★ {gift.rating}
          {gift.reviews != null && (
            <span className="ml-1 text-[#94ABC1]">({gift.reviews})</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <strong className="text-[12px] text-white">
            {typeof gift.price === "number"
              ? `$${gift.price.toFixed(2)}`
              : gift.price}
          </strong>

          <Link
            to="/gift-details"
            state={{ gift }}
            className="btn-shine rounded-[7px] bg-[#22D3EE] px-[10px] py-[6px] text-[9px] font-bold text-[#001329] transition duration-500 ease-out hover:bg-[#52E7FF]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GiftCard;
