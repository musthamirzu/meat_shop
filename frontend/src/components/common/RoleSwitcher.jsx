import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RoleSwitcher = () => {
  const { currentRole, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (role) => {
    switchRole(role);
    if (role === "admin") navigate("/admin");
    else if (role === "delivery") navigate("/delivery");
    else navigate("/");
  };

  return (
    <div className="flex items-center bg-slate-900/90 text-white rounded-2xl p-1 shadow-lg border border-slate-700 text-xs backdrop-blur-md">
      <button
        onClick={() => handleSwitch("customer")}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
          currentRole === "customer"
            ? "bg-red-600 text-white shadow-md"
            : "text-slate-400 hover:text-white"
        }`}
      >
        🛒 Customer
      </button>

      <button
        onClick={() => handleSwitch("admin")}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
          currentRole === "admin"
            ? "bg-red-600 text-white shadow-md"
            : "text-slate-400 hover:text-white"
        }`}
      >
        🔪 Admin
      </button>

      <button
        onClick={() => handleSwitch("delivery")}
        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
          currentRole === "delivery"
            ? "bg-red-600 text-white shadow-md"
            : "text-slate-400 hover:text-white"
        }`}
      >
        🛵 Delivery
      </button>
    </div>
  );
};

export default RoleSwitcher;
