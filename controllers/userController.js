import HotelsModal from "../modals/HotelsModal.js";
import UserModel from "../modals/UserModal.js"
import UserReservesModal from "../modals/UserReservesModal.js";
import { formatDateToYearMonth, formatDateToYearMonthDay, getCurrentMonthYear, getCurrentYear, getStartAndEndOfWeek } from "../utils/dateFunc.js";


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

export const getDashBoardData=async(req,res,next)=>{

    try {
        const totalUsers = await UserModel.countDocuments()
        const allBookings = await UserReservesModal.find()
        
        const totalIncome = allBookings.reduce((acc, booking) => {
            return acc + (booking.totalPrice || 0); 
          }, 0);

          const { year: currentYear, month: currentMonth } = getCurrentMonthYear();

          const totalMonthlyIncome = allBookings.reduce((acc, booking) => {
            const bookingDate = new Date(booking.createdAt);
            const bookingYear = bookingDate.getFullYear();
            const bookingMonth = (bookingDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
            
            if (bookingYear === parseInt(currentYear) && bookingMonth === currentMonth) {
              acc += (booking.totalPrice || 0); // Accumulate income, default to 0 if totalPrice is undefined
            }
            
            return acc;
          }, 0);


          ////for week
          const getDayOfWeekName = (date) => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[new Date(date).getDay()];
          };
          
          const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
          
          const dailyIncome = allBookings.reduce((acc, booking) => {
            const bookingDate = new Date(booking.createdAt);
            const formattedDate = formatDateToYearMonthDay(bookingDate);
            
            if (formattedDate >= startOfWeek && formattedDate <= endOfWeek) {
              const dayOfWeek = getDayOfWeekName(formattedDate);
              if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = [];
              }
              acc[dayOfWeek].push(booking.totalPrice || 0);
            }
            
            return acc;
          }, {});
          
          const minDailyIncome = Object.keys(dailyIncome).reduce((acc, day) => {
            acc[day] = Math.min(...dailyIncome[day]);
            return acc;
          }, {});

          // for monthly
          const currentYearMonthly = getCurrentYear();

const monthlyIncome = allBookings.reduce((acc, booking) => {
  const { year, month } = formatDateToYearMonth(booking.createdAt);

  if (parseInt(year) === currentYearMonthly) {
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += (booking.totalPrice || 0);
  }

  return acc;
}, {});

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const totalMonthlyIncomeForYear = monthNames.reduce((acc, month, index) => {
  const monthIndex = (index + 1).toString().padStart(2, '0'); // Convert index to month number string (01, 02, ..., 12)
  acc[month] = monthlyIncome[monthIndex] || 0;
  return acc;
}, {});

          return res.status(200).json({totalUsers,totalIncome,totalMonthlyIncome,minDailyIncome,totalMonthlyIncomeForYear})
        
    } catch (error) {
        return next(error)
    }
}