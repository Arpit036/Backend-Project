import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, ApirError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { JWT } from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const User = await User.findById(userId);
    const accessToken = user.generationAccessToken;
    const refreshToken = user.generateRefreshToken;

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accesstoken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and acces token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user detailes from  frontend
  // validation - atn least check for not empty
  // check if user alread exists : USERNAME, email
  // check avatar and images files
  // check for coverimage
  // upload them on cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  console.log("email", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existeduser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath =  req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "AVatar file is required");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: userame.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerred Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookies

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "username not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

 const loggedInUser = await User.findById(user._id)
 select("-password -refreshToken")

 const options = {
    httpOnly : true,
    secure: true
 }

 return res.status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", refreshToken, options)
 .json(
    new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken,
            refreshToken
        },
        "User Logged in successfully"
    )

 )
});

const logoutUser = asyncHandler(async(req, res)=>{
    User.findByIdUpdate(
        req.user._id,
        {
            $set:{
                refreshToken : undefined
            }
        },{
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken  = asyncHandlerz(async (req, res)=> 
{
  const incomingRefreshToken = req.cookies.
  refreshTken || req.body.refreshToken

  if(incomingRefreshToken){
    throw new ApirError(401, "unauthorized request")
  }

  const decodedToken =jwt.verify(
    incomingRefreshToken,
    Process.env.REFRESH_TOKEN_SECRET
  )
})

const changeCurrentPassword =  asyncHandler(async(req, res)=>{
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?.id)
  const isPasswordCorrect = await user.
  isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old Password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})
})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(200, req.user, "current user fetched successfully")
})



const updateAccountDetails = asyncHandler(async(req, res) =>
{
  const {fullName, email} = req.body

  if (!fullName || !email){
    throw new ApiError(400, "All fields are required")
  }
const user  = User.findByIdAndUpdate(
  req.user?.id,
  {
    $set: {
      fullName,
      email: email
    }
  }, 
  {new :true}
).select("-password")

return res
.status(200)
.json(new ApiResponse(200, user, "Account details updated successfully"))
})


const updateUserAvatar  = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
      throw new ApirError(400, "Avatar file is missing")
      
    }
    
    const avatar = await uploadOnCloudinary
    (avatarLocalPath)
    
    if(!avatar.url){
    throw new ApirError(400, "Error while uploading on avatar")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar : avatar.url
      }
    },
    {new : true}
  ).select("-password")

  return res 
  .status(200)
  .json(
    new ApiResponse(200, user, "cover Image updated successfully")
  )
})

const updateUserCoverImage  = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path

  if(!coverImageLocalPath){
      throw new ApirError(400, " coverImage file is missing")
      
    }
    
    const  coverImage = await uploadOnCloudinary
    ( coverImageLocalPath)
    
    if(!coverImage.url){
    throw new ApirError(400, "Error while uploading on coverImage")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage : coverImage.url
      }
    },
    {new : true}
  ).select("-password")

  return res 
  .status(200)
  .json(
    new ApiResponse(200, user, "cover Image updated successfully")
  )
})


const getUserChannelProfile = asyncHandler(async(req, res) => {
  const {username} = req.params

   if(!username?. trim()){
    throw new ApirError(400, "username is missing")
   }

   const channel = await User.aggregate([
    {
       $match : {
        username : username?.toLowerCase()
       }
    },
    {
      $lookup: {
        from : "subscriptions",
        localField: '_id',
        foreignField: "channel",
        as : "subscribers"

      }
    },
    {
      $lookup: {
        from : "subscriptions",
        localField: '_id',
        foreignField: "subsciber",
        as : "subscribedTo"
      }
    },
      {
        $addFields: {
          subscribersCount : {
            $size: "$subscribers"
          },
          channelsSubscribedToCount: {
            $size: "$subscribedTo"
          },
          isSubscribed: {
            $cond: {
              if: {$in: [req.user?._id, "$usbscribers.subscriber"]},
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project:{
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar:1,
          coverImage:1,
          email:1
        }
      }

   ])

   if(!channel?.length){
    throw new ApiError(404,"Channel doesn't exists")
   }
   return res
   .status(200)
   .json(
    new ApiResponse(200, channel[0], "User channel fetched successfully")
   )
 })


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile

     };
