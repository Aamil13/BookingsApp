import mongoose from "mongoose";

export const connctDB =async()=>{
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to mongo at: ${connected.connection.host}`);
    } catch (error) {
        console.log("mongodb connection error",error);
    }
}