// routes/rooms.route.js
// ✅ Fixed: delete route uses /:id only, hotelId comes as query param ?hotelId=
// Frontend calls: DELETE /api/room/:id?hotelId=:hotelId

import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// ── Specific routes first ──────────────────────────────────
router.put("/availability/:id", updateRoomAvailability);
router.get("/",                 getRooms);

// ── Parameterized routes after ─────────────────────────────
router.post("/:hotelid",        verifyAdmin, createRoom);
router.put("/:id",              verifyAdmin, updateRoom);
router.delete("/:id",           verifyAdmin, deleteRoom); // ✅ hotelId via ?hotelId= query param
router.get("/:id",              getRoom);

export default router;