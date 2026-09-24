import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <OrderProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: {
                  background: "#1e293b",
                  color: "#fff",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontWeight: 600,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                }
              }}
            />
            <AppRoutes />
          </OrderProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
