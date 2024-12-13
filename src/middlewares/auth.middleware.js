import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


const verifyToken = asyncHandler(async(req,_,next)=>{
    try {

        const token = req.cookies?.jwtToken || req.headers['authorization']?.split(" ")[1]

        if(!token){
            throw new ApiError(401,"Unauthorized or User not found please register or login again")
        }

        const decodedToken = jwt.verify(token,process.env.JWT_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(404,"User does not exist")
        }

        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
        next()
    }
})


export default verifyToken