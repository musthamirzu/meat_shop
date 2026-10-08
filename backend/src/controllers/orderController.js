import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendNotificationToUser } from "../services/notificationService.js";
import {
  generateOrderNumber,
} from "../utils/generateOrderNumber.js";


// ==========================================
// CREATE ORDER
// ==========================================

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      addressId,
      paymentMethod = "cod",
    } = req.body;


    // ======================================
    // VALIDATE PAYMENT METHOD
    // ======================================

    if (paymentMethod !== "cod") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Only Cash on Delivery is currently available",
      });
    }


    // ======================================
    // GET CART
    // ======================================

    const cart = await Cart.findOne({
      customerId: req.user._id,
    }).session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }


    // ======================================
    // GET ADDRESS
    // ======================================

    const address = await Address.findOne({
      _id: addressId,
      customerId: req.user._id,
      isActive: true,
    }).session(session);

    if (!address) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Delivery address not found",
      });
    }


    // ======================================
    // GET SHOP
    // ======================================

    const shop = await Shop.findOne({
      _id: cart.shopId,
      status: "active",
    }).session(session);

    if (!shop) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Shop is no longer available",
      });
    }


    if (!shop.isOpen) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Shop is currently closed",
      });
    }


    if (!shop.deliveryAvailable) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Delivery is currently unavailable for this shop",
      });
    }


    // ======================================
    // RE-CHECK PRODUCTS
    // ======================================

    const orderItems = [];

    let subtotal = 0;


    for (const cartItem of cart.items) {
      const product = await Product.findOne({
        _id: cartItem.productId,
        shopId: cart.shopId,
        isActive: true,
        isAvailable: true,
      }).session(session);


      if (!product) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message:
            "One or more products in your cart are no longer available",
        });
      }


      // ------------------------------
      // Validate quantity
      // ------------------------------

      if (
        cartItem.quantityKg <
        product.minimumQuantityKg
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message:
            `${product.name} minimum quantity is ` +
            `${product.minimumQuantityKg} kg`,
        });
      }


      // ------------------------------
      // Determine current price
      // ------------------------------

      let pricePerKg =
        product.pricePerKg;


      if (
        cartItem.boneOption === "boneless"
      ) {
        if (
          product.bonelessPricePerKg == null
        ) {
          await session.abortTransaction();

          return res.status(400).json({
            success: false,
            message:
              `${product.name} no longer supports boneless`,
          });
        }

        pricePerKg =
          product.bonelessPricePerKg;
      }


      // ------------------------------
      // Calculate subtotal
      // ------------------------------

      const itemSubtotal =
        cartItem.quantityKg *
        pricePerKg;


      orderItems.push({
        productId: product._id,

        productName: product.name,

        quantityKg:
          cartItem.quantityKg,

        boneOption:
          cartItem.boneOption,

        pricePerKg,

        subtotal: itemSubtotal,
      });


      subtotal += itemSubtotal;
    }


    // ======================================
    // MINIMUM ORDER CHECK
    // ======================================

    if (
      subtotal <
      shop.minimumOrderAmount
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          `Minimum order amount is ₹${shop.minimumOrderAmount}`,
      });
    }


    // ======================================
    // DELIVERY FEE
    // ======================================

    // For v1 we keep this simple.
    // Later this will be calculated based
    // on distance/shop/delivery rules.

    const deliveryFee = 40;


    // ======================================
    // PLATFORM FEE
    // ======================================

    const platformFee = 0;


    // ======================================
    // DISCOUNT
    // ======================================

    const discount = 0;


    // ======================================
    // FINAL TOTAL
    // ======================================

    const totalAmount =
      subtotal +
      deliveryFee +
      platformFee -
      discount;


    // ======================================
    // CREATE ORDER
    // ======================================

    const order = await Order.create(
      [
        {
          customerId:
            req.user._id,

          shopId:
            cart.shopId,

          deliveryBoyId:
            null,

          orderNumber:
            generateOrderNumber(),

          items:
            orderItems,

          deliveryAddress: {
            name: address.name,
            phone: address.phone,

            addressLine1:
              address.addressLine1,

            addressLine2:
              address.addressLine2,

            area:
              address.area,

            city:
              address.city,

            state:
              address.state,

            pincode:
              address.pincode,

            landmark:
              address.landmark,

            latitude:
              address.latitude,

            longitude:
              address.longitude,
          },

          subtotal,

          deliveryFee,

          platformFee,

          discount,

          totalAmount,

          paymentMethod,

          paymentStatus:
            "pending",

          orderStatus:
            "placed",

          placedAt:
            new Date(),
        },
      ],
      { session }
    );


    // ======================================
    // CLEAR CART
    // ======================================

    await Cart.deleteOne({
      _id: cart._id,
    }).session(session);


    await session.commitTransaction();

    // Send notification to user
    await sendNotificationToUser({
  userId: order.customerId,
  title: "Order Placed 🎉",
  message: `Your order ${order.orderNumber} has been placed successfully.`,
  type: "order_placed",
  orderId: order._id,
  data: {
    orderNumber: order.orderNumber,
    status: order.orderStatus,
  },
});

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order: order[0],
      },
      
    });
  } catch (error) {
    await session.abortTransaction();

    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  } finally {
    session.endSession();
  }
};

