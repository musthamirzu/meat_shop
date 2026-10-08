import express from "express";

import {
  getPublicShopCategories,
} from "../controllers/categoryController.js";

import {
  getPublicShopProducts,
} from "../controllers/productController.js";

const router = express.Router();


// ==========================================
// SHOP CATEGORIES
// ==========================================

router.get(
  "/shops/:shopId/categories",
  getPublicShopCategories
);


// ==========================================
// SHOP PRODUCTS
// ==========================================

router.get(
  "/shops/:shopId/products",
  getPublicShopProducts
);


export default router;