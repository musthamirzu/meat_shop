import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { INITIAL_ORDERS } from "../data/mockData";

const OrderContext = createContext();

// Shop Origin Coordinates (Meat Hub)
export const SHOP_LOCATION = {
  name: "Supreme Fresh Meat Hub",
  address: "Shop #4, Metro Road, Koramangala, Bengaluru",
  lat: 12.9352,
  lng: 77.6245
};

// Customer Destination Default
export const DEFAULT_CUSTOMER_LOCATION = {
  name: "Customer Home",
  address: "Flat 3A, Green Meadows, Indiranagar, Bengaluru",
  lat: 12.9716,
  lng: 77.6412
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("meat_shop_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem("meat_shop_orders", JSON.stringify(orders));
  }, [orders]);

  /**
   * High quality Browser Web Audio API order bell chime (Ding-Dong)
   * Plays automatically without needing external mp3 files
   */
  const playOrderSoundChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // First tone (high chime)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0.4, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.4);

      // Second tone (warm bell resolve)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(587.33, ctx.currentTime + 0.18); // D5 note
      gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio chime cannot autoplay yet:", e);
    }
  };

  /**
   * Place an order from Customer Checkout
   */
  const placeOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      placedAt: "Just now",
      createdAt: new Date().toISOString(),
      status: "placed", // 'placed' | 'prepping' | 'packed' | 'out_for_delivery' | 'delivered'
      customerName: orderData.customerName || "Vignesh Raj",
      customerPhone: orderData.customerPhone || "+91 98402 88910",
      deliveryAddress: orderData.deliveryAddress || "Flat 3A, Green Meadows, Indiranagar",
      deliverySlot: orderData.deliverySlot || "Instant Express (30-40 Mins)",
      paymentMethod: orderData.paymentMethod || "UPI (Google Pay)",
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      deliveryBoy: {
        name: "Murugan Selvam",
        phone: "+91 97890 54321",
        bikeModel: "Honda Activa (KA 03 EX 9921)",
        currentLat: SHOP_LOCATION.lat,
        currentLng: SHOP_LOCATION.lng,
        progress: 0, // 0 to 100%
        etaMinutes: 32,
        distanceKm: 4.6
      }
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Trigger Admin Sound Alert
    playOrderSoundChime();

    setLastNotification({
      title: "New Meat Order Placed! 🥩",
      message: `Order #${orderId} for ${newOrder.customerName}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    toast.success(`Order #${orderId} placed successfully! 🎉`, {
      duration: 4000,
      icon: "🥩"
    });

    return orderId;
  };

  /**
   * Update order status (by Admin or Delivery Partner)
   */
  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: nextStatus
          };
        }
        return order;
      })
    );

    const statusLabels = {
      placed: "Order Received",
      prepping: "Cutting & Prepping Meat",
      packed: "Order Packed & Ready",
      out_for_delivery: "Out for Delivery (Rider Dispatched)",
      delivered: "Order Delivered"
    };

    toast(`Order #${orderId}: ${statusLabels[nextStatus] || nextStatus}`, {
      icon: nextStatus === "delivered" ? "✅" : "🔔",
      style: {
        borderRadius: "12px",
        background: "#1e293b",
        color: "#fff"
      }
    });
  };

  /**
   * Update Delivery Boy GPS coordinate simulation
   * interpolating between SHOP and CUSTOMER home
   */
  const updateDeliveryProgress = (orderId, progressPct) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const clamped = Math.min(100, Math.max(0, progressPct));
          const factor = clamped / 100;

          // Linear interpolation between shop & customer coordinates
          const curLat = SHOP_LOCATION.lat + (DEFAULT_CUSTOMER_LOCATION.lat - SHOP_LOCATION.lat) * factor;
          const curLng = SHOP_LOCATION.lng + (DEFAULT_CUSTOMER_LOCATION.lng - SHOP_LOCATION.lng) * factor;

          const totalDistance = 4.6;
          const remainingDistance = Math.max(0, (totalDistance * (1 - factor))).toFixed(1);
          const remainingEta = Math.max(1, Math.round(30 * (1 - factor)));

          const updatedStatus =
            clamped >= 100
              ? "delivered"
              : clamped > 0
              ? "out_for_delivery"
              : order.status;

          return {
            ...order,
            status: updatedStatus,
            deliveryBoy: {
              ...order.deliveryBoy,
              currentLat: curLat,
              currentLng: curLng,
              progress: clamped,
              distanceKm: parseFloat(remainingDistance),
              etaMinutes: remainingEta
            }
          };
        }
        return order;
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        updateDeliveryProgress,
        playOrderSoundChime,
        lastNotification,
        SHOP_LOCATION,
        DEFAULT_CUSTOMER_LOCATION
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
