
const steps = [
  {
    number: "1",
    icon: "🎯",
    title: "Choose an Occasion",
    description: "Select the event or person you are buying for.",
  },
  {
    number: "2",
    icon: "🤖",
    title: "Get Gift Ideas",
    description: "Explore gifts and personalized recommendations.",
  },
  {
    number: "3",
    icon: "🎁",
    title: "Send Your Gift",
    description: "Choose a gift and arrange delivery.",
  },
];

function HowItWorks() {
  return (
    <section className="my-[30px] mb-[40px] px-[20px] sm:px-[5%]">

      {/* Section Heading */}
      <div className="mb-5">
        <h2 className="mb-1 text-[21px] font-bold text-white sm:text-[23px]">
          How It Works
        </h2>

        <p className="text-[12px] leading-5 text-[#8DA5BB]">
          Three simple steps to make someone's day special.
        </p>
      </div>

      {/* Steps Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">

        {steps.map((step) => (
          <div
            key={step.number}
            className="flex min-h-[95px] items-center gap-3 rounded-[12px] border border-[#10436C] bg-[#061A32] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#08D9FF] hover:shadow-[0_0_15px_rgba(8,217,255,0.15)]"
          >
            {/* Step Number */}
            <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#057AB5] text-[12px] font-bold text-white">
              {step.number}
            </span>

            {/* Step Icon */}
            <span className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full border border-[#00BFFB] bg-[#08294A] text-[22px]">
              {step.icon}
            </span>

            {/* Step Text */}
            <div className="min-w-0">
              <h3 className="mb-1 text-[13px] font-semibold text-white">
                {step.title}
              </h3>

              <p className="text-[11px] leading-[1.5] text-[#829BB3]">
                {step.description}
              </p>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}

export default HowItWorks;
