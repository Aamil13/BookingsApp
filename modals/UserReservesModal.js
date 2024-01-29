import mongoose, { Schema,model } from "mongoose";



const UserReserveSchema = new Schema(
    {
        name:{type:String,required:true},
        BookedDates:[{type:  [Date]}],
        hotelid:{type:mongoose.Types.ObjectId,ref:"HotelModal",required:true},
        roomid:{type:String,required:true},
        roomno:{type:String,required:true},
        user:{type:mongoose.Types.ObjectId,
                ref:"UserModal",
                required:true        
        }
    },{timestamps:true}

)

export default model("UserReserveModal",UserReserveSchema)