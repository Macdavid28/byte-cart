import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CategoryCard from "../../components/CategoryCard";

export interface Categories {
  name: string;
  image: string;
}
const Category = () => {
  const categories: Categories[] = [
    {
      name: "laptops",
      image:
        "https://cdn.mos.cms.futurecdn.net/Gw3Se82bvppoJsHc4rCVsQ-1200-80.jpg.webp",
    },
    {
      name: "headsets",
      image:
        "https://dlcdnwebimgs.asus.com/gain/4BB18AEF-347E-4DB6-B78C-C0FFE1F20385/w750/h470/fwebp",
    },
    {
      name: "wearables",
      image:
        "https://waltondigitech.com:8000/media/product_variant_image/best-smartwatch-price-in-bangladesh-walton-tick-R1A-1.png",
    },
    {
      name: "phones",
      image:
        "https://www.concept-phones.com/wp-content/uploads/2024/12/iphone-17-pro-max-visor-camera-design-render-2-1536x1478.jpg",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="heading text-3xl md:text-4xl">
              Featured Categories
            </h2>
            <p className="text-body max-w-md">
              Browse by category to find exactly what you're looking for.
            </p>
          </div>

          <Link
            to="/categories"
            className="group flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((categoryItem, index) => (
            <CategoryCard
              key={index}
              name={categoryItem.name}
              image={categoryItem.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
