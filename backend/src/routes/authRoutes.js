import express from "express";

import {
  registerCustomer,
  login,
  getMe,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCustomer);

router.post("/login", login);

router.get("/me", protect, getMe);

export default router;