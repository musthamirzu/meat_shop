import Order from "../models/Order.js";

// ==========================================
// GET DELIVERY BOY ORDERS
// ==========================================

export const getDeliveryBoyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      shopId: req.user.shopId,
      deliveryBoyId: req.user._id,
    })
      .populate(
        "shopId",
        "name slug logo phone address"
      )
      .populate(
        "customerId",
        "name phone email"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getDeliveryBoyOrders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery orders",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE DELIVERY ORDER
// ==========================================

export const getDeliveryBoyOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      shopId: req.user.shopId,
      deliveryBoyId: req.user._id,
    })
      .populate(
        "shopId",
        "name slug logo phone address"
      )
      .populate(
        "customerId",
        "name phone email"
      )
      .populate(
        "deliveryBoyId",
        "name phone email"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Delivery order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getDeliveryBoyOrderById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery order",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE DELIVERY ORDER STATUS
// ==========================================

export const updateDeliveryOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "picked_up",
      "out_for_delivery",
      "delivered",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    // ------------------------------------------
    // Find only orders assigned to this delivery boy
    // ------------------------------------------

    const order = await Order.findOne({
      _id: id,
      shopId: req.user.shopId,
      deliveryBoyId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Delivery order not found",
      });
    }

    // ------------------------------------------
    // Validate status transition
    // ------------------------------------------

    const validTransitions = {
      ready_for_pickup: ["picked_up"],
      picked_up: ["out_for_delivery"],
      out_for_delivery: ["delivered"],
    };

    const allowedNextStatuses =
      validTransitions[order.orderStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${order.orderStatus} to ${status}`,
      });
    }

    // ------------------------------------------
    // Update status
    // ------------------------------------------

    order.orderStatus = status;

    // ------------------------------------------
    // Set timestamps
    // ------------------------------------------

    if (status === "picked_up") {
      order.pickedUpAt = new Date();
    }

    if (status === "out_for_delivery") {
      // No separate timestamp exists in the current schema.
      // We can add one later if needed.
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    // ------------------------------------------
    // Populate response
    // ------------------------------------------

    await order.populate(
      "shopId",
      "name slug logo phone address"
    );

    await order.populate(
      "customerId",
      "name phone email"
    );

    await order.populate(
      "deliveryBoyId",
      "name phone email"
    );

    return res.status(200).json({
      success: true,
      message: `Order marked as ${status}`,
      order,
    });
  } catch (error) {
    console.error("updateDeliveryOrderStatus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update delivery order",
      error: error.message,
    });
  }
};