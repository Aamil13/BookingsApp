import HotelsModal from "../modals/HotelsModal.js";
import UserModel from "../modals/UserModal.js"
import UserReservesModal from "../modals/UserReservesModal.js";


// update user
export const UpdateUser = async(req,res,next)=>{
    const id = req.params.id;
    let updatedUser
    try {
        updatedUser = await UserModel.findByIdAndUpdate(id,{$set:req.body},{new: true})
    } catch (error) {
        return next(error)
    }

    return res.status(200).json(updatedUser)
}

//delete user
export const DeleteUser = async(req,res,next)=>{
    const id = req.params.id;
    try {
      await  UserModel.findByIdAndDelete(id)
    } catch (error) {
        next(error)
    }

    return res.status(200).json({message:"User has been deleted"})
}


// get single user
export const getSingleUSer =async(req,res,next)=>{
    const id = req.params.id
    
    let user
    try {
        user = await UserModel.findById(id)
        
    } catch (error) {
        return next(error)
    }

    return res.status(200).json(user)
} 


// get all user

export const getAllUser =async(req,res,next)=>{
    let users
    try {
        users = await UserModel.find()
        
    } catch (error) {
        return next(error)
    }

    return res.status(200).json(users)
} 

export const getUserTransaction = async(req,res,next)=>{
    const id = req.params.id
    const page = req.query.page || 1;
const pageSize = 5;
    const skip = (page - 1) * pageSize;

    let user
    let totalCount
    try {
        //  user = await UserModel.findById(id).populate("bookings")
         user = await UserModel.findById(id).populate({
            path: 'bookings',
            options: { 
                sort: { createdAt: -1 }, // Sorting by createdAt in descending order
                skip: skip,
                limit: pageSize
              },
            populate: [
              { path: 'hotelid', model: HotelsModal }, // Populate the 'hotelid' field in each booking with the Hotel model
            //   { path: 'roomid', model: Room },  //  Populate the 'roomid' field in each booking with the Room model
            ],
          })
          totalCount = await UserReservesModal.countDocuments({ user: id });
    } catch (error) {
        return next(error)
    }

    return res.status(200).json({user,totalCount})
}