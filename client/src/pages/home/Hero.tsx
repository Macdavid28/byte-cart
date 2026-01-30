import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden bg-gray-50">
      {/* Background Image */}
      <img
        src="https://dlcdnwebimgs.asus.com/gain/4BB18AEF-347E-4DB6-B78C-C0FFE1F20385/w750/h470/fwebp"
        alt="High-tech gaming gear"
        className="h-full w-full object-cover object-center"
      />

      {/* Gradient Overlay - Clean Light Theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 via-gray-50/60 to-transparent md:from-white/95 md:via-white/70 md:to-transparent/20">
        <div className="container mx-auto flex h-full flex-col justify-center px-6 md:px-12">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-secondary text-5xl font-bold leading-tight text-slate-900 md:text-7xl">
              Discover the <br />
              <span className="text-blue-600">Future of Tech</span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-lg">
              Upgrade your setup with premium gear. Unbeatable performance,
              stunning aesthetics, and up to{" "}
              <span className="text-blue-600 font-bold">50% off</span> on
              selected items.
            </p>

            <button className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95">
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
