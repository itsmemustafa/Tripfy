import Place from "../../models/place.js";
import  { StatusCodes } from "http-status-codes";    
const getPlace = async (req, res) => {
    const {id} =req.params;
    if(!id)
    {
        return  res.status(StatusCodes.NOT_FOUND).json({message:"Place not found"});
    }
    const place = await Place.findById(id);
    if(!place)
    {
        return  res.status(StatusCodes.NOT_FOUND).json({message:"Place not found"});
    }
    return res.status(StatusCodes.OK).json({place});
}

export default getPlace;