import bcrypt from "bcryptjs";

import User from "../models/User.js";


// ==========================================
// CREATE DELIVERY BOY
// ==========================================

export const createDeliveryBoy = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    const shopId = req.user.shopId;

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to a shop",
      });
    }

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone and password are required",
      });
    }

    // --------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------

    const existingUser = await User.findOne({
      $or: [
        { phone },
        ...(email
          ? [{ email: email.toLowerCase() }]
          : []),
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // --------------------------------------
    // HASH PASSWORD
    // --------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // --------------------------------------
    // CREATE DELIVERY BOY
    // --------------------------------------

    const deliveryBoy = await User.create({
      name,
      email: email?.toLowerCase(),
      phone,
      password: hashedPassword,

      role: "delivery_boy",

      // IMPORTANT:
      // Always use the logged-in shop admin's shop.
      shopId,

      isActive: true,
      isVerified: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "Delivery boy created successfully",
      data: {
        deliveryBoy: {
          id: deliveryBoy._id,
          name: deliveryBoy.name,
          email: deliveryBoy.email,
          phone: deliveryBoy.phone,
          role: deliveryBoy.role,
          shopId: deliveryBoy.shopId,
          isActive: deliveryBoy.isActive,
        },
      },
    });
  } catch (error) {
    console.error(
      "Create delivery boy error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create delivery boy",
    });
  }
};


// ==========================================
// GET SHOP DELIVERY BOYS
// ==========================================

export const getShopDeliveryBoys = async (
  req,
  res
) => {
  try {
    const shopId = req.user.shopId;

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to a shop",
      });
    }

    const deliveryBoys = await User.find({
      role: "delivery_boy",
      shopId,
    })
      .select(
        "name email phone isActive isVerified lastLoginAt createdAt"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: deliveryBoys.length,
      data: {
        deliveryBoys,
      },
    });
  } catch (error) {
    console.error(
      "Get delivery boys error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch delivery boys",
    });
  }
};


// ==========================================
// UPDATE DELIVERY BOY STATUS
// ==========================================

export const updateDeliveryBoyStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const shopId = req.user.shopId;

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to a shop",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false",
      });
    }

    const deliveryBoy =
      await User.findOne({
        _id: id,
        role: "delivery_boy",
        shopId,
      });

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery boy not found",
      });
    }

    deliveryBoy.isActive = isActive;

    await deliveryBoy.save();

    return res.status(200).json({
      success: true,
      message:
        `Delivery boy ${
          isActive
            ? "activated"
            : "deactivated"
        } successfully`,
      data: {
        deliveryBoy: {
          id: deliveryBoy._id,
          name: deliveryBoy.name,
          phone: deliveryBoy.phone,
          isActive:
            deliveryBoy.isActive,
        },
      },
    });
  } catch (error) {
    console.error(
      "Update delivery boy status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update delivery boy status",
    });
  }
};