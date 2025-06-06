import { ApirError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) =>{
try{
req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

if(!token){
    throw new ApirError(401, "Unauthorized request")
}

const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

await User.findById(decodedToken?._id).select("-password -refreshToken")

if(!user){
    //next_video: todo discuss about frontend
    throw new ApirError(401, "Invalid Access Token")
}

req.user = user;
next()
}catch(error){
    throw new ApirError(401, error?.message ||
        "Invalid access token"
    )
}

})