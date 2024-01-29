import { Router } from "express";
import { createHotel, deleteHotel, getAllHotel, getSingleHotel, updateHotel,getHotelCount, getHotelType, getHotelRooms } from "../controllers/hotelController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const hotelRoutes = Router()

    hotelRoutes.post("/add",verifyAdmin,createHotel)
    hotelRoutes.put("/update/:id",verifyAdmin,updateHotel)
    hotelRoutes.delete("/delete/:id",verifyAdmin,deleteHotel)
    hotelRoutes.get("/gethotel/:id",getSingleHotel)
    hotelRoutes.get("/getallhotels",getAllHotel)
    hotelRoutes.get("/gethotelsccount",getHotelCount)
    hotelRoutes.get("/gethotelType",getHotelType) 
    hotelRoutes.get("/room/:id",getHotelRooms) 

export default hotelRoutes;