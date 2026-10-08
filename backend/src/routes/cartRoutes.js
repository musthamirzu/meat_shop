import express from "express";

import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// GET MY CART
// ==========================================

router.get(
  "/",
  protect,
  authorize("customer"),
  getMyCart
);


// ==========================================
// ADD ITEM
// ==========================================

router.post(
  "/items",
  protect,
  authorize("customer"),
  addToCart
);

// ==========================================
// GET MY CART
// ==========================================

router.get(
  "/",
  protect,
  authorize("customer"),
  getMyCart
);


// ==========================================
// ADD ITEM
// ==========================================

router.post(
  "/items",
  protect,
  authorize("customer"),
  addToCart
);


// ==========================================
// UPDATE ITEM
// ==========================================

router.put(
  "/items/:itemId",
  protect,
  authorize("customer"),
  updateCartItem
);


// ==========================================
// REMOVE ITEM
// ==========================================

router.delete(
  "/items/:itemId",
  protect,
  authorize("customer"),
  removeCartItem
);


// ==========================================
// CLEAR CART
// ==========================================

router.delete(
  "/",
  protect,
  authorize("customer"),
  clearCart
);

export default router;