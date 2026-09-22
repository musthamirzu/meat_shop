import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiCheck, HiPlus, HiMinus, HiSparkles } from "react-icons/hi2";
import { PREPARATION_STYLES } from "../../data/mockData";
import { useCart } from "../../context/CartContext";

const WEIGHT_PRESETS = [
  { label: "500g (0.5 kg)", value: 0.5 },
  { label: "1.0 kg", value: 1.0, popular: true },
  { label: "1.5 kg", value: 1.5 },
  { label: "2.0 kg", value: 2.0 }
];

const CLEANING_OPTIONS = [
  { id: "turmeric", label: "Cold RO & Turmeric Salt Wash", desc: "Anti-bacterial traditional wash" },
  { id: "skin_off", label: "Skin-Off (Cleaned)", desc: "Feathers & outer skin completely peeled" },
  { id: "trim_fat", label: "Trim Excess Fat", desc: "Leaner healthy cuts" }
];

const MeatCustomizerModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  const [weightKg, setWeightKg] = useState(1.0);
  const [bonePreference, setBonePreference] = useState("with_bone");
  const [preparationId, setPreparationId] = useState(() => {
    return product?.allowedPreparations?.[0] || "kulambu";
  });
  const [cleaningPreferences, setCleaningPreferences] = useState([
    "Cold RO & Turmeric Salt Wash",
    "Skin-Off (Cleaned)"
  ]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  if (!isOpen || !product) return null;

  // Filter supported preparations for this meat
  const availablePreparations = PREPARATION_STYLES.filter((prep) =>
    product.allowedPreparations?.includes(prep.id)
  );

  // Price calculations
  const effectiveUnitPrice =
    bonePreference === "boneless" && product.supportsBoneless
      ? product.bonelessPricePerKg
      : product.basePricePerKg;

  const calculatedTotal = Math.round(effectiveUnitPrice * weightKg);

  const handleCleaningToggle = (optionLabel) => {
    setCleaningPreferences((prev) =>
      prev.includes(optionLabel)
        ? prev.filter((o) => o !== optionLabel)
        : [...prev, optionLabel]
    );
  };

  const handleAddWeight = () => {
    setWeightKg((prev) => parseFloat((prev + 0.25).toFixed(2)));
  };

  const handleSubtractWeight = () => {
    setWeightKg((prev) => Math.max(0.5, parseFloat((prev - 0.25).toFixed(2))));
  };

  const selectedPrepObj = PREPARATION_STYLES.find((p) => p.id === preparationId);

  const handleConfirmAddToCart = () => {
    addToCart(product, {
      weightKg,
      bonePreference,
      preparationId,
      preparationName: selectedPrepObj?.name || "Curry Cut",
      cleaningPreferences,
      specialInstructions
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header & Product Banner */}
          <div className="relative bg-gradient-to-r from-red-900 to-stone-900 text-white p-5 pb-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>

            <div className="flex gap-4 items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-red-500/40 shadow-md"
              />
              <div className="flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-600/90 text-white mb-1">
                  {product.badge || "Farm Fresh"}
                </span>
                <h2 className="text-lg sm:text-xl font-bold leading-snug">
                  {product.name}
                </h2>
                {product.tamilName && (
                  <p className="text-xs text-red-200 font-medium">
                    {product.tamilName}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-300">
                  <span>⭐ {product.rating}</span>
                  <span>•</span>
                  <span>⏱️ {product.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Gross vs Net Weight transparency note */}
            <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-200">
              <HiSparkles className="text-amber-400 w-4 h-4 flex-shrink-0" />
              <span>{product.grossNetRatio}</span>
            </div>
          </div>

          {/* Scrollable Customization Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-gray-100">
            {/* Step 1: Weight in Kilograms */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold inline-flex items-center justify-center">1</span>
                    Select Quantity (Kilograms)
                  </h3>
                  <p className="text-xs text-gray-500">How much meat do you need?</p>
                </div>
                {/* Stepper */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={handleSubtractWeight}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50"
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-bold text-gray-900 text-sm">
                    {weightKg} kg
                  </span>
                  <button
                    onClick={handleAddWeight}
                    className="w-8 h-8 rounded-lg bg-red-600 text-white shadow-sm flex items-center justify-center hover:bg-red-700"
                  >
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Preset Weight Chips */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {WEIGHT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setWeightKg(preset.value)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      weightKg === preset.value
                        ? "bg-red-50 border-red-600 text-red-700 shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {preset.label}
                    {preset.popular && (
                      <span className="block text-[9px] text-red-600 uppercase font-bold">Best</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Bone Preference */}
            {product.supportsBoneless && (
              <div className="pt-5 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold inline-flex items-center justify-center">2</span>
                    Bone Preference
                  </h3>
                  <p className="text-xs text-gray-500">Choose between standard bone-in or boneless cuts</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setBonePreference("with_bone")}
                    className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all flex flex-col justify-between ${
                      bonePreference === "with_bone"
                        ? "border-red-600 bg-red-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">🍖 With Bone</span>
                      {bonePreference === "with_bone" && (
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                          <HiCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">Rich bone marrow taste in gravies</p>
                    <div className="mt-2 text-xs font-bold text-red-700">
                      ₹{product.basePricePerKg} / kg
                    </div>
                  </div>

                  <div
                    onClick={() => setBonePreference("boneless")}
                    className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all flex flex-col justify-between ${
                      bonePreference === "boneless"
                        ? "border-red-600 bg-red-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">🥩 Boneless</span>
                      {bonePreference === "boneless" && (
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                          <HiCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">100% tender pure meat, easy to eat</p>
                    <div className="mt-2 text-xs font-bold text-red-700">
                      ₹{product.bonelessPricePerKg} / kg
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preparation Cut Style */}
            <div className="pt-5 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold inline-flex items-center justify-center">
                    {product.supportsBoneless ? "3" : "2"}
                  </span>
                  Dish Preparation & Cut Style
                </h3>
                <p className="text-xs text-gray-500">
                  How will our master butcher slice your meat?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availablePreparations.map((style) => {
                  const isSelected = preparationId === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setPreparationId(style.id)}
                      className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-red-600 bg-red-50/60 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl pt-0.5">{style.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {style.name}
                          </h4>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] flex-shrink-0">
                              <HiCheck />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-red-600">
                          {style.tagline}
                        </p>
                        <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">
                          {style.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Cleaning & Dressing */}
            <div className="pt-5 space-y-2.5">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold inline-flex items-center justify-center">
                  {product.supportsBoneless ? "4" : "3"}
                </span>
                Hygienic Cleaning & Dressing
              </h3>

              <div className="space-y-2">
                {CLEANING_OPTIONS.map((opt) => {
                  const checked = cleaningPreferences.includes(opt.label);
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleCleaningToggle(opt.label)}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-gray-500">{opt.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Butcher Notes */}
            <div className="pt-5 space-y-2 pb-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Special Butcher Instructions (Optional)
              </h3>
              <textarea
                rows={2}
                placeholder="e.g. Cut into extra small cubes for soup / keep liver separately..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sticky Bottom Summary & Add Button */}
          <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shadow-lg flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-semibold">
                Total Price ({weightKg} kg)
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  ₹{calculatedTotal}
                </span>
                <span className="text-xs text-gray-400">
                  (₹{effectiveUnitPrice}/kg)
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmAddToCart}
              className="flex-1 max-w-[280px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>Add to Cart</span>
              <span>•</span>
              <span>₹{calculatedTotal}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MeatCustomizerModal;
