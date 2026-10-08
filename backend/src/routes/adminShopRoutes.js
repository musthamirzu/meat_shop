import express from "express";

import {
  createShop,
  getShops,
  getShopById,
  updateShop,
} from "../controllers/shopController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import checkShopAccess from "../middleware/shopAccessMiddleware.js";

const router = express.Router();


// Platform admin → create shop
router.post(
  "/",
  protect,
  authorize("platform_admin"),
  createShop
);


// Platform admin → all shops
router.get(
  "/",
  protect,
  authorize("platform_admin"),
  getShops
);


// Platform admin / shop admin → single shop
router.get(
  "/:id",
  protect,
  authorize("platform_admin", "shop_admin"),
  checkShopAccess,
  getShopById
);


// Platform admin / shop admin → update
router.put(
  "/:id",
  protect,
  authorize("platform_admin", "shop_admin"),
  checkShopAccess,
  updateShop
);

export default router;