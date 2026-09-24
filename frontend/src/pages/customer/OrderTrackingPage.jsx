import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiClock,
  HiPhone,
  HiShieldCheck,
  HiMapPin,
  HiSparkles
} from "react-icons/hi2";
import { useOrders } from "../../context/OrderContext";
import LiveTrackingMap from "../../components/customer/LiveTrackingMap";

const STATUS_STEPS = [
  { id: "placed", title: "Order Confirmed", desc: "Received at Meat Hub" },
  { id: "prepping", title: "Cutting & Cleaning", desc: "Master butcher custom dressing" },
  { id: "packed", title: "Sealed & Chilled", desc: "Vacuum sealed at 4°C" },
  { id: "out_for_delivery", title: "Out for Delivery", desc: "Delivery partner en route" },
  { id: "delivered", title: "Delivered", desc: "Enjoy your fresh feast!" }
];

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateDeliveryProgress } = useOrders();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  // If simulation is active, auto-advance delivery boy every few seconds for demonstration
  const [autoSimulate, setAutoSimulate] = useState(false);

  useEffect(() => {
    let timer;
    if (autoSimulate && currentOrder && currentOrder.status !== "delivered") {
      timer = setInterval(() => {
        const curProgress = currentOrder.deliveryBoy?.progress || 0;
        if (curProgress < 100) {
          updateDeliveryProgress(currentOrder.id, curProgress + 4);
        } else {
          setAutoSimulate(false);
        }
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [autoSimulate, currentOrder, updateDeliveryProgress]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">
          Could not find tracking information for #{orderId}
        </p>
        <Link
          to="/"
          className="mt-4 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md"
        >
          Return to Meat Shop
        </Link>
      </div>
    );
  }

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.findIndex((s) => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  const activeIndex = getStepIndex(currentOrder.status);

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-gray-900">
                Track Order #{currentOrder.id}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                {currentOrder.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Placed {currentOrder.placedAt} • {currentOrder.deliverySlot}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAutoSimulate(!autoSimulate)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
            autoSimulate
              ? "bg-amber-500 text-white border-amber-600 shadow-md animate-pulse"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span>{autoSimulate ? "⏸️ Pause Demo" : "▶️ Auto-Track GPS"}</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Realtime Map Tracking Engine */}
        <LiveTrackingMap
          order={currentOrder}
          onProgressUpdate={(newProgress) =>
            updateDeliveryProgress(currentOrder.id, newProgress)
          }
        />

        {/* Swiggy Style Stepper Status */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Live Order Progress
            </h2>
            <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <HiSparkles /> Fresh Meat Cutting
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={step.id} className="relative flex items-start gap-3">
                  {/* Step circle marker */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-red-600 text-white ring-4 ring-red-100 animate-pulse"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>

                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold ${
                        isCurrent
                          ? "text-red-600"
                          : isPast
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-gray-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Butcher Cut-Sheet Details (The exact custom cut booked) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Butcher Cut & Prep Instructions
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {currentOrder.items?.length} items
            </span>
          </div>

          <div className="space-y-3">
            {currentOrder.items?.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3.5"
              >
                <div className="text-2xl pt-1">
                  {item.category === "chicken"
                    ? "🍗"
                    : item.category === "mutton"
                    ? "🥩"
                    : item.category === "seafood"
                    ? "🐟"
                    : "🍳"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {item.productName}
                    </h4>
                    <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                      ₹{item.itemTotal || item.subtotal}
                    </span>
                  </div>

                  {/* Highlights of cut options chosen */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-600 text-white">
                      ⚖️ {item.weightKg} kg
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      {item.bonePreference === "boneless" ? "🥩 Boneless" : "🍖 With Bone"}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                      ✨ {item.preparationName || item.preparationId}
                    </span>
                  </div>

                  {item.cleaningPreferences?.length > 0 && (
                    <p className="text-[11px] text-gray-600 mt-1.5">
                      <span className="font-semibold">Cleaning:</span>{" "}
                      {item.cleaningPreferences.join(", ")}
                    </p>
                  )}

                  {item.specialInstructions && (
                    <p className="text-[11px] text-amber-700 italic mt-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                      "{item.specialInstructions}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Delivery & Payment Information
          </h2>

          <div className="flex items-start gap-3 text-xs text-gray-600">
            <HiMapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-800">Delivery Address</p>
              <p className="text-gray-500 mt-0.5">{currentOrder.deliveryAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-gray-600">
            <HiClock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-800">Scheduled Time Slot</p>
              <p className="text-gray-500 mt-0.5">{currentOrder.deliverySlot}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Payment Mode: <strong className="text-gray-800">{currentOrder.paymentMethod}</strong>
            </span>
            <span className="text-sm font-extrabold text-red-700">
              Total: ₹{currentOrder.totalAmount}
            </span>
          </div>
        </div>

        {/* Back to Shopping Button */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-sm transition-all"
          >
            <span>← Return to Meat Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
