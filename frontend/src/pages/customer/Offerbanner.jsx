import { HiSparkles, HiClock, HiCheckBadge } from "react-icons/hi2";

const OfferBanner = () => {
  return (
    <section className="mt-6 px-4 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-red-900 via-rose-900 to-red-950 px-5 py-6 sm:px-8 sm:py-8 text-white shadow-xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-600/90 text-white mb-2 shadow-sm">
            <HiSparkles className="text-amber-300" />
            <span>Daily Morning Cut Guarantee</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight">
            100% Antibiotic-Free Fresh Meat
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-red-100 max-w-md leading-relaxed">
            Butchered only after you order. Tailored to your exact cooking style: 
            <strong className="text-amber-300"> Sukka, Kulambu, Fry, or Keema</strong>.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-red-200">
            <span className="flex items-center gap-1">
              <HiCheckBadge className="text-amber-400" /> 100% Halal
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HiClock className="text-amber-400" /> 30-Min Cold Express
            </span>
            <span>•</span>
            <span>RO Water Washed</span>
          </div>
        </div>

        {/* Decorative graphic emoji background */}
        <div className="absolute -right-4 -bottom-6 text-[110px] sm:text-[150px] opacity-15 pointer-events-none select-none">
          🥩
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;