import type { Categories } from "../pages/home/Category";

const CategoryCard = ({ name, image }: Categories) => {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={name}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>

      <div className="p-4 text-center">
        <h3 className="mb-2 font-secondary text-lg font-bold text-slate-800 capitalize">
          {name}
        </h3>
        <span className="text-sm font-semibold text-blue-600 group-hover:underline">
          Shop Now
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
