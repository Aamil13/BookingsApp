import Room from "../modals/RoomsModal.js";
import Hotel from "../modals/HotelsModal.js";
import UserReservesModal from "../modals/UserReservesModal.js";
import UserModal from "../modals/UserModal.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {

    let newReserve
    let user
    let room
    const session = await mongoose.startSession()
    session.startTransaction()
  try {
     newReserve = new UserReservesModal({
      BookedDates: req.body.dates,
      roomid: req.params.id,
      hotelid: req.body.hotelid,
      user:req.body.user,
      name:req.body.name,
      roomno:req.body.roomno
    })

   
    
    user = await UserModal.findById(req.body.user) 
    user.bookings.push(newReserve)
    await user.save({session})

    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      },{session:session}
    );

    // room = await Room.findOne({'roomNumbers._id':req.params.id})
    // console.log(req.params.id);
    // return console.log(room);

    newReserve = await newReserve.save({session})

   
    res.status(200).json("Room status has been updated.");
    await session.commitTransaction()
  } catch (err) {
    await session.abortTransaction();
    next(err);
  }finally{
    
   await session.endSession();
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};