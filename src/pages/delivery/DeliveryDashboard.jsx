import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiMapPin,
  HiPhone,
  HiClock,
  HiCheckCircle,
  HiPlay,
  HiPause,
  HiArrowPath
} from "react-icons/hi2";
import { FaMotorcycle } from "react-icons/fa";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import LiveTrackingMap from "../../components/customer/LiveTrackingMap";

const DeliveryDashboard = () => {
  const { orders, updateOrderStatus, updateDeliveryProgress } = useOrders();
  const { switchRole } = useAuth();

  // Find active orders that are out for delivery or packed
  const activeOrder =
    orders.find((o) => o.status === "out_for_delivery" || o.status === "packed") ||
    orders[0];

  const [isDriving, setIsDriving] = useState(false);

  useEffect(() => {
    let interval;
    if (isDriving && activeOrder && activeOrder.status !== "delivered") {
      interval = setInterval(() => {
        const curProgress = activeOrder.deliveryBoy?.progress || 0;
        if (curProgress < 100) {
          updateDeliveryProgress(activeOrder.id, curProgress + 5);
        } else {
          setIsDriving(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDriving, activeOrder, updateDeliveryProgress]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Rider Top Navigation */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-lg font-bold shadow-lg">
            <FaMotorcycle />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white">
              Delivery Partner Portal
            </h1>
            <p className="text-[11px] text-amber-400 font-medium">
              Rider: Murugan Selvam • Online 🟢
            </p>
          </div>
        </div>

        <Link
          to="/"
          onClick={() => switchRole("customer")}
          className="text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700"
        >
          Exit to Store
        </Link>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {!activeOrder ? (
          <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-base font-bold text-slate-300">
              No active delivery assignments
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Check back when admin assigns a packed order.
            </p>
          </div>
        ) : (
          <>
            {/* Active Order Card */}
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Current Assignment
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeOrder.status.replace(/_/g, " ")}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  #{activeOrder.id}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeOrder.items?.length} Meat items • Total ₹{activeOrder.totalAmount}
                </p>
              </div>

              {/* Action Buttons for Rider */}
              <div className="flex gap-2">
                <a
                  href={`tel:${activeOrder.customerPhone}`}
                  className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <HiPhone className="w-4 h-4" />
                  <span>Call Customer</span>
                </a>

                <button
                  onClick={() => setIsDriving(!isDriving)}
                  className={`flex-1 py-3 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isDriving
                      ? "bg-amber-500 text-slate-950 animate-pulse"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {isDriving ? (
                    <>
                      <HiPause className="w-4 h-4" />
                      <span>Driving (GPS Active)</span>
                    </>
                  ) : (
                    <>
                      <HiPlay className="w-4 h-4" />
                      <span>Start GPS Delivery</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live GPS Map for Rider */}
            <LiveTrackingMap
              order={activeOrder}
              onProgressUpdate={(p) => updateDeliveryProgress(activeOrder.id, p)}
            />

            {/* Destination Address */}
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Drop Address
              </h3>
              <div className="flex items-start gap-3 text-xs">
                <HiMapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">
                    {activeOrder.customerName}
                  </p>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    {activeOrder.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Payment to collect:</span>
                <span className="text-base font-extrabold text-amber-400">
                  {activeOrder.paymentMethod === "Cash on Delivery"
                    ? `₹${activeOrder.totalAmount} (COD)`
                    : "PREPAID (UPI)"}
                </span>
              </div>
            </div>

            {/* Complete Delivery Action */}
            <button
              onClick={() => {
                updateDeliveryProgress(activeOrder.id, 100);
                updateOrderStatus(activeOrder.id, "delivered");
                setIsDriving(false);
              }}
              disabled={activeOrder.status === "delivered"}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <HiCheckCircle className="w-5 h-5" />
              <span>
                {activeOrder.status === "delivered"
                  ? "Order Completed & Delivered"
                  : "Mark Delivered at Doorstep"}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
