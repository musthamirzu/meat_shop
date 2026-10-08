import express from "express";

import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getShopOrders,
  getShopOrderById,
  updateShopOrderStatus,
  assignDeliveryBoy,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// PLACE ORDER
// ==========================================

router.post(
  "/",
  protect,
  authorize("customer"),
  createOrder
);


// ==========================================
// MY ORDERS
// ==========================================

router.get(
  "/",
  protect,
  authorize("customer"),
  getMyOrders
);


// ==========================================
// SINGLE ORDER
// ==========================================

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getMyOrderById
);

// ==========================================
// SHOP ADMIN ORDERS
// ==========================================

// Get all orders belonging to this shop
router.get(
  "/shop",
  protect,
  authorize("shop_admin"),
  getShopOrders
);


// Get one order belonging to this shop
router.get(
  "/shop/:id",
  protect,
  authorize("shop_admin"),
  getShopOrderById
);


// Update order status
router.patch(
  "/shop/:id/status",
  protect,
  authorize("shop_admin"),
  updateShopOrderStatus
);

router.patch(
  "/shop/:id/assign-delivery",
  protect,
  authorize("shop_admin"),
  assignDeliveryBoy
);
export default router;