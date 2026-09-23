import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import shopRoutes from "./routes/shopRoutes.js";
import authRoutes from "./routes/authRoutes.js"
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Meat Ordering Platform API is running",
  });
});

app.use("/api/shops", shopRoutes);
app.use("/api/auth", authRoutes);
export default app;