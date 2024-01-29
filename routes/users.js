import { Router } from "express";
import { DeleteUser, UpdateUser, getAllUser, getSingleUSer, getUserTransaction } from "../controllers/userController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const userRouter = Router()

// userRouter.get("/testtoken",verifyToken,(req,res)=>{
//         res.send("you are verified")
// })

// userRouter.get("/testuser/:id",verifyUser,(req,res,next)=>{
//         res.send("you are verified user")
// })

userRouter.put("/update/:id",verifyUser,UpdateUser)
userRouter.delete("/delete/:id",verifyUser,DeleteUser)
userRouter.get("/getuser/:id",verifyUser,getSingleUSer)
userRouter.get("/getallusers",verifyAdmin,getAllUser)
userRouter.get("/usertransaction/:id",verifyUser,getUserTransaction)

export default userRouter