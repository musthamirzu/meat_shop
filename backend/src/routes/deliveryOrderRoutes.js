import express from "express";

import {
  getDeliveryBoyOrders,
  getDeliveryBoyOrderById,
  updateDeliveryOrderStatus,
} from "../controllers/deliveryBoyOrderController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// DELIVERY BOY ORDERS
// ==========================================

router.get(
  "/",
  protect,
  authorize("delivery_boy"),
  getDeliveryBoyOrders
);


router.get(
  "/:id",
  protect,
  authorize("delivery_boy"),
  getDeliveryBoyOrderById
);


router.patch(
  "/:id/status",
  protect,
  authorize("delivery_boy"),
  updateDeliveryOrderStatus
);


export default router;