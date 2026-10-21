
import { Link } from "react-router-dom";

function GiftCard({ gift }) {
  return (
    <div className="group overflow-hidden rounded-[11px] border border-[#103F69] bg-[#071D3A] transition duration-300 hover:-translate-y-1 hover:border-[#00CFFF]">
      <div className="relative h-[135px] p-2">
        <Link
          to="/gift-details"
          state={{ gift }}
          aria-label={`View ${gift.name} details`}
        >
          <img
            src={gift.image}
            alt={gift.name}
            className="h-full w-full rounded-[7px] object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => alert("Wishlist functionality will be connected next.")}
          className="absolute right-[13px] top-[13px] flex h-[25px] w-[25px] items-center justify-center rounded-full bg-black/55 text-base text-white transition hover:text-[#FF4F83]"
        >
          ♡
        </button>
      </div>

      <div className="px-[10px] pb-[11px] pt-[7px]">
        <Link
          to="/gift-details"
          state={{ gift }}
          className="mb-[5px] block truncate text-[11px] font-semibold text-white transition hover:text-[#22D3EE]"
        >
          {gift.name}
        </Link>

        <div className="text-[10px] text-[#FFC642]">
          ★ {gift.rating}
          {gift.reviews != null && (
            <span className="ml-1 text-[#94ABC1]">
              ({gift.reviews})
            </span>
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
            className="rounded-[7px] bg-[#22D3EE] px-[10px] py-[6px] text-[9px] font-bold text-[#001329] transition hover:bg-[#52E7FF]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GiftCard;
