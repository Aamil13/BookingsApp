import { Router } from "express";
import { verifyAdmin } from "../utils/verifyToken.js";
import {getAllTransaction} from "../controllers/reservationController.js"


const reservationRouter  = Router()

reservationRouter.get("/", verifyAdmin,getAllTransaction);

export default reservationRouter