import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import addressRoutes from "./routes/addressRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import adminShopRoutes from "./routes/adminShopRoutes.js";
import publicCatalogRoutes from "./routes/publicCatalogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import deliveryBoyRoutes from "./routes/deliveryBoyRoutes.js";
import deliveryOrderRoutes from "./routes/deliveryOrderRoutes.js";
import fcmRoutes from "./routes/fcmRoutes.js";


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
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/shops", adminShopRoutes);
app.use(
  "/api",
  publicCatalogRoutes
);

app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/delivery-boys",
  deliveryBoyRoutes
);
app.use(
  "/api/delivery-orders",
  deliveryOrderRoutes
);

app.use("/api/fcm", fcmRoutes);

export default app;