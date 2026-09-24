import { useState } from "react";
import {
  HiOutlineMapPin,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiChevronDown,
  HiOutlineShoppingBag,
  HiSparkles
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import RoleSwitcher from "../../components/common/RoleSwitcher";

const HomeHeader = () => {
  const { currentUser, setIsLoginModalOpen, currentRole } = useAuth();
  const { cartItemCount, setIsCartOpen } = useCart();
  const { orders } = useOrders();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "delivered"
  ).length;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Location Dropdown */}
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="flex items-center gap-2 sm:gap-3 text-left max-w-[200px] sm:max-w-xs"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs">
            <HiOutlineMapPin size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
                {currentUser?.address?.split(",")[0] || "Indiranagar"}
              </span>
              <HiChevronDown size={14} className="text-red-600 flex-shrink-0" />
            </div>

            <p className="text-[11px] text-gray-500 truncate">
              {currentUser?.address || "Click to set delivery location"}
            </p>
          </div>
        </button>

        {/* Center Role Switcher */}
        <div className="hidden md:block">
          <RoleSwitcher />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-800 transition hover:bg-red-50 hover:text-red-600"
          >
            <HiOutlineShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-md animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-700 transition hover:bg-gray-100"
          >
            <HiOutlineUserCircle size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher strip */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5 flex justify-center">
        <RoleSwitcher />
      </div>

      {/* Location Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Select Delivery Address
            </h3>
            <p className="text-xs text-gray-500">
              Our fresh meat is sourced and delivered within 10 km radius in temperature-controlled bags.
            </p>
            <div className="space-y-2">
              <div
                onClick={() => setIsAddressModalOpen(false)}
                className="p-3 rounded-2xl border-2 border-red-600 bg-red-50/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">🏠 Home</span>
                  <span className="text-[10px] font-bold text-red-600">Active</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {currentUser?.address}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeHeader;