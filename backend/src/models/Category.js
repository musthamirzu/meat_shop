import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // Which shop owns this category
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    // Category name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // URL-friendly name
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Optional description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Category image
    image: {
      type: String,
      default: "",
    },

    // Display ordering
    sortOrder: {
      type: Number,
      default: 0,
    },

    // Enable / disable category
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// Same category slug can exist in different shops,
// but not twice inside the same shop.

categorySchema.index(
  {
    shopId: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);


const Category = mongoose.model(
  "Category",
  categorySchema
);

export default Category;