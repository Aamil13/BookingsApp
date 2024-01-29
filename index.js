import express from "express"
import dotenv from "dotenv"
import { connctDB } from "./utils/ConnectDB.js"
import hotelRoutes from "./routes/hotels.js"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/users.js"
import cookieParser from "cookie-parser"
import roomRouter from "./routes/rooms.js"


const app = express()
dotenv.config()


app.get("/",(req,res)=>{
    return res.send("working")
})

// connecting to database
connctDB()


// middlewares
app.use(express.json())
app.use(cookieParser())


app.use("/api/v1/hotel",hotelRoutes)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/rooms",roomRouter)

app.use((err,req,res,next)=>{
    const errStatus = err.status || 500;
    const errMessage = err.message || "Something Went Wrong";

    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack
    })
})


app.listen(5000,()=>{
    console.log("conneted");
})