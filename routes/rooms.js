import { Router } from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/roomController.js";

const roomRouter  = Router()

roomRouter.post("/:hotelid", verifyAdmin, createRoom);

//UPDATE
roomRouter.put("/availability/:id", updateRoomAvailability);
roomRouter.put("/:id", verifyAdmin, updateRoom);
//DELETE
roomRouter.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET

roomRouter.get("/:id", getRoom);
//GET ALL

roomRouter.get("/", getRooms);

export default roomRouter