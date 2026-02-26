// routes/hotels.route.js
// ✅ Fixed: specific routes MUST come before /:id parameterized routes
// Otherwise Express treats "countByCity" as an id param

import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// ── Specific routes first ──────────────────────────────────
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id",    getHotelRooms);

// ── Parameterized routes after ─────────────────────────────
router.get("/find/:id",    getHotel);
router.get("/",            getHotels);

// ── Admin protected ────────────────────────────────────────
router.post("/",           verifyAdmin, createHotel);
router.put("/:id",         verifyAdmin, updateHotel);
router.delete("/:id",      verifyAdmin, deleteHotel);

export default router;