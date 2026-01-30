import Bestsellers from "./Bestsellers";
import Category from "./Category";
import Hero from "./Hero";
import CTA from "../../components/CTA";

const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <Bestsellers />
      <CTA />
    </div>
  );
};

export default Home;
