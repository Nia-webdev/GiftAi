import { Link } from "react-router-dom";

function AiBanner() {
  return (
    <section className="mx-[20px] my-[25px] flex min-h-[100px] flex-wrap items-center gap-4 rounded-[14px] border border-[#057BB7] bg-[radial-gradient(circle_at_80%_50%,rgba(0,80,255,0.3),transparent_40%),#05224A] px-4 py-4 sm:px-5">

      {/* AI Icon */}
      <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#064477] text-[24px]">
        🤖
      </div>

      {/* Banner Text */}
      <div className="min-w-0 flex-1">
        <span className="text-[10px] tracking-[0.5px] text-[#8FA8C0]">
          YOUR SMART GIFT ASSISTANT
        </span>

        <h2 className="my-1 text-[15px] font-bold text-white sm:text-[18px]">
          Need Help Finding the Perfect Gift?
        </h2>

        <p className="text-[11px] leading-4 text-[#94ABC1]">
          Let AI help you choose a thoughtful gift for every occasion.
        </p>
      </div>

      {/* Button */}
      <Link
        to="/ai-recommendation"
        className="rounded-lg bg-[#22D3EE] px-3 py-[9px] text-[10px] font-bold text-[#001329] transition hover:-translate-y-0.5 hover:bg-[#52E7FF] sm:px-4 sm:text-[11px]"
      >
        Get Recommendation →
      </Link>

    </section>
  );
}

export default AiBanner;
