import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current active role: 'customer' | 'admin' | 'delivery'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem("meat_shop_role") || "customer";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("meat_shop_user");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Vignesh Raj",
          phone: "+91 98402 88910",
          email: "vignesh.raj@example.com",
          address: "Flat 3A, Green Meadows, 5th Cross, Indiranagar, Bengaluru",
          pincode: "560038"
        };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("meat_shop_role", currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem("meat_shop_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role) => {
    setCurrentRole(role);
  };

  const updateUser = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        switchRole,
        currentUser,
        updateUser,
        isLoginModalOpen,
        setIsLoginModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
