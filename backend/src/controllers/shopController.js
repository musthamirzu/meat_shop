import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import User from "../models/User.js";
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

      // Shop admin details
      adminName,
      adminEmail,
      adminPhone,
      adminPassword,
    } = req.body;

    // -----------------------------
    // Validate shop details
    // -----------------------------

    if (!name || !slug || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and phone are required",
      });
    }

    // -----------------------------
    // Validate admin details
    // -----------------------------

    if (
      !adminName ||
      !adminEmail ||
      !adminPhone ||
      !adminPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Admin name, email, phone and password are required",
      });
    }

    // -----------------------------
    // Check duplicate shop slug
    // -----------------------------

    const existingShop = await Shop.findOne({
      slug: slug.toLowerCase(),
    });

    if (existingShop) {
      return res.status(409).json({
        success: false,
        message: "A shop with this slug already exists",
      });
    }

    // -----------------------------
    // Check duplicate admin email
    // -----------------------------

    const existingEmail = await User.findOne({
      email: adminEmail.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Admin email is already registered",
      });
    }

    // -----------------------------
    // Check duplicate admin phone
    // -----------------------------

    const existingPhone = await User.findOne({
      phone: adminPhone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Admin phone number is already registered",
      });
    }

    // -----------------------------
    // Create shop
    // -----------------------------

    const shop = await Shop.create({
      name,
      slug: slug.toLowerCase(),
      logo,
      phone,
      email,
      address,
      minimumOrderAmount,
      status: "active",
    });

    // -----------------------------
    // Hash admin password
    // -----------------------------

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      12
    );

    // -----------------------------
    // Create shop admin
    // -----------------------------

    const shopAdmin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      phone: adminPhone,
      password: hashedPassword,
      role: "shop_admin",
      shopId: shop._id,
      isActive: true,
      isVerified: true,
    });

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      success: true,
      message: "Shop and shop admin created successfully",

      data: {
        shop,

        admin: {
          id: shopAdmin._id,
          name: shopAdmin.name,
          email: shopAdmin.email,
          phone: shopAdmin.phone,
          role: shopAdmin.role,
          shopId: shopAdmin.shopId,
        },
      },
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

export const getPublicShops = async (req, res) => {
  try {
    const shops = await Shop.find({
      status: "active",
    })
      .select(
        "name slug logo phone address status isOpen deliveryAvailable minimumOrderAmount"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: shops.length,
      data: {
        shops,
      },
    });
  } catch (error) {
    console.error("Get public shops error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
};


// ==========================================
// GET PUBLIC SHOP DETAILS
// ==========================================

export const getPublicShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findOne({
      _id: id,
      status: "active",
    }).select(
      "name slug logo phone email address status isOpen deliveryAvailable minimumOrderAmount"
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        shop,
      },
    });
  } catch (error) {
    console.error("Get public shop error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
};

// ==========================================
// GET PUBLIC SHOP CATEGORIES
// ==========================================



// ==========================================
// GET PUBLIC SHOP PRODUCTS
// ==========================================
