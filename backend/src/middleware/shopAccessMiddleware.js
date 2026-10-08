const checkShopAccess = (req, res, next) => {
  try {
    // Authentication should already have happened
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Platform admin can access every shop
    if (req.user.role === "platform_admin") {
      return next();
    }

    // Only shop admin should continue below
    if (req.user.role !== "shop_admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have shop access",
      });
    }

    // Shop admin must have a shopId
    if (!req.user.shopId) {
      return res.status(403).json({
        success: false,
        message: "Shop is not assigned to this account",
      });
    }

    // Compare logged-in user's shopId
    // with the shop ID in the URL
    if (req.user.shopId.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this shop",
      });
    }

    next();
  } catch (error) {
    console.error("Shop access error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify shop access",
    });
  }
};

export default checkShopAccess;