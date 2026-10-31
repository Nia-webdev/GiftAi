
function FeatureBar() {
  const features = [
    {
      icon: "🎁",
      title: "Personalized Gifts",
      text: "AI-powered suggestions",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      text: "Safe & on time",
    },
    {
      icon: "🛡️",
      title: "Secure Payment",
      text: "100% secure",
    },
  ];

  return (
    <section className="mx-auto my-8 grid w-[96%] grid-cols-1 gap-5 sm:grid-cols-3">
        {/*grid grid-cols-1 gap-4 px-[5%] py-6 sm:grid-cols-3 sm:px-[8%]*/}

      {features.map((feature) => (
        <div
          key={feature.title}
          className="group flex items-center gap-4 rounded-[18px] border border-[#243F68] bg-[#10264B] px-5 py-5 transition-all duration-500 ease-out hover:border-[#22D3EE] hover:bg-[#142F59] hover:shadow-[0_0_22px_rgba(34,211,238,0.16)]"
        >
          <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-full border border-[#22D3EE] bg-[#061A3A] text-2xl transition-transform duration-500 ease-out group-hover:scale-105">
            {feature.icon}
          </div>

          <div>
            <h3 className="font-bold text-white transition-colors duration-500 ease-out group-hover:text-[#22D3EE]">
              {feature.title}
            </h3>
            <p className="mt-1 text-sm text-[#B9C7E6]">
              {feature.text}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default FeatureBar;
