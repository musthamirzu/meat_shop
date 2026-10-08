import Category from "../models/Category.js";
import Shop from "../models/Shop.js";

// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async (req, res) => {
  try {
    const {
      shopId,
      name,
      slug,
      description,
      image,
      sortOrder,
    } = req.body;

    // ----------------------------------------
    // Determine which shop this request is for
    // ----------------------------------------

    let targetShopId = shopId;

    // Shop admin can only use their own shop
    if (req.user.role === "shop_admin") {
      targetShopId = req.user.shopId;
    }

    if (!targetShopId) {
      return res.status(400).json({
        success: false,
        message: "shopId is required",
      });
    }

    // ----------------------------------------
    // Check shop exists
    // ----------------------------------------

    const shop = await Shop.findById(targetShopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // ----------------------------------------
    // Validate name
    // ----------------------------------------

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // ----------------------------------------
    // Generate slug if not provided
    // ----------------------------------------

    const categorySlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // ----------------------------------------
    // Check duplicate category
    // ----------------------------------------

    const existingCategory = await Category.findOne({
      shopId: targetShopId,
      slug: categorySlug,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists in this shop",
      });
    }

    // ----------------------------------------
    // Create category
    // ----------------------------------------

    const category = await Category.create({
      shopId: targetShopId,
      name,
      slug: categorySlug,
      description,
      image,
      sortOrder,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};


// ==========================================
// GET CATEGORIES
// ==========================================

export const getCategories = async (req, res) => {
  try {
    const { shopId } = req.query;

    let targetShopId = shopId;

    // Shop admin can only see own shop
    if (req.user.role === "shop_admin") {
      targetShopId = req.user.shopId;
    }

    if (!targetShopId) {
      return res.status(400).json({
        success: false,
        message: "shopId is required",
      });
    }

    const categories = await Category.find({
      shopId: targetShopId,
    }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get categories",
    });
  }
};


// ==========================================
// GET SINGLE CATEGORY
// ==========================================

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Shop admin can only access own category
    if (
      req.user.role === "shop_admin" &&
      category.shopId.toString() !== req.user.shopId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this category",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get category",
    });
  }
};


// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ----------------------------------------
    // Shop ownership check
    // ----------------------------------------

    if (
      req.user.role === "shop_admin" &&
      category.shopId.toString() !== req.user.shopId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this category",
      });
    }

    const {
      name,
      slug,
      description,
      image,
      sortOrder,
      isActive,
    } = req.body;

    // ----------------------------------------
    // Check duplicate slug
    // ----------------------------------------

    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({
        shopId: category.shopId,
        slug,
        _id: { $ne: id },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Category slug already exists",
        });
      }
    }

    // ----------------------------------------
    // Update
    // ----------------------------------------

    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined)
      category.description = description;
    if (image !== undefined) category.image = image;
    if (sortOrder !== undefined)
      category.sortOrder = sortOrder;
    if (isActive !== undefined)
      category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};


// ==========================================
// DELETE CATEGORY
// ==========================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ----------------------------------------
    // Shop ownership check
    // ----------------------------------------

    if (
      req.user.role === "shop_admin" &&
      category.shopId.toString() !== req.user.shopId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this category",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

export const getPublicShopCategories = async (req, res) => {
  try {
    const { shopId } = req.params;

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

    const categories = await Category.find({
      shopId,
      isActive: true,
    })
      .select(
        "name slug description image sortOrder isActive"
      )
      .sort({
        sortOrder: 1,
        name: 1,
      });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error(
      "Get public shop categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop categories",
    });
  }
};


// ==========================================
// UPDATE CART ITEM
// ==========================================

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantityKg, boneOption } = req.body;

    if (!quantityKg) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findOne({
      _id: item.productId,
      isActive: true,
      isAvailable: true,
    });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is no longer available",
      });
    }

    const selectedBoneOption =
      boneOption || item.boneOption;

    if (
      !product.boneOptions.includes(
        selectedBoneOption
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected bone option is not available",
      });
    }

    if (
      quantityKg < product.minimumQuantityKg
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum quantity is ${product.minimumQuantityKg} kg`,
      });
    }

    const step =
      product.quantityStepKg || 0.25;

    const remainder =
      quantityKg % step;

    if (Math.abs(remainder) > 0.00001) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be in ${step} kg increments`,
      });
    }

    let pricePerKg = product.pricePerKg;

    if (selectedBoneOption === "boneless") {
      if (product.bonelessPricePerKg == null) {
        return res.status(400).json({
          success: false,
          message: "Boneless option is not available",
        });
      }

      pricePerKg =
        product.bonelessPricePerKg;
    }

    item.quantityKg = quantityKg;
    item.boneOption = selectedBoneOption;
    item.pricePerKg = pricePerKg;

    item.subtotal =
      quantityKg * pricePerKg;

    cart.subtotal = cart.items.reduce(
      (total, cartItem) =>
        total + cartItem.subtotal,
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
          "name slug images meatType boneOptions pricePerKg bonelessPricePerKg minimumQuantityKg quantityStepKg",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

// ==========================================
// REMOVE CART ITEM
// ==========================================

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.deleteOne();

    cart.subtotal = cart.items.reduce(
      (total, cartItem) =>
        total + cartItem.subtotal,
      0
    );

    // If cart becomes empty, remove it completely.
    if (cart.items.length === 0) {
      await Cart.deleteOne({
        _id: cart._id,
      });

      return res.status(200).json({
        success: true,
        message: "Cart item removed",
        data: {
          cart: null,
        },
      });
    }

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
      message: "Cart item removed",
      data: {
        cart,
      },
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });
  }
};

// ==========================================
// CLEAR CART
// ==========================================

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        data: {
          cart: null,
        },
      });
    }

    await Cart.deleteOne({
      _id: cart._id,
    });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {
        cart: null,
      },
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};