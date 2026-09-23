import Shop from "../models/Shop.js";

// Create a new shop
export const createShop = async (req, res) => {
  try {
    const {
      name,
      slug,
      logo,
      phone,
      email,
      address,
      minimumOrderAmount,
    } = req.body;

    // Basic validation
    if (!name || !slug || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and phone are required",
      });
    }

    // Check whether slug already exists
    const existingShop = await Shop.findOne({ slug });

    if (existingShop) {
      return res.status(409).json({
        success: false,
        message: "A shop with this slug already exists",
      });
    }

    const shop = await Shop.create({
      name,
      slug,
      logo,
      phone,
      email,
      address,
      minimumOrderAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Create shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create shop",
    });
  }
};


// Get all shops
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error("Get shops error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
};


// Get single shop
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.error("Get shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
};


// Update shop
export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const allowedFields = [
      "name",
      "slug",
      "logo",
      "phone",
      "email",
      "address",
      "status",
      "isOpen",
      "deliveryAvailable",
      "minimumOrderAmount",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        shop[field] = req.body[field];
      }
    });

    await shop.save();

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Update shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update shop",
    });
  }
};