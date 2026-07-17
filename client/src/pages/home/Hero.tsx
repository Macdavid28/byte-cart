import { ArrowRight, Sparkles, Shield, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="relative min-h-[600px] lg:min-h-[700px] w-full overflow-hidden bg-slate-950 text-white flex items-center">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Next-Gen E-Commerce Gadget Outpost
            </div>

            <h1 className="font-secondary text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none tracking-tight text-white">
              Discover the <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Future of Tech
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
              Upgrade your setup with premium flagship gear. Enjoy pro-level active noise cancellation, custom audio dynamics, and lightning-fast latency. Up to <span className="text-blue-400 font-bold">50% off</span> for a limited time.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="/mocks/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md px-8 py-4 text-sm font-bold text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-900 hover:text-white active:scale-95"
              >
                View 10 Design Mocks
              </a>
            </div>

            {/* Micro highlights */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-900 max-w-lg">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-900 p-2 text-blue-400 border border-slate-800">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">3-Year Warranty</h4>
                  <p className="text-xs text-slate-500">Guaranteed protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-900 p-2 text-indigo-400 border border-slate-800">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Pro Telemetry</h4>
                  <p className="text-xs text-slate-500">1.2ms ultra-low latency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 p-1 border border-white/10 shadow-2xl backdrop-blur-3xl">
              
              {/* Internal Glass Plate */}
              <div className="h-full w-full rounded-[22px] bg-slate-950/80 p-8 flex flex-col justify-between overflow-hidden relative group">
                {/* Visual Glow */}
                <div className="absolute -top-[30%] -right-[30%] h-60 w-60 rounded-full bg-blue-500/20 blur-[50px] transition-transform duration-700 group-hover:scale-125"></div>

                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Featured
                  </span>
                  <span className="text-xs font-bold text-slate-500">₦162,000</span>
                </div>

                {/* Floating Image */}
                <div className="my-auto flex justify-center z-10 transform transition-transform duration-700 group-hover:scale-105">
                  <img
                    src="https://electronics.sony.com/image/5d02da5df552836db894cebc6920215ee040f229?height=600&width=600&fit=cover"
                    alt="Sony WH-1000XM5"
                    className="h-56 w-56 object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-[pulse_6s_infinite_alternate]"
                  />
                </div>

                {/* Spec badges overlay */}
                <div className="flex justify-between gap-2 z-10">
                  <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-center flex-1">
                    <p className="text-[10px] text-slate-500 font-medium uppercase">Playtime</p>
                    <p className="text-xs font-bold text-white">40 Hrs</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-center flex-1">
                    <p className="text-[10px] text-slate-500 font-medium uppercase">Noise Cut</p>
                    <p className="text-xs font-bold text-white">Active ANC</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-center flex-1">
                    <p className="text-[10px] text-slate-500 font-medium uppercase">Driver</p>
                    <p className="text-xs font-bold text-white">40mm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;
