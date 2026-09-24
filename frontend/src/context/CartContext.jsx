import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("meat_shop_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("meat_shop_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Add a customized meat item to cart
   */
  const addToCart = (product, customization) => {
    const {
      weightKg = 1.0,
      bonePreference = "with_bone",
      preparationId = "sukka",
      preparationName = "Sukka Cut",
      cleaningPreferences = [],
      specialInstructions = ""
    } = customization;

    const unitPricePerKg =
      bonePreference === "boneless" && product.supportsBoneless
        ? product.bonelessPricePerKg
        : product.basePricePerKg;

    const itemTotal = Math.round(unitPricePerKg * weightKg);

    // Unique key for the specific cut configuration
    const cartItemId = `${product.id}-${bonePreference}-${preparationId}-${weightKg}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        // Increment quantity of this specific cut
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + 1;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: Math.round(existing.itemTotal * newQty)
        };
        return updated;
      } else {
        const newItem = {
          cartItemId,
          productId: product.id,
          productName: product.name,
          tamilName: product.tamilName,
          category: product.category,
          image: product.image,
          weightKg,
          bonePreference,
          preparationId,
          preparationName,
          cleaningPreferences,
          specialInstructions,
          unitPricePerKg,
          itemTotal,
          quantity: 1,
          subtotal: itemTotal
        };
        return [...prev, newItem];
      }
    });

    toast.success(`Added ${weightKg}kg ${preparationName} to cart! 🥩`, {
      style: {
        borderRadius: "12px",
        background: "#1f2937",
        color: "#fff",
        fontWeight: "500",
        fontSize: "14px"
      }
    });
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: Math.round(item.itemTotal * newQty)
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const cartTotalWeightKg = cartItems.reduce(
    (sum, item) => sum + item.weightKg * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartTotalAmount,
        cartTotalWeightKg
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
