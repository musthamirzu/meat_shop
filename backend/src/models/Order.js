import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    quantityKg: {
      type: Number,
      required: true,
      min: 0.01,
    },

    boneOption: {
      type: String,
      enum: ["with_bone", "boneless"],
      required: true,
    },

    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);


const deliveryAddressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,

    addressLine1: String,
    addressLine2: String,

    area: String,
    city: String,
    state: String,
    pincode: String,

    landmark: String,

    latitude: Number,
    longitude: Number,
  },
  {
    _id: false,
  }
);


const orderSchema = new mongoose.Schema(
  {
    // ======================================
    // CUSTOMER
    // ======================================

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    // ======================================
    // SHOP
    // ======================================

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },


    // ======================================
    // DELIVERY BOY
    // ======================================

    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },


    // ======================================
    // ORDER NUMBER
    // ======================================

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },


    // ======================================
    // ITEMS
    // ======================================

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },


    // ======================================
    // DELIVERY ADDRESS SNAPSHOT
    // ======================================

    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true,
    },


    // ======================================
    // AMOUNTS
    // ======================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },


    // ======================================
    // PAYMENT
    // ======================================

    paymentMethod: {
      type: String,
      enum: [
        "cod",
        "upi",
        "card",
        "netbanking",
      ],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },


    // ======================================
    // ORDER STATUS
    // ======================================

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "placed",
      index: true,
    },


    // ======================================
    // TIMESTAMPS
    // ======================================

    placedAt: {
      type: Date,
      default: Date.now,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    preparingAt: {
      type: Date,
      default: null,
    },

    readyForPickupAt: {
      type: Date,
      default: null,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Order", orderSchema);