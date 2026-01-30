import { ArrowRight } from "lucide-react";
import BestsellersCard from "../../components/BestsellersCard";

export interface Bestsellers {
  name: string;
  image: string;
  price: number;
  rating: number;
}

const bestsellers: Bestsellers[] = [
  {
    name: "Sony WH-1000XM5",
    image:
      "https://electronics.sony.com/image/5d02da5df552836db894cebc6920215ee040f229?height=600&width=600&fit=cover",
    price: 348.0,
    rating: 5,
  },
  {
    name: "Nintendo Switch OLED",
    image:
      "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/hardware/switch/oled-model/gallery/white/01",
    price: 349.99,
    rating: 5,
  },
  {
    name: "DJI Mini 4 Pro",
    image:
      "https://dji-official-aps.dji.com/cms/uploads/00f918e958197171d87e0766dd39403d.png",
    price: 759.0,
    rating: 5,
  },
  {
    name: "Apple Vision Pro",
    image:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/vision-pro-gallery-1-202402?wid=600&hei=600&fmt=jpeg&qlt=95&.v=1706240428980",
    price: 3499.0,
    rating: 4,
  },
];

function Bestsellers() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="font-secondary text-3xl font-bold text-white md:text-4xl">
              Bestsellers
            </h2>
            <p className="text-gray-400 max-w-md">
              Our most popular gear, trusted by pros and gamers worldwide.
            </p>
          </div>

          <button className="group flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-white">
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((item, index) => (
            <BestsellersCard
              key={index}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Bestsellers;
