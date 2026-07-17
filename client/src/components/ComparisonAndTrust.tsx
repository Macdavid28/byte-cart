import { Check, X, ShieldCheck, Truck, RotateCcw, HelpCircle } from "lucide-react";

function ComparisonAndTrust() {
  const comparisonData = [
    {
      feature: "Active Noise Cancellation",
      bytecart: "Ultra 45dB ANC",
      brandX: "Standard 30dB",
      brandY: "No ANC",
      bytecartPass: true,
      brandXPass: true,
      brandYPass: false,
    },
    {
      feature: "Playback Battery Life",
      bytecart: "50 Hours",
      brandX: "30 Hours",
      brandY: "18 Hours",
      bytecartPass: true,
      brandXPass: false,
      brandYPass: false,
    },
    {
      feature: "Water & Sweat Proof",
      bytecart: "IPX7 Rating",
      brandX: "IPX4 Rating",
      brandY: "IPX2 Rating",
      bytecartPass: true,
      brandXPass: true,
      brandYPass: false,
    },
    {
      feature: "Warranty Coverage",
      bytecart: "3-Year Gold Protection",
      brandX: "1-Year Limited",
      brandY: "90-Day Shop",
      bytecartPass: true,
      brandXPass: false,
      brandYPass: false,
    },
    {
      feature: "Price Position",
      bytecart: "Best Value (₦162,000)",
      brandX: "Premium (₦250,000)",
      brandY: "Budget (₦95,000)",
      bytecartPass: true,
      brandXPass: false,
      brandYPass: true,
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28 border-b border-slate-100">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Compare & Decide
          </div>
          <h2 className="heading text-3xl md:text-4xl font-extrabold tracking-tight">
            How We Stack Up Against the Rest
          </h2>
          <p className="text-body text-slate-500">
            Don't just take our word for it. Compare the specifications, guarantees, and pricing of our flagship devices side-by-side with leading competitors.
          </p>
        </div>

        {/* Grid: Left Column Comparison Table, Right Column Trust Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Comparison Table (8 cols) */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 text-sm font-bold text-slate-600">Spec Comparison</th>
                    <th className="p-5 text-sm font-extrabold text-blue-600 bg-blue-50/40 border-x border-slate-100/80">
                      ByteCart Premium
                    </th>
                    <th className="p-5 text-sm font-bold text-slate-500">Brand X</th>
                    <th className="p-5 text-sm font-bold text-slate-500">Brand Y</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-5 text-sm font-bold text-slate-700">{row.feature}</td>
                      <td className="p-5 text-sm font-bold text-slate-900 bg-blue-50/10 border-x border-slate-100/50">
                        <div className="flex items-center gap-2">
                          {row.bytecartPass ? (
                            <Check className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          ) : (
                            <X className="h-4 w-4 text-rose-500 stroke-[3]" />
                          )}
                          <span>{row.bytecart}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          {row.brandXPass ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <X className="h-4 w-4 text-rose-500" />
                          )}
                          <span>{row.brandX}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          {row.brandYPass ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <X className="h-4 w-4 text-rose-500" />
                          )}
                          <span>{row.brandY}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trust Blocks (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200/60 pb-3">
                Our Guarantee to You
              </h3>
              
              {/* Trust Item 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Secure Checkout</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    We use industry-standard 256-bit encryption to protect all payment information.
                  </p>
                </div>
              </div>

              {/* Trust Item 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Fast Delivery</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Orders dispatch within 12 hours from our Lagos dispatch hub with live tracking info.
                  </p>
                </div>
              </div>

              {/* Trust Item 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">30-Day Risk Trial</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Try any ByteCart headset or wearable. Don't love it? We offer a hassle-free full refund.
                  </p>
                </div>
              </div>

              {/* Trust Item 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/10 text-violet-600 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">24/7 Expert Support</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Access our dedicated hardware technicians around the clock for support.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ComparisonAndTrust;
