import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiBell,
  HiSpeakerWave,
  HiCheckCircle,
  HiClock,
  HiPhone,
  HiScissors,
  HiCube,
  HiTruck,
  HiArrowPath,
  HiSparkles
} from "react-icons/hi2";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const {
    orders,
    updateOrderStatus,
    playOrderSoundChime,
    lastNotification
  } = useOrders();
  const { switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState("all");

  const filterOrders = () => {
    if (activeTab === "all") return orders;
    return orders.filter((o) => o.status === activeTab);
  };

  const filtered = filterOrders();

  // Metrics
  const totalOrders = orders.length;
  const pendingCuts = orders.filter((o) => o.status === "placed" || o.status === "prepping").length;
  const outForDelivery = orders.filter((o) => o.status === "out_for_delivery").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "placed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">🔔 New Order</span>;
      case "prepping":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">🔪 Butcher Cutting</span>;
      case "packed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">📦 Packed & Chilled</span>;
      case "out_for_delivery":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">🛵 Out for Delivery</span>;
      case "delivered":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">✅ Delivered</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-red-600/30">
            🥩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white">
                Admin Butcher & Orders Hub
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/30 text-red-400 border border-red-500/30">
                LIVE KITCHEN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Supreme Fresh Meat • Live Order Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Test Sound Button */}
          <button
            onClick={playOrderSoundChime}
            title="Test Firebase Sound Chime"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-all"
          >
            <HiSpeakerWave className="w-4 h-4" />
            <span className="hidden sm:inline">Test Alert Chime</span>
          </button>

          {/* Switch to Customer view */}
          <Link
            to="/"
            onClick={() => switchRole("customer")}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all"
          >
            Customer Storefront →
          </Link>
        </div>
      </header>

      {/* Metrics Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-800/80 p-4 rounded-3xl border border-slate-700/60 shadow-lg">
            <p className="text-xs text-slate-400 font-semibold uppercase">
              Total Orders Today
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {totalOrders}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-3xl border border-slate-700/60 shadow-lg">
            <p className="text-xs text-amber-400 font-semibold uppercase">
              🔪 Pending Prep / Cuts
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
              {pendingCuts}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-3xl border border-slate-700/60 shadow-lg">
            <p className="text-xs text-cyan-400 font-semibold uppercase">
              🛵 Out for Delivery
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">
              {outForDelivery}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-3xl border border-slate-700/60 shadow-lg">
            <p className="text-xs text-emerald-400 font-semibold uppercase">
              Total Revenue
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              ₹{totalRevenue}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto py-5 border-b border-slate-800">
          {[
            { id: "all", label: `All Orders (${orders.length})` },
            { id: "placed", label: "🔔 New Orders" },
            { id: "prepping", label: "🔪 In Cutting" },
            { id: "packed", label: "📦 Packed" },
            { id: "out_for_delivery", label: "🛵 In Transit" },
            { id: "delivered", label: "✅ Delivered" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Orders Grid */}
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/30 rounded-3xl border border-slate-800 text-slate-500">
              <p className="text-lg font-bold">No orders found in this section</p>
              <p className="text-xs mt-1">Place an order from the customer storefront to test live pipeline!</p>
            </div>
          ) : (
            filtered.map((order) => (
              <div
                key={order.id}
                className="bg-slate-800/90 rounded-3xl border border-slate-700 p-5 sm:p-6 shadow-xl transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono font-extrabold text-white">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-slate-400">
                      {order.placedAt}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Bill: </span>
                    <span className="text-base sm:text-lg font-extrabold text-amber-400">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({order.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{order.customerName}</span>
                    <span>•</span>
                    <a href={`tel:${order.customerPhone}`} className="text-cyan-400 hover:underline">
                      {order.customerPhone}
                    </a>
                  </div>
                  <div className="text-slate-400 truncate max-w-md">
                    📍 {order.deliveryAddress}
                  </div>
                </div>

                {/* Butcher Cut-Sheet: High Visibility for Butcher */}
                <div className="my-3 p-4 rounded-2xl bg-slate-950/70 border border-red-950/50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-red-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <HiScissors className="w-4 h-4" />
                      Butcher Cut & Prep Instructions
                    </span>
                    <span className="text-slate-400 font-mono">
                      Slot: {order.deliverySlot}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-extrabold text-sm text-white">
                              {item.productName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-red-600 text-white">
                              {item.weightKg} KG
                            </span>
                          </div>

                          {/* Cut & Bone tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {item.bonePreference === "boneless" ? "🥩 Boneless" : "🍖 With Bone"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              🔪 {item.preparationName || item.preparationId}
                            </span>
                          </div>

                          {item.cleaningPreferences?.length > 0 && (
                            <p className="text-[11px] text-slate-400 mt-2">
                              Wash: {item.cleaningPreferences.join(", ")}
                            </p>
                          )}

                          {item.specialInstructions && (
                            <p className="text-[11px] text-amber-300 italic mt-1.5 bg-amber-950/40 p-1.5 rounded border border-amber-900/50">
                              Note: "{item.specialInstructions}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Advancement Controls */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={`/tracking/${order.id}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1"
                  >
                    View Live GPS Radar →
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === "placed" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "prepping")}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <HiScissors className="w-4 h-4" />
                        <span>Accept & Start Cutting</span>
                      </button>
                    )}

                    {order.status === "prepping" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "packed")}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <HiCube className="w-4 h-4" />
                        <span>Mark Packed & Chilled</span>
                      </button>
                    )}

                    {order.status === "packed" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "out_for_delivery")}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <HiTruck className="w-4 h-4" />
                        <span>Handover to Delivery Boy</span>
                      </button>
                    )}

                    {order.status === "out_for_delivery" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <HiCheckCircle className="w-4 h-4" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <HiCheckCircle className="w-4 h-4" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
