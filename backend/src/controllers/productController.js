import Product from "../models/Product.js";
import Shop from "../models/Shop.js";


// ==========================================
// PUBLIC SHOP PRODUCTS
// ==========================================

export const getPublicShopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;

    const {
      categoryId,
      fishTypeId,
      preparationTypeId,
      meatType,
      search,
    } = req.query;

    const shop = await Shop.findOne({
      _id: shopId,
      status: "active",
    }).select("_id");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const filter = {
      shopId,
      isActive: true,
      isAvailable: true,
    };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (fishTypeId) {
      filter.fishTypeId = fishTypeId;
    }

    if (preparationTypeId) {
      filter.preparationTypeId = preparationTypeId;
    }

    if (meatType) {
      filter.meatType = meatType;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name slug")
      .populate("fishTypeId", "name localName slug")
      .populate("preparationTypeId", "name slug")
      .sort({
        isFeatured: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Get public shop products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop products",
    });
  }
};