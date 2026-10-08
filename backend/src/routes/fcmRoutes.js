import express from "express";

import {
  registerFCMToken,
  removeFCMToken,
} from "../controllers/fcmController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// Register device token
router.post(
  "/register",
  protect,
  registerFCMToken
);


// Remove device token
router.post(
  "/remove",
  protect,
  removeFCMToken
);


export default router;