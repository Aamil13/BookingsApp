import HotelsModal from "../modals/HotelsModal.js";
import RoomsModal from "../modals/RoomsModal.js"
import { createError } from "../utils/error.js";


// create Hotel
export const createHotel =async(req,res,next)=>{
        let newHotel = new HotelsModal(req.body)

        try {
            const savedHotel = await newHotel.save()
            return res.status(201).json(savedHotel)

        } catch (error) {
            return next(error)
        }
} 


// update hotel
export const updateHotel =async(req,res,next)=>{
    const id = req.params.id
    let updatedHotel
    try {
       updatedHotel = await HotelsModal.findByIdAndUpdate(id,{$set: req.body},{
        new: true
       })
        

    } catch (error) {
        return next(error)
    }

    return res.status(200).json(updatedHotel)
} 


// delete Hotel
export const deleteHotel =async(req,res,next)=>{
    const id = req.params.id
//    console.log(id);
    try {
       await HotelsModal.findByIdAndDelete(id)
        

    } catch (error) {
        return next(error)
    }

    return res.status(200).json({message:"Hotel has been deleted!"})
} 



// get single hotel by id
export const getSingleHotel =async(req,res,next)=>{
    const id = req.params.id
    
    let hotel
    try {
        hotel = await HotelsModal.findById(id)
        
    } catch (error) {
        return next(error)
    }

    return res.status(200).json(hotel)
} 

// get all Hotels
export const getAllHotel =async(req,res,next)=>{
    // console.log(req.query);
    const {limit,min, max,page, ...others} = req.query
    const Currpage = Number(page) || 1
        const limitpage = limit;
        const startIndex = (Currpage - 1)*limit;
    let hotels
    let count
    try {
        hotels = await HotelsModal.find({
            ...others,
            cheapestPrice:{$gt: min | 1, $lt: max || 50000}
        }).skip(startIndex).limit(limitpage)

        count = await HotelsModal.find({
            ...others,
            cheapestPrice:{$gt: min | 1, $lt: max || 50000}
        }).countDocuments()
        
    } catch (error) {
        return next(error)
    }

    return res.status(200).json({hotels,count})
} 

// hotels count
export const getHotelCount =async(req,res,next)=>{
    let cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map((item)=>{
            return HotelsModal.countDocuments({city:item})
        }))
        res.status(200).json(list)
    } catch (error) {
        return next(error)
    }

    
} 


// hotel type count
export const getHotelType =async(req,res,next)=>{
    try {
        const HotelCount = await HotelsModal.countDocuments({type:"Hotel"})
        const ApartmentsCount = await HotelsModal.countDocuments({type:"Apartments"})
        const ResortsCount = await HotelsModal.countDocuments({type:"Resorts"})
        const VillasCount = await HotelsModal.countDocuments({type:"Villas"})
        const CabinsCount = await HotelsModal.countDocuments({type:"Cabins"})
        const CottagesCount = await HotelsModal.countDocuments({type:"Cottages"})
        const HostelsCount = await HotelsModal.countDocuments({type:"Hostels"})
       
        res.status(200).json([
            {type:"Hotel",count:HotelCount},
            {type:"Apartments",count:ApartmentsCount},
            {type:"Resorts",count:ResortsCount},
            {type:"Villas",count:VillasCount},
            {type:"Cabins",count:CabinsCount},
            {type:"Cottages",count:CottagesCount},
            {type:"Hostels",count:HostelsCount},
        ])
    } catch (error) {
        return next(error)
    }

    
} 


export const getHotelRooms = async(req,res,next)=>{
    try {
        const hotel = await HotelsModal.findById(req.params.id);
        const list = await Promise.all(
            hotel.rooms.map((room)=>{
                return RoomsModal.findById(room)
            })
        )

        return res.status(200).json(list)
    } catch (error) {
        next(error)
    }
}