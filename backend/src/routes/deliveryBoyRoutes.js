import express from "express";

import {
  createDeliveryBoy,
  getShopDeliveryBoys,
  updateDeliveryBoyStatus,
} from "../controllers/deliveryBoyController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE DELIVERY BOY
// SHOP ADMIN ONLY
// ==========================================

router.post(
  "/",
  protect,
  authorize("shop_admin"),
  createDeliveryBoy
);


// ==========================================
// GET DELIVERY BOYS
// SHOP ADMIN ONLY
// ==========================================

router.get(
  "/",
  protect,
  authorize("shop_admin"),
  getShopDeliveryBoys
);


// ==========================================
// ACTIVATE / DEACTIVATE
// ==========================================

router.patch(
  "/:id/status",
  protect,
  authorize("shop_admin"),
  updateDeliveryBoyStatus
);


export default router;