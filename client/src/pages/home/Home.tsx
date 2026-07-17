import Bestsellers from "./Bestsellers";
import Category from "./Category";
import Hero from "./Hero";
import CTA from "../../components/CTA";
import ComparisonAndTrust from "../../components/ComparisonAndTrust";

const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <Bestsellers />
      <ComparisonAndTrust />
      <CTA />
    </div>
  );
};

export default Home;
