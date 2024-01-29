import mongoose,{Schema,model} from "mongoose";

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    bookings:[{type:mongoose.Types.ObjectId,ref:"UserReserveModal"}]

},{timestamps:true})


export default model("UserModal",UserSchema)