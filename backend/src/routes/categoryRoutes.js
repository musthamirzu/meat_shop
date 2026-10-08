import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE CATEGORY
// ==========================================

router.post(
  "/",
  protect,
  authorize("platform_admin", "shop_admin"),
  createCategory
);


// ==========================================
// GET ALL CATEGORIES
// ==========================================

router.get(
  "/",
  protect,
  authorize("platform_admin", "shop_admin"),
  getCategories
);


// ==========================================
// GET SINGLE CATEGORY
// ==========================================

router.get(
  "/:id",
  protect,
  authorize("platform_admin", "shop_admin"),
  getCategoryById
);


// ==========================================
// UPDATE CATEGORY
// ==========================================

router.put(
  "/:id",
  protect,
  authorize("platform_admin", "shop_admin"),
  updateCategory
);


// ==========================================
// DELETE CATEGORY
// ==========================================

router.delete(
  "/:id",
  protect,
  authorize("platform_admin", "shop_admin"),
  deleteCategory
);


export default router;