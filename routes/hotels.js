import { Router } from "express";
import { createHotel, deleteHotel, getAllHotel, getSingleHotel, updateHotel,getHotelCount, getHotelType, getHotelRooms, searchHotelByName, deleteHotelPhoto } from "../controllers/hotelController.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import { upload } from "../utils/multerSetup.js";
import { getCloudinaryLink } from "../utils/cloudinaryImageUpload.js";

const hotelRoutes = Router()

    hotelRoutes.post("/add",upload.array("files"),verifyAdmin,getCloudinaryLink,createHotel)
    hotelRoutes.put("/update/:id",upload.array("files"),verifyAdmin,getCloudinaryLink,updateHotel)
    hotelRoutes.delete("/delete/:id",verifyAdmin,deleteHotel)
    hotelRoutes.delete('/hotels/photo/delete',verifyAdmin,deleteHotelPhoto)
    // hotelRoutes.delete("/delete/:id",deleteHotel)

    hotelRoutes.get("/gethotel/:id",getSingleHotel)
    hotelRoutes.get("/getallhotels",getAllHotel)
    hotelRoutes.get("/gethotelsccount",getHotelCount)
    hotelRoutes.get("/gethotelType",getHotelType) 
    hotelRoutes.get("/room/:id",getHotelRooms) 
    hotelRoutes.get("/search_hotel",searchHotelByName)

export default hotelRoutes;