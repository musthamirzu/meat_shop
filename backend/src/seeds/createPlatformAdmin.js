import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createPlatformAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const phone = process.env.ADMIN_PHONE;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !phone || !password) {
      throw new Error(
        "ADMIN_EMAIL, ADMIN_PHONE and ADMIN_PASSWORD are required in .env"
      );
    }

    const existingAdmin = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone },
      ],
    });

    if (existingAdmin) {
      console.log("Platform admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "Platform Administrator",
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "platform_admin",
      shopId: null,
      isActive: true,
      isVerified: true,
    });

    console.log("Platform admin created successfully.");
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error("Platform admin creation failed:");
    console.error(error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createPlatformAdmin();