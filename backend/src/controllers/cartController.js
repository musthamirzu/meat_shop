import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";


// ==========================================
// GET MY CART
// ==========================================

export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customerId: req.user._id,
    })
      .populate(
        "shopId",
        "name slug logo status isOpen deliveryAvailable minimumOrderAmount"
      )
      .populate(
        "items.productId",
        "name slug images meatType boneOptions pricePerKg bonelessPricePerKg minimumQuantityKg quantityStepKg isAvailable isActive"
      );

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          cart: null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// ==========================================
// ADD ITEM TO CART
// ==========================================

export const addToCart = async (req, res) => {
  try {
    const {
      productId,
      quantityKg,
      boneOption = "with_bone",
    } = req.body;

    if (!productId || !quantityKg) {
      return res.status(400).json({
        success: false,
        message: "Product and quantity are required",
      });
    }

    // --------------------------------------
    // GET PRODUCT
    // --------------------------------------

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
      isAvailable: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    // --------------------------------------
    // CHECK SHOP
    // --------------------------------------

    const shop = await Shop.findOne({
      _id: product.shopId,
      status: "active",
    });

    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Shop is not available",
      });
    }

    if (!shop.isOpen) {
      return res.status(400).json({
        success: false,
        message: "Shop is currently closed",
      });
    }

    // --------------------------------------
    // VALIDATE BONE OPTION
    // --------------------------------------

    if (
      !product.boneOptions.includes(boneOption)
    ) {
      return res.status(400).json({
        success: false,
        message: `This product does not support ${boneOption}`,
      });
    }

    // --------------------------------------
    // VALIDATE QUANTITY
    // --------------------------------------

    if (
      quantityKg < product.minimumQuantityKg
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum quantity is ${product.minimumQuantityKg} kg`,
      });
    }

    const step = product.quantityStepKg || 0.25;

    const remainder =
      quantityKg % step;

    if (Math.abs(remainder) > 0.00001) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be in ${step} kg increments`,
      });
    }

    // --------------------------------------
    // DETERMINE PRICE
    // --------------------------------------

    let pricePerKg = product.pricePerKg;

    if (
      boneOption === "boneless"
    ) {
      if (product.bonelessPricePerKg == null) {
        return res.status(400).json({
          success: false,
          message: "Boneless option is not available",
        });
      }

      pricePerKg =
        product.bonelessPricePerKg;
    }

    const subtotal =
      quantityKg * pricePerKg;

    // --------------------------------------
    // FIND CUSTOMER CART
    // --------------------------------------

    let cart = await Cart.findOne({
      customerId: req.user._id,
    });

    // --------------------------------------
    // CREATE CART
    // --------------------------------------

    if (!cart) {
      cart = await Cart.create({
        customerId: req.user._id,
        shopId: product.shopId,
        items: [
          {
            productId,
            quantityKg,
            boneOption,
            pricePerKg,
            subtotal,
          },
        ],
        subtotal,
      });

      await cart.populate([
        {
          path: "shopId",
          select:
            "name slug logo status isOpen deliveryAvailable minimumOrderAmount",
        },
        {
          path: "items.productId",
          select:
            "name slug images meatType boneOptions pricePerKg bonelessPricePerKg",
        },
      ]);

      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: {
          cart,
        },
      });
    }

    // --------------------------------------
    // IMPORTANT:
    // CART CAN ONLY CONTAIN ONE SHOP
    // --------------------------------------

    if (
      cart.shopId.toString() !==
      product.shopId.toString()
    ) {
      return res.status(409).json({
        success: false,
        code: "DIFFERENT_SHOP_CART",
        message:
          "Your cart contains items from another shop",
        currentShopId: cart.shopId,
        requestedShopId: product.shopId,
      });
    }

    // --------------------------------------
    // FIND EXISTING ITEM
    // --------------------------------------

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() ===
          productId.toString() &&
        item.boneOption === boneOption
    );

    if (existingItem) {
      existingItem.quantityKg += quantityKg;

      existingItem.pricePerKg =
        pricePerKg;

      existingItem.subtotal =
        existingItem.quantityKg *
        pricePerKg;
    } else {
      cart.items.push({
        productId,
        quantityKg,
        boneOption,
        pricePerKg,
        subtotal,
      });
    }

    // --------------------------------------
    // RECALCULATE CART
    // --------------------------------------

    cart.subtotal = cart.items.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );

    await cart.save();

    await cart.populate([
      {
        path: "shopId",
        select:
          "name slug logo status isOpen deliveryAvailable minimumOrderAmount",
      },
      {
        path: "items.productId",
        select:
          "name slug images meatType boneOptions pricePerKg bonelessPricePerKg",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};