// ==========================================
// GET MY ORDERS
// ==========================================

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user._id,
    })
      .populate(
        "shopId",
        "name slug logo"
      )
      .populate(
        "deliveryBoyId",
        "name phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// ==========================================
// GET MY ORDER BY ID
// ==========================================

export const getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      customerId: req.user._id,
    })
      .populate(
        "shopId",
        "name slug logo phone"
      )
      .populate(
        "deliveryBoyId",
        "name phone"
      )
      .populate(
        "items.productId",
        "name images"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// ==========================================
// GET SHOP ORDERS
// SHOP ADMIN ONLY
// ==========================================

export const getShopOrders = async (req, res) => {
  try {
    const shopId = req.user.shopId;

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to a shop",
      });
    }

    const {
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {
      shopId,
    };

    if (status) {
      filter.orderStatus = status;
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate(
          "customerId",
          "name phone email"
        )
        .populate(
          "deliveryBoyId",
          "name phone"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit)),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(
            total / Number(limit)
          ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Get shop orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop orders",
    });
  }
};

// ==========================================
// GET SHOP ORDER BY ID
// ==========================================

export const getShopOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const shopId = req.user.shopId;

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to a shop",
      });
    }

    const order = await Order.findOne({
      _id: id,
      shopId,
    })
      .populate(
        "customerId",
        "name phone email"
      )
      .populate(
        "deliveryBoyId",
        "name phone"
      )
      .populate(
        "items.productId",
        "name images meatType"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Get shop order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// ==========================================
// UPDATE SHOP ORDER STATUS
// ==========================================

export const updateShopOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const shopId = req.user.shopId;

    if (!shopId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to a shop",
      });
    }

    const allowedStatuses = [
      "confirmed",
      "preparing",
      "ready_for_pickup",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findOne({
      _id: id,
      shopId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ======================================
    // VALID STATUS TRANSITIONS
    // ======================================

    const transitions = {
      placed: [
        "confirmed",
        "rejected",
      ],

      confirmed: [
        "preparing",
        "rejected",
      ],

      preparing: [
        "ready_for_pickup",
      ],

      ready_for_pickup: [],
    };

    const allowedNextStatuses =
      transitions[order.orderStatus] || [];

    if (
      !allowedNextStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot change order status from ` +
          `${order.orderStatus} to ${status}`,
      });
    }

    // ======================================
    // UPDATE TIMESTAMPS
    // ======================================

    order.orderStatus = status;

    if (status === "confirmed") {
      order.confirmedAt = new Date();
    }

    if (status === "preparing") {
      order.preparingAt = new Date();
    }

    if (status === "ready_for_pickup") {
      order.readyForPickupAt = new Date();
    }

    if (status === "rejected") {
      order.cancelledAt = new Date();
    }

    await order.save();
    
    const customerNotificationMap = {
  confirmed: {
    title: "Order Confirmed ✅",
    message: `Your order ${order.orderNumber} has been confirmed by the shop.`,
    type: "order_confirmed",
  },

  preparing: {
    title: "Order Being Prepared 👨‍🍳",
    message: `Your order ${order.orderNumber} is now being prepared.`,
    type: "order_preparing",
  },

  ready_for_pickup: {
    title: "Order Ready 📦",
    message: `Your order ${order.orderNumber} is ready for pickup.`,
    type: "order_ready",
  },

  rejected: {
    title: "Order Rejected ❌",
    message: `Your order ${order.orderNumber} has been rejected by the shop.`,
    type: "order_cancelled",
  },
};

const notification =
  customerNotificationMap[status];

if (notification) {
  await sendNotificationToUser({
    userId: order.customerId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    orderId: order._id,
    data: {
      orderNumber: order.orderNumber,
      status: order.orderStatus,
    },
  });
}
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: {
        order,
      },
    });
  } catch (error) {
    console.error(
      "Update shop order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};


// ==========================================
// ASSIGN DELIVERY BOY
// ==========================================

export const assignDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryBoyId } = req.body;

    if (!deliveryBoyId) {
      return res.status(400).json({
        success: false,
        message: "deliveryBoyId is required",
      });
    }

    // ------------------------------------------
    // Find order belonging to logged-in shop
    // ------------------------------------------

    const order = await Order.findOne({
      _id: id,
      shopId: req.user.shopId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ------------------------------------------
    // Order must be ready for pickup
    // ------------------------------------------

    if (order.orderStatus !== "ready_for_pickup") {
      return res.status(400).json({
        success: false,
        message:
          "Delivery boy can only be assigned when the order is ready for pickup",
      });
    }

    // ------------------------------------------
    // Find delivery boy
    // ------------------------------------------

    const deliveryBoy = await User.findOne({
      _id: deliveryBoyId,
      role: "delivery_boy",
      shopId: req.user.shopId,
      isActive: true,
    }).select("name email phone role shopId isActive");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message:
          "Active delivery boy not found in your shop",
      });
    }

    // ------------------------------------------
    // Assign delivery boy
    // ------------------------------------------

    order.deliveryBoyId = deliveryBoy._id;

    await order.save();

    // ------------------------------------------
    // Return populated order
    // ------------------------------------------

    await order.populate(
      "deliveryBoyId",
      "name email phone role shopId isActive"
    );

    return res.status(200).json({
      success: true,
      message: "Delivery boy assigned successfully",
      order,
    });
  } catch (error) {
    console.error("assignDeliveryBoy error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign delivery boy",
      error: error.message,
    });
  }
};