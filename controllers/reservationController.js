import UserReservesModal from "../modals/UserReservesModal.js";

export const getAllTransaction = async(req,res,next)=>{
    const page = req.query.page || 1;
const pageSize = req.query.limit || 10;
    const skip = (page - 1) * pageSize;

    let Bookings
    let totalCount
    try {
        //  user = await UserModel.findById(id).populate("bookings")
         Bookings = await UserReservesModal.find().populate().skip(skip).limit(pageSize).populate("hotelid")
          totalCount = await UserReservesModal.countDocuments();
    } catch (error) {
        return next(error)
    }

    return res.status(200).json({Bookings,totalCount})
}