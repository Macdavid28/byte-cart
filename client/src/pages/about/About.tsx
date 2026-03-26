import { ShieldCheck, Zap, Heart, Headphones } from "lucide-react";

const values = [
  {
    icon: <Zap className="h-7 w-7 text-blue-600" />,
    title: "Innovation First",
    description: "We curate only the latest and most innovative tech products.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-emerald-600" />,
    title: "Quality Guaranteed",
    description: "Every product is tested and verified for quality and authenticity.",
  },
  {
    icon: <Heart className="h-7 w-7 text-rose-600" />,
    title: "Customer Love",
    description: "Our customers are at the heart of everything we do.",
  },
  {
    icon: <Headphones className="h-7 w-7 text-violet-600" />,
    title: "24/7 Support",
    description: "Round-the-clock support to help you with any questions.",
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "50+", label: "Brands" },
  { value: "4.9", label: "App Rating" },
];

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-secondary mb-6">
            About <span className="text-blue-400">ByteCart</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make premium technology accessible to everyone.
            ByteCart brings you the best tech products at unbeatable prices, with an
            experience that puts you first.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold font-secondary text-blue-600">{stat.value}</p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white">
        <div className="container mx-auto px-6 md:px-12 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading text-3xl md:text-4xl mb-6">Our Story</h2>
            <p className="text-body text-lg leading-relaxed mb-6">
              ByteCart was founded with a simple belief: everyone deserves access to
              premium technology. What started as a small online store has grown into
              a trusted destination for tech enthusiasts across Nigeria and beyond.
            </p>
            <p className="text-body text-lg leading-relaxed">
              We partner directly with top brands and authorized distributors to
              ensure every product you buy is genuine, backed by warranty, and
              delivered with care. Our team of tech lovers hand-picks each product
              in our catalog.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50">
        <div className="container mx-auto px-6 md:px-12 py-20">
          <h2 className="heading text-3xl md:text-4xl text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-secondary font-bold text-slate-900 text-lg mb-2">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
