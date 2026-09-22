import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiMapPin,
  HiArrowRight
} from "react-icons/hi2";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount, cartTotalAmount, cartTotalWeightKg, setIsCartOpen } = useCart();
  const { orders } = useOrders();
  const { setIsLoginModalOpen } = useAuth();

  const activeOrder = orders.find((o) => o.status !== "delivered") || orders[0];

  const navigation = [
    {
      label: "Home",
      icon: HiOutlineHome,
      path: "/",
      action: () => navigate("/")
    },
    {
      label: "Live Track",
      icon: HiMapPin,
      badge: activeOrder?.status !== "delivered" ? "Live" : null,
      path: activeOrder ? `/tracking/${activeOrder.id}` : "/",
      action: () => {
        if (activeOrder) navigate(`/tracking/${activeOrder.id}`);
        else navigate("/");
      }
    },
    {
      label: "Cart",
      icon: HiOutlineShoppingCart,
      count: cartItemCount,
      action: () => setIsCartOpen(true)
    },
    {
      label: "Profile",
      icon: HiOutlineUser,
      action: () => setIsLoginModalOpen(true)
    }
  ];

  return (
    <>
      {/* Swiggy Style Floating Cart Bar (Appears when cart has items) */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-red-600/40 flex items-center justify-between transition-all transform active:scale-98 animate-bounce-subtle"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                  {cartItemCount}
                </div>
                <div className="text-left">
                  <div className="text-sm font-extrabold flex items-center gap-1.5">
                    <span>₹{cartTotalAmount}</span>
                    <span className="text-xs font-normal opacity-80">
                      • {cartTotalWeightKg.toFixed(1)} kg meat
                    </span>
                  </div>
                  <p className="text-[10px] text-red-100 uppercase tracking-wider font-semibold">
                    Express Cut & Pack
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl">
                <span>View Cart</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom App Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md px-2 py-1.5 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.path && location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`relative flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                  isActive ? "text-red-600 font-bold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <div className="relative">
                  <Icon size={22} />
                  {item.count > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="absolute -top-1 -right-3 flex h-3 px-1 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;