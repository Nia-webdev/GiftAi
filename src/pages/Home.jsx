
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureBar from "../components/FeatureBar";
import CategoryCard from "../components/CategoryCard";
import GiftCard from "../components/GiftCard";
import AiBanner from "../components/AiBanner";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function Home() {
  const categories = [
    {
      name: "Birthday",
      count: "120+ Gifts",
      image:
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Anniversary",
      count: "95+ Gifts",
      image:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Graduation",
      count: "80+ Gifts",
     image:
      "https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=500&q=80",

    },
    {
      name: "Wedding",
      count: "70+ Gifts",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Valentine's",
      count: "60+ Gifts",
      image:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Mother's Day",
      count: "55+ Gifts",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Father's Day",
      count: "50+ Gifts",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Custom Gifts",
      count: "45+ Gifts",
      image:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const gifts = [
    {
      name: "Smart Watch",
      price: "$89.99",
      rating: "4.8",
      reviews: "124",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Personalized Photo Frame",
      price: "$24.99",
      rating: "4.7",
      reviews: "99",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Luxury Perfume Set",
      price: "$59.99",
      rating: "4.9",
      reviews: "156",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Bluetooth Earbuds",
      price: "$39.99",
      rating: "4.8",
      reviews: "102",
      image:
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Customized Mug",
      price: "$19.99",
      rating: "4.6",
      reviews: "76",
      image:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Gift Hamper Box",
      price: "$49.99",
      rating: "4.9",
      reviews: "203",
     image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=80",
    },
  ];


return (
  <div className="min-h-screen bg-[#020d20] text-white">
    <Navbar />

    {/* HERO SECTION */}
<section className="relative flex min-h-[440px] items-center overflow-hidden bg-[#061A3A] bg-[url('/images/hero-background.png')] bg-cover bg-center bg-no-repeat px-[40px] py-[40px] max-md:min-h-[560px]">

      <div className="relative z-10 w-full max-w-[540px] md:w-1/2">
        <div className="mb-[25px] -mt-[15px] inline-block rounded-full border border-[#164E82] bg-[#061A3A]/75 px-[15px] py-[7px] text-[13px] text-white">
          ✨ Smart Gifts. Happier Moments.
        </div>
        <br />

        <h1 className="mb-[15px] text-[54px] leading-[1.05] font-ebold sm:text-[45px]">
          Find the Perfect Gift
          <br />
          with <span className="text-[#22D3EE]">AI</span>
        </h1>

        <p className="mt-[12px] max-w-[480px] text-[2opx] leading-[1.5] text-[#B9C7E6]">
          GiftAI helps you discover personalized gifts for every special
          occasion. Make every moment unforgettable with the power of AI.
        </p>

        {/* <div className="mt-[25px] flex flex-wrap gap-[13px] max-sm:justify-center"> */}
        
<div className="mt-[35px] flex flex-row flex-wrap items-center gap-2">

          <Link
            to="/gifts"
            className="rounded-[9px] bg-[#22D3EE] px-[22px] py-3 font-bold text-[#061A3A] transition hover:-translate-y-0.5 hover:bg-[#54E6FF]"
          >
            Explore Gifts →
          </Link>

          <Link
            to="/ai-recommendation"
            className="rounded-[9px] border border-[#22D3EE] bg-[#061A3A]/75 px-[22px] py-3 font-bold text-white transition hover:bg-[#00BFFB]/10"
          >
            🤖 Get AI Recommendation
          </Link>
        </div>
      </div>

      <div className="absolute top-[70px] right-[6%] z-10 flex items-center gap-2 rounded-[15px] border border-[#22D3EE] bg-[#061A3A]/90 px-4 py-[10px] text-[12px] text-white max-sm:right-3 max-sm:top-3">
        ✨ <span>Personalized<br />Just for You</span>
      </div>
    </section>

    <FeatureBar />

    {/* CATEGORY SECTION */}
    <section className="my-[25px] mx-[15px] w-96% ">
      <div className="mb-[18px] flex items-end justify-between gap-3">
        <div>
          <h2 className="mb-[5px] text-xl font-bold text-white">
            Shop by Category
          </h2>
          <p className="text-xs text-[#819BB5]">
            Find gifts for every special occasion.
          </p>
        </div>

        <Link
          to="/gifts"
          className="shrink-0 text-xs text-[#09D8FF] hover:underline"
        >
          View All →
        </Link>
      </div>

    <div className=" grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 ">
 
  {categories.map((category, index) => (
    <CategoryCard
      key={category.id ?? category.name ?? index}
      category={category}
    />
  ))}
</div>

    </section>

    {/* FEATURED GIFTS SECTION */}
    <section className="my-[25px] mx-[15px] w-96%">
      <div className="mb-[18px] flex items-end justify-between gap-3">
        <div>
          <h2 className="mb-[5px] text-xl font-bold text-white">
            Featured Gifts
          </h2>
          <p className="text-xs text-[#819BB5]">
            Popular gifts picked for special moments.
          </p>
        </div>

        <Link
          to="/gifts"
          className="shrink-0 text-xs text-[#09D8FF] hover:underline"
        >
          View All Gifts →
        </Link>
      </div>

      <div className=" grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {gifts.map((gift, index) => (
          <GiftCard
            key={gift.id ?? gift.name ?? index}
            gift={gift}
          />
        ))}
      </div>
    </section>

    <AiBanner />
    <HowItWorks />
    <Footer />
  </div>
);
}
export default Home;


