import mongoose from "mongoose";

const fishTypeSchema = new mongoose.Schema(
  {
    // Shop that sells this fish
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    // English/common name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Tamil/local name
    localName: {
      type: String,
      default: "",
      trim: true,
    },

    // URL-friendly name
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

    image: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
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


// Same fish can exist in multiple shops,
// but not twice inside one shop.

fishTypeSchema.index(
  {
    shopId: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);


const FishType = mongoose.model(
  "FishType",
  fishTypeSchema
);

export default FishType;