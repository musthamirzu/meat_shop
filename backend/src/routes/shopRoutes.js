import express from "express";

import {
  createShop,
  getShops,
  getShopById,
  updateShop,
} from "../controllers/shopController.js";
import authorize from "../middleware/roleMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect,
  authorize("platform_admin"),
   createShop);

router.get("/", getShops);

router.get("/:id", getShopById);

router.put("/:id", updateShop);

export default router;