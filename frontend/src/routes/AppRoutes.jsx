import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/customer/Home";
import OrderTrackingPage from "../pages/customer/OrderTrackingPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DeliveryDashboard from "../pages/delivery/DeliveryDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Storefront */}
      <Route path="/" element={<Home />} />

      {/* Live Order Tracking with GPS Map */}
      <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />

      {/* Admin Butcher Dashboard & Sound Alerts */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Delivery Boy GPS Tracking Portal */}
      <Route path="/delivery" element={<DeliveryDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;