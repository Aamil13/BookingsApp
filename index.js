import express from "express"
import dotenv from "dotenv"
import { connctDB } from "./utils/ConnectDB.js"
import hotelRoutes from "./routes/hotels.js"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/users.js"
import cookieParser from "cookie-parser"
import roomRouter from "./routes/rooms.js"
import reservationRouter from "./routes/reservation.js"
import cors from"cors"

const app = express()

dotenv.config()

const allowedOrigin = 'https://nextbookingadmin.netlify.app';

app.use(cors({
  origin: (origin, callback) => {
    if (origin === allowedOrigin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get("/",(req,res)=>{
    return res.send("working")
})

// connecting to database
connctDB()


// middlewares
app.use(express.json())
app.use(cookieParser())

// import cloudinary from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export  {cloudinary};

app.use("/api/v1/hotel",hotelRoutes)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/rooms",roomRouter)
app.use("/api/v1/reservation",reservationRouter)

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


// app.listen(5000,()=>{
//     console.log("conneted");
// })

export default app;