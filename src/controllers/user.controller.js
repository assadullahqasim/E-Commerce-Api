import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


//? register User

const registerUser = asyncHandler(async(req,res)=>{
    const {fullName,username,email,password,role} = req.body

    if(
        [fullName,username,email,password].some((field)=>typeof field !== "string" || field.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const allowedRoles = ["user", "admin"]; 
    if (role && !allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(409,"User with email already exist")
    }

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        role
    })

    const registeredUser = await User.findById(user._id).select("-password")

    return res.status(200).json(
        new ApiResponse(200,{user:registeredUser},"User registered successfully")
    )
})

//? login user

const loginUser = asyncHandler(async(req,res)=>{
  const {username,email,password} = req.body
  
  if(!(username || email)){
    throw new ApiError(400,"username or email is required")
  }

  const user = await User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(404,"User does not exist")
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if(!isPasswordCorrect){
    throw new ApiError(401,"Incorrect password")
  }

  const loggedInUser = await User.findById(user._id).select("-password")

  const jwtToken = user.generateToken()

  const options = {
      httpOnly : true,
      secure: true
    }

    return res.status(200).cookie("jwtToken",jwtToken,options).json(
        new ApiResponse(200,{
            user:loggedInUser,jwtToken
        },"User loggedIn successfully")
    )

})

//? logout User

const logOutUer = asyncHandler(async(req,res)=>{
    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    }

    return res.status(200).cookie("jwtToken","",options).json(
        new ApiResponse(200,{},"User logged out successfully")
    )
})

//? getProfile

const getProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id).select("-password")

    if(!user){
        throw new ApiError(404,"User profiel does not found")
    }

    return res.status(200).json(
        new ApiResponse(200,{user:user},"Profile fetched successfully")
    )
})

export {
    registerUser,
    loginUser,
    logOutUer,
    getProfile
}