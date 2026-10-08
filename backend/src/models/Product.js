import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ==========================================
    // SHOP
    // ==========================================

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },


    // ==========================================
    // CATEGORY
    // ==========================================

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },


    // ==========================================
    // FISH TYPE
    // Only required when category is Fish
    // ==========================================

    fishTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FishType",
      default: null,
      index: true,
    },


    // ==========================================
    // PREPARATION TYPE
    // ==========================================

    preparationTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreparationType",
      default: null,
      index: true,
    },


    // ==========================================
    // BASIC PRODUCT INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },


    // ==========================================
    // MEAT TYPE
    // ==========================================

    meatType: {
      type: String,
      enum: [
        "chicken",
        "mutton",
        "beef",
        "fish",
        "other",
      ],
      required: true,
    },


    // ==========================================
    // BONE OPTIONS
    // ==========================================

    boneOptions: {
      type: [
        {
          type: String,
          enum: [
            "with_bone",
            "boneless",
          ],
        },
      ],
      default: ["with_bone"],
    },


    // ==========================================
    // PRICING
    // ==========================================

    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },

    bonelessPricePerKg: {
      type: Number,
      default: null,
      min: 0,
    },


    // ==========================================
    // INVENTORY
    // ==========================================

    stockKg: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThresholdKg: {
      type: Number,
      default: 2,
      min: 0,
    },


    // ==========================================
    // ORDER QUANTITY
    // ==========================================

    minimumQuantityKg: {
      type: Number,
      default: 0.25,
      min: 0.05,
    },

    quantityStepKg: {
      type: Number,
      default: 0.25,
      min: 0.05,
    },


    // ==========================================
    // IMAGES
    // ==========================================

    images: {
      type: [String],
      default: [],
    },


    // ==========================================
    // STATUS
    // ==========================================

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

productSchema.index({
  shopId: 1,
  categoryId: 1,
});

productSchema.index({
  shopId: 1,
  fishTypeId: 1,
});

productSchema.index({
  shopId: 1,
  preparationTypeId: 1,
});

productSchema.index({
  shopId: 1,
  meatType: 1,
});

productSchema.index({
  shopId: 1,
  isAvailable: 1,
});


// ==========================================
// MODEL
// ==========================================

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;