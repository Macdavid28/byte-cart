function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="relative overflow-hidden rounded-2xl px-6 py-12 text-center shadow-2xl md:px-12 md:py-20">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/src/assets/cta_bg.png')" }}
          >
            <div className="absolute inset-0 bg-black/50"></div>{" "}
            {/* Overlay for readability */}
          </div>

          <div className="relative z-10 mx-auto max-w-3xl space-y-6">
            <h2 className="font-secondary text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Get 50% Off Tech Gear
            </h2>
            <p className="text-blue-100 text-lg md:text-xl">
              Limited time offer! Upgrade your setup with the latest technology
              at unbeatable prices.
            </p>

            <div className="flex justify-center pt-4">
              <button className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-blue-500/40">
                Shop Now
              </button>
            </div>

            <p className="text-sm text-blue-200 mt-4">
              *Terms and conditions apply. Offer valid while stocks last.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
