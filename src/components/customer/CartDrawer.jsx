import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiXMark,
  HiTrash,
  HiPlus,
  HiMinus,
  HiMapPin,
  HiClock,
  HiShieldCheck,
  HiArrowRight,
  HiSparkles
} from "react-icons/hi2";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

const DELIVERY_SLOTS = [
  { id: "instant", label: "⚡ Express Delivery", time: "30-40 mins", note: "Live cutting right now" },
  { id: "morning", label: "🌅 Sunday Morning Slot", time: "7:00 AM - 8:30 AM", note: "First morning fresh cut" },
  { id: "evening", label: "🌇 Evening Slot", time: "5:00 PM - 6:30 PM", note: "Fresh evening batch" }
];

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotalAmount,
    cartTotalWeightKg,
    cartItemCount
  } = useCart();

  const { placeOrder } = useOrders();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState("instant");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCartOpen) return null;

  const packingCharge = 15;
  const deliveryCharge = cartTotalAmount > 499 ? 0 : 35;
  const grandTotal = cartTotalAmount + packingCharge + deliveryCharge;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsPlacing(true);

    const slotLabel =
      DELIVERY_SLOTS.find((s) => s.id === selectedSlot)?.label +
      " (" +
      DELIVERY_SLOTS.find((s) => s.id === selectedSlot)?.time +
      ")";

    const orderId = placeOrder({
      customerName: currentUser?.name || "Customer",
      customerPhone: currentUser?.phone || "+91 98402 88910",
      deliveryAddress: currentUser?.address || "Flat 3A, Green Meadows, Indiranagar",
      deliverySlot: slotLabel,
      paymentMethod: paymentMethod === "upi" ? "UPI (Instant)" : "Cash on Delivery",
      items: cartItems,
      totalAmount: grandTotal
    });

    clearCart();
    setIsPlacing(false);
    setIsCartOpen(false);
    navigate(`/tracking/${orderId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full max-w-md h-full bg-slate-50 flex flex-col shadow-2xl"
        >
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-red-800 to-red-950 text-white p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Your Fresh Meat Cart</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600">
                  {cartItemCount} items
                </span>
              </div>
              <p className="text-xs text-red-200 mt-0.5">
                Total weight: {cartTotalWeightKg.toFixed(2)} kg
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="text-6xl mb-3">🥩</div>
                <h3 className="text-base font-bold text-gray-800">
                  Your meat cart is empty!
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Choose fresh cuts like Country Chicken Sukka, Mutton Keema, or Vanjaram fish to get started.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-md"
                >
                  Browse Fresh Meat
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm flex gap-3 items-start"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customization Details Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800">
                            {item.weightKg} kg
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                            {item.bonePreference === "boneless" ? "🥩 Boneless" : "🍖 With Bone"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            ✨ {item.preparationName}
                          </span>
                        </div>

                        {item.cleaningPreferences?.length > 0 && (
                          <p className="text-[10px] text-gray-400 mt-1 truncate">
                            Dressing: {item.cleaningPreferences.join(", ")}
                          </p>
                        )}

                        {/* Stepper and Price */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-50"
                            >
                              <HiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-xs font-bold text-white hover:bg-red-700"
                            >
                              <HiPlus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold text-gray-900">
                              ₹{item.subtotal}
                            </span>
                            <p className="text-[9px] text-gray-400">
                              ₹{item.unitPricePerKg}/kg
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Slot Selection */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wide">
                    <HiClock className="text-red-600 w-4 h-4" />
                    <span>Choose Delivery Slot</span>
                  </div>

                  <div className="space-y-2">
                    {DELIVERY_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot.id;
                      return (
                        <div
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-red-600 bg-red-50/70"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-900">
                              {slot.label}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {slot.note}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-red-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {slot.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiMapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        Deliver To
                      </span>
                      <span className="text-[11px] font-bold text-red-600">Home</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">
                      {currentUser?.name} • {currentUser?.phone}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                      {currentUser?.address}
                    </p>
                  </div>
                </div>

                {/* Payment Option */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide block">
                    Payment Method
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        paymentMethod === "upi"
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      📱 Instant UPI (GPay/PhonePe)
                    </button>
                    <button
                      onClick={() => setPaymentMethod("cod")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        paymentMethod === "cod"
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Meat Items Subtotal</span>
                    <span>₹{cartTotalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Vacuum Packaging & Cold Gel Pack</span>
                    <span>₹{packingCharge}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Express Delivery Partner Fee</span>
                    <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                  </div>
                  {cartTotalAmount < 500 && (
                    <p className="text-[10px] text-amber-600 flex items-center gap-1">
                      <HiSparkles /> Add ₹{500 - cartTotalAmount} more for FREE delivery!
                    </p>
                  )}
                  <div className="pt-2 border-t border-gray-100 flex justify-between font-extrabold text-sm text-gray-900">
                    <span>To Pay</span>
                    <span className="text-base text-red-700">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Freshness Guarantee Note */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-[11px]">
                  <HiShieldCheck className="w-5 h-5 flex-shrink-0 text-green-600" />
                  <span>100% Fresh Cut Guarantee: Vacuum sealed in temperature-controlled bags.</span>
                </div>
              </>
            )}
          </div>

          {/* Checkout Action Button */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
              <button
                onClick={handleCheckout}
                disabled={isPlacing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-between transition-all transform active:scale-98 disabled:opacity-50"
              >
                <div className="text-left">
                  <div className="text-xs uppercase font-medium text-red-100">
                    {paymentMethod === "upi" ? "Pay via UPI" : "Confirm COD"}
                  </div>
                  <div className="text-base font-extrabold">₹{grandTotal}</div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <span>Place Order</span>
                  <HiArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CartDrawer;
