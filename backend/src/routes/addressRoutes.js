import express from "express";

import {
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// GET MY ADDRESSES
// ==========================================

router.get(
  "/",
  protect,
  authorize("customer"),
  getMyAddresses
);


// ==========================================
// CREATE ADDRESS
// ==========================================

router.post(
  "/",
  protect,
  authorize("customer"),
  createAddress
);


// ==========================================
// UPDATE ADDRESS
// ==========================================

router.put(
  "/:id",
  protect,
  authorize("customer"),
  updateAddress
);


// ==========================================
// DELETE ADDRESS
// ==========================================

router.delete(
  "/:id",
  protect,
  authorize("customer"),
  deleteAddress
);


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

router.patch(
  "/:id/default",
  protect,
  authorize("customer"),
  setDefaultAddress
);


export default router;