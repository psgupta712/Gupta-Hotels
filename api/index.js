// index.js
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // ← force Google DNS for Node.js

import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoute  from "./routes/auth.route.js";
import userRoute  from "./routes/users.route.js";
import roomRoute  from "./routes/rooms.route.js";
import hotelRoute from "./routes/hotels.route.js";

const app = express();

connectDB();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",  authRoute);
app.use("/api/user",  userRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/room",  roomRoute);

// ── Global error handler ──────────────────────────────────
// Without this, createError responses crash the server
app.use((err, req, res, next) => {
  const status  = err.status  || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ success: false, status, message });
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});
