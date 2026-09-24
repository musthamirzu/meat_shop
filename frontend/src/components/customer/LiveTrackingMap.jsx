import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiMapPin, HiClock, HiPhone, HiShieldCheck } from "react-icons/hi2";
import { FaMotorcycle } from "react-icons/fa";

const LiveTrackingMap = ({ order, onProgressUpdate }) => {
  const deliveryBoy = order?.deliveryBoy || {
    name: "Murugan Selvam",
    phone: "+91 97890 54321",
    bikeModel: "Honda Activa (KA 03 EX 9921)",
    progress: 45,
    etaMinutes: 18,
    distanceKm: 2.8
  };

  const progress = deliveryBoy.progress ?? 40;
  const isDelivered = order?.status === "delivered" || progress >= 100;

  // Path SVG coordinates for realistic city road path
  // Start (Shop): (40, 160)
  // Turn 1: (120, 140)
  // Turn 2: (180, 80)
  // Turn 3: (260, 110)
  // End (Customer): (340, 40)

  // Approximate parametric point along the path based on progress 0..100
  const getPositionOnPath = (pct) => {
    const t = Math.min(1, Math.max(0, pct / 100));
    // Piecewise bezier approximation for smooth bike translation
    const startX = 50;
    const startY = 170;
    const endX = 350;
    const endY = 40;

    // Intermediate waypoints
    const midX1 = 130, midY1 = 150;
    const midX2 = 210, midY2 = 80;
    const midX3 = 290, midY3 = 110;

    let x, y;
    if (t < 0.33) {
      const segT = t / 0.33;
      x = startX + (midX1 - startX) * segT;
      y = startY + (midY1 - startY) * segT;
    } else if (t < 0.66) {
      const segT = (t - 0.33) / 0.33;
      x = midX1 + (midX2 - midX1) * segT;
      y = midY1 + (midY2 - midY1) * segT;
    } else {
      const segT = (t - 0.66) / 0.34;
      x = midX2 + (endX - midX2) * segT;
      y = midY2 + (endY - midY2) * segT;
    }

    return { x, y };
  };

  const bikePos = getPositionOnPath(progress);

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
      {/* Top Map HUD info */}
      <div className="p-4 sm:p-5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white text-lg shadow-lg">
            <FaMotorcycle />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {isDelivered ? "Delivered at Doorstep" : "Delivery Partner On The Way"}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400">
              {deliveryBoy.name} • {deliveryBoy.bikeModel}
            </p>
          </div>
        </div>

        <a
          href={`tel:${deliveryBoy.phone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition-colors"
        >
          <HiPhone className="w-3.5 h-3.5" />
          <span>Call Rider</span>
        </a>
      </div>

      {/* Simulated GPS Vector Road Map */}
      <div className="relative h-64 sm:h-72 w-full bg-[#111827] overflow-hidden select-none">
        {/* Street Grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ambient Map Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Route Geometry */}
        <svg
          viewBox="0 0 400 220"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background Street lines */}
          <line x1="20" y1="50" x2="380" y2="50" stroke="#1f2937" strokeWidth="6" />
          <line x1="20" y1="120" x2="380" y2="120" stroke="#1f2937" strokeWidth="8" />
          <line x1="20" y1="180" x2="380" y2="180" stroke="#1f2937" strokeWidth="6" />
          <line x1="80" y1="10" x2="80" y2="210" stroke="#1f2937" strokeWidth="6" />
          <line x1="240" y1="10" x2="240" y2="210" stroke="#1f2937" strokeWidth="6" />
          <line x1="320" y1="10" x2="320" y2="210" stroke="#1f2937" strokeWidth="6" />

          {/* Active Navigation Polyline */}
          <path
            d="M 50 170 L 130 150 L 210 80 L 290 110 L 350 40"
            fill="none"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
            className="opacity-75"
          />

          {/* Traveled Glow Track */}
          <path
            d="M 50 170 L 130 150 L 210 80 L 290 110 L 350 40"
            fill="none"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="400"
            strokeDashoffset={400 - (progress / 100) * 400}
            className="transition-all duration-300"
          />

          {/* Shop Pin (Origin) */}
          <g transform="translate(50, 170)">
            <circle r="14" fill="#991b1b" className="animate-pulse opacity-40" />
            <circle r="8" fill="#ef4444" />
            <text x="0" y="24" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
              Meat Hub 🥩
            </text>
          </g>

          {/* Customer Home Pin (Destination) */}
          <g transform="translate(350, 40)">
            <circle r="16" fill="#047857" className="animate-ping opacity-30" />
            <circle r="9" fill="#10b981" />
            <text x="0" y="-14" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">
              Your Home 🏠
            </text>
          </g>

          {/* Moving Delivery Partner Bike Marker */}
          <g
            transform={`translate(${bikePos.x}, ${bikePos.y})`}
            className="transition-transform duration-300 ease-out"
          >
            {/* Pulse Radar Ring */}
            <circle r="18" fill="#f59e0b" className="animate-ping opacity-35" />
            <circle r="13" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontSize="11"
              dominantBaseline="middle"
            >
              🛵
            </text>
            <rect
              x="-28"
              y="-28"
              width="56"
              height="16"
              rx="8"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x="0"
              y="-17"
              fill="#fbbf24"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
            >
              {deliveryBoy.distanceKm} km away
            </text>
          </g>
        </svg>

        {/* Live GPS Watermark */}
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Live GPS Satellite Sync • 24.8 km/h</span>
        </div>
      </div>

      {/* Bottom Live Metrics & Progress Controls */}
      <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Estimated Time
            </p>
            <p className="text-base sm:text-lg font-extrabold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <HiClock className="w-4 h-4" />
              <span>{isDelivered ? "Arrived" : `${deliveryBoy.etaMinutes} mins`}</span>
            </p>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Remaining Distance
            </p>
            <p className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center gap-1 mt-0.5">
              <HiMapPin className="w-4 h-4 text-red-500" />
              <span>{isDelivered ? "0 km" : `${deliveryBoy.distanceKm} km`}</span>
            </p>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Hygiene & Box
            </p>
            <p className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-1">
              <HiShieldCheck className="w-4 h-4" />
              <span>Cold Box 4°C</span>
            </p>
          </div>
        </div>

        {/* Interactive Simulation Slider for Demo / Testing */}
        {onProgressUpdate && (
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300">
                🎮 Live Delivery Rider Simulation Slider:
              </span>
              <span className="font-mono text-amber-400">{Math.round(progress)}% Journey</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => onProgressUpdate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingMap;
