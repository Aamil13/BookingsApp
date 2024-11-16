import HotelsModal from "../modals/HotelsModal.js";
import RoomsModal from "../modals/RoomsModal.js"
import { deleteCloudinaryImage } from "../utils/cloudinaryImageUpload.js";
import { createError } from "../utils/error.js";


// create Hotel
export const createHotel =async(req,res,next)=>{
        const {photos,files,publicIds,...hotel} = req.body
        const newHotelData={
            ...hotel,photos:files,photoPublicIds: publicIds
        }
    
        let newHotel = new HotelsModal(newHotelData)

        try {
            

            // return    console.log("body",newHotelData);
    
            const savedHotel = await newHotel.save()
            return res.status(201).json(savedHotel)

        } catch (error) {
            return next(error)
        }
} 


// Update Hotel
export const updateHotel = async (req, res, next) => {
    const id = req.params.id;
    const { photos, files, publicIds, ...hotel } = req.body;
  
    try {
      // Find the existing hotel
      const existingHotel = await HotelsModal.findById(id);
      if (!existingHotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      // Merge existing photos and publicIds with new ones
      const updatedPhotos = [...existingHotel.photos, ...(files || [])];
      const updatedPublicIds = [...existingHotel.photoPublicIds, ...(publicIds || [])];
  
      const newHotelData = {
        ...hotel,
        photos: updatedPhotos,
        photoPublicIds: updatedPublicIds
      };
  
      const updatedHotel = await HotelsModal.findByIdAndUpdate(id, { $set: newHotelData }, { new: true });
  
      return res.status(200).json(updatedHotel);
    } catch (error) {
      return next(error);
    }
  };


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

export const deleteHotelPhoto = async (req, res, next) => {
    const { hotelId, publicId,imageUrl } = req.body;

    
    try {

      const hotel = await HotelsModal.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      if (!hotel.photoPublicIds.includes(publicId)) {
        return res.status(400).json({ message: 'Image not found in hotel record' });
      }
      await deleteCloudinaryImage(publicId);
  

      hotel.photos = hotel.photos.filter(photoUrl => photoUrl !== imageUrl);

      hotel.photoPublicIds = hotel.photoPublicIds.filter(id => id !== publicId);
      await hotel.save();
  
      res.status(200).json({ message: 'Image deleted successfully', hotel });
    } catch (error) {
      next(error);
    }
  };



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
                if(!room) return
                return RoomsModal.findById(room)
            })
        )

        return res.status(200).json(list)
    } catch (error) {
        next(error)
    }
}


export const searchHotelByName = async(req,res,next)=>{
    const {search} = req.query
    
    try {
        const hotels = await HotelsModal.find({
            name: { $regex: search, $options: 'i' } // 'i' for case-insensitive search
        }).select("name _id")
    
        res.status(200).json(hotels);
    
    } catch (error) {
        next(error)
    }
}