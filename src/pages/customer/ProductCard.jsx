import { useState } from "react";
import { HiSparkles, HiPlus } from "react-icons/hi2";
import MeatCustomizerModal from "../../components/customer/MeatCustomizerModal";

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Product Image & Badges */}
        <div className="relative h-44 sm:h-48 w-full bg-stone-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Fresh Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-red-600 text-white shadow-md">
              {product.badge || "Farm Fresh"}
            </span>
          </div>

          {/* Delivery Time Pill */}
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
            <span>⏱️ {product.deliveryTime}</span>
          </div>

          {/* Rating Pill */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-sm">
            <span>★ {product.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>

            {product.tamilName && (
              <p className="text-[11px] font-medium text-red-600">
                {product.tamilName}
              </p>
            )}

            <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {product.tagline || product.description}
            </p>

            {/* Preparation Cut Chips preview */}
            <div className="mt-2.5 flex flex-wrap gap-1">
              {product.allowedPreparations?.slice(0, 3).map((prep) => (
                <span
                  key={prep}
                  className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-stone-100 text-stone-700 uppercase"
                >
                  {prep.replace("_", " ")}
                </span>
              ))}
              {product.allowedPreparations?.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-red-50 text-red-700">
                  +{product.allowedPreparations.length - 3} cuts
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Add Button */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-gray-900">
                  ₹{product.basePricePerKg}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  / kg
                </span>
              </div>
              {product.supportsBoneless && (
                <span className="text-[10px] text-gray-500 font-medium block">
                  Boneless ₹{product.bonelessPricePerKg}/kg
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-extrabold text-xs border border-red-200 hover:border-red-600 shadow-xs transition-all duration-200 transform active:scale-95"
            >
              <span>CUSTOMIZE</span>
              <HiPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      <MeatCustomizerModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;