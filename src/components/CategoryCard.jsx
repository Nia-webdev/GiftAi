
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link
      to={`/gifts?category=${encodeURIComponent(category.name)}`}
      className="group block overflow-hidden rounded-xl border border-[#103F69] bg-[#071D3A] transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE] hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="h-[125px] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="px-2 py-3 text-center">
        <h3 className="text-sm font-semibold text-white group-hover:text-[#22D3EE]">
          {category.name}
        </h3>

        <p className="mt-1 text-xs text-[#91A9C4]">
          {category.count}
        </p>

        <span className="mt-2 inline-block text-xs font-semibold text-[#22D3EE]">
          Explore →
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;
