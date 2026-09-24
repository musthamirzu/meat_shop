import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiShieldCheck, HiPhone, HiLockClosed } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, switchRole, updateUser } = useAuth();
  const [roleTab, setRoleTab] = useState("customer");
  const [phone, setPhone] = useState("9840288910");
  const [adminPassword, setAdminPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  if (!isLoginModalOpen) return null;

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      toast.success("OTP sent to your phone: 1234");
      return;
    }

    if (otp === "1234" || otp.length >= 4) {
      switchRole("customer");
      updateUser({ phone: `+91 ${phone}` });
      toast.success("Logged in as Customer! 🥩");
      setIsLoginModalOpen(false);
    } else {
      toast.error("Invalid OTP. Try 1234");
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123" || adminPassword.length > 0) {
      switchRole("admin");
      toast.success("Welcome to Admin Butcher Hub! 🔪");
      setIsLoginModalOpen(false);
    } else {
      toast.error("Please enter admin password");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <HiXMark className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold">Login to Meat Shop</h2>
            <p className="text-xs text-red-200 mt-0.5">
              Access your orders, live tracking & fresh cuts
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Role Tabs */}
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setRoleTab("customer");
                  setOtpSent(false);
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  roleTab === "customer"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🛒 Customer
              </button>
              <button
                onClick={() => setRoleTab("admin")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  roleTab === "admin"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🔪 Admin Portal
              </button>
            </div>

            {roleTab === "customer" ? (
              <form onSubmit={handleCustomerLogin} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Mobile Number
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
                    <span className="bg-gray-100 text-xs font-bold text-gray-600 px-3 py-2.5 border-r border-gray-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10 digit number"
                      className="flex-1 p-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Enter OTP (Test: 1234)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-center tracking-widest font-bold text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {otpSent ? "Verify & Continue" : "Get OTP Verification"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Admin Key / Password
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-red-500 px-3">
                    <HiLockClosed className="text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password (e.g. admin123)"
                      className="flex-1 p-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  Access Live Butcher Board
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
