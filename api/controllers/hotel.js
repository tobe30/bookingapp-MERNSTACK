import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"


export const createHotel = async (req,res,next)=>{
  const newHotel = new Hotel(req.body)
     
     try {
         const savedHotel = await newHotel.save()
         res.status(200).json(savedHotel)
     } catch (error) {
         next(err)
     }   
}

export const updateHotel = async (req,res,next)=>{
       try {
           const updatedHotel = await Hotel.findByIdAndUpdate(
               req.params.id, 
               { $set: req.body},
               { new: true}
           )
           res.status(200).json(updatedHotel)
       } catch (error) {
           res.status(500).json(err)
       }
  }

  export const deleteHotel = async (req,res,next)=>{
    try {
         await Hotel.findByIdAndDelete(
            req.params.id, 
            { $set: req.body},
            { new: true}
        )
        res.status(200).json("Hotel has been deleted")
    } catch (error) {
        res.status(500).json(err)
    } 
  }

  export const getHotel = async (req,res,next)=>{
    try {
        const hotel = await Hotel.findById(
            req.params.id
        )
        res.status(200).json(hotel)
    } catch (err) {
        next(err)
    }   
  }

//   export const getHotels = async (req,res,next)=>{
//     try {
//         const hotels = await Hotel.find(req.query).limit(req.query.limit); // The limit query parameter is passed as a string ('2'), and .limit() expects a number, not a string
//         res.status(200).json(hotels)
//     } catch (err) {
//         next(err)
//     }  
//   }

export const getHotels = async (req, res, next) => {
    const { min, max, limit, ...others } = req.query;
  
    if (others.featured) others.featured = others.featured === "true";
  
    const filter = { ...others };
    const limitNumber = limit ? parseInt(limit) : 0;
  
    // Only add price filter if min or max is present
    if (min || max) {
      filter.cheapestPrice = {
        ...(min && { $gt: parseInt(min) }),
        ...(max && { $lt: parseInt(max) }),
      };
    }
  
    try {
      const hotels = await Hotel.find(filter).limit(limitNumber);
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };

// export const getHotels = async (req, res, next) => {
//     try {
//         // Extract limit and filter
//         const { limit, ...filter } = req.query;

//         // Convert limit to a number (default to 0 if not provided)
//         const limitNumber = limit ? parseInt(limit) : 0;

//         // Find hotels based on filter and limit
//         const hotels = await Hotel.find(filter).limit(limitNumber);

//         res.status(200).json(hotels);
//     } catch (err) {
//         next(err);
//     }
// };


  export const countByCity = async (req,res,next)=>{
    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city: city})
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }  
  }

  export const countByType = async (req,res,next)=>{
      try {
        const hotelCount = await Hotel.countDocuments({type: "Hotel"})
        const apartmentCount = await Hotel.countDocuments({type: "apartment"})
        const resortCount = await Hotel.countDocuments({type: "resort"})
        const villaCount = await Hotel.countDocuments({type: "villa"})
        const cabinCount = await Hotel.countDocuments({type: "cabin"})
        
        res.status(200).json([
            {type: "Hotel", count: hotelCount},
            {type: "apartment", count: apartmentCount},
            {type: "resort", count: resortCount},
            {type: "villa", count: villaCount},
            {type: "cabin", count: cabinCount}
        ])
    } catch (err) {
        next(err)
    }  
  }

 export const getHotelRooms = async (req,res,next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
    const list = await Promise.all(hotel.rooms.map(room=>{
      return Room.findById(room)
    })) //promise all bcs we have multiple rooms
    res.status(200).json(list)
  } catch (err) {
    next(err)
  }
 }