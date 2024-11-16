import mongoose, { Schema,model } from "mongoose";

const roomSchema = new Schema(
    {
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        maxPeople: {
          type: Number,
          required: true,
        },
        desc: {
          type: String,
          required: true,
        },

        hotelId:{
          type: mongoose.Schema.Types.ObjectId, ref: 'HotelModal', required: true
        
        },
        roomNumbers: [{ number: Number, unavailableDates: {type: [Date]}}],
      },
      { timestamps: true }
)

export default model("RoomModel",roomSchema)