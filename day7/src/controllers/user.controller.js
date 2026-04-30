import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '.././utils/apiError.js'
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../cloudinary.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()

        const refreshToken = await user.generateRefreshToken()

        //give acessToken to user ,save refreshToken it in db
        user.refreshToken= refreshToken

        await user.save( { validateBeforeSave: false } )

        return { accessToken, refreshToken }


    } catch(error){
        throw new ApiError(500, 'Something Went wrong while Generating Access and Refresh Token')
    }
}





const registerUser = asyncHandler ( async(req,res) => {
   //get user details from frontend
   
   //validation (not empty)

   //check if user already exists (username,email)

   //check for images. check for avatar

   // if available upload them to cloudinary, avatar(whether upload uploaded it or not, that's why double checking )

   // create user object in MongoDB- create entry in db

   //remove password and refresh token field from reponse 
   //check for user creation, whether null response or userr is created
   //return response


   const { fullName,email,username, password }=req.body // FORM data,params and req.url also
//    console.log("Email : ", email)

// if(fullName === '') {
//     throw new ApiError(400, "Full Name is required")
// }
    if(
        [fullName, email, username, password].some((field)=>
            field?.trim()==='') 
    ) {
        throw new ApiError(400, "All Fields Are Required")
    }

    // console.log( 'Req.Body: ' ,req.body)

    const existedUser = await User.findOne({          //this return whatever the 1st document jo match karta hai is username email ko
        $or: [ { username }, { email } ] //$or: [{},{}] -> this is or parameter we check as many object as we want to
    })

    // console.log( 'Existing User: ' ,existedUser)

    if(existedUser){
         throw new ApiError(409, "User with email or username already exists")
    }

    //since we added middleware in routes, it give more fields inside requests  

    //req.body by default given by express, multer gives req.files
    
    console.log("Multer req.files",req.files)

    const avatarLocalPath = req.files?.avatar?.[0]?.path

    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    
//If the user doesn't upload a cover image, req.files.coverImage will be undefined.
//  Trying to access [0] on undefined will crash your server.
// To fix this, add one more optional chaining question mark before the array bracket:
    // Add a '?' before [0]
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path; // Add a '?' before [0]

    if(! avatarLocalPath ) {
        throw new ApiError(400, 'Avatar File is Required')
    }

    //upload avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    //only try to upload cover image if path exists
    let coverImage
    if(coverImageLocalPath){
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400, 'Avatar upload failed. Check Cloudinary config.')
    }

    //entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })
    const createdUser = await User.findById(user._id).select(  //select method by default everthing is selected, kya kya nahi chahiye to  unselect it the syntax is jo nhi chahiye uske aage '-' password ni chahiye to string ke andar " -password"
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

} )

 const loginUser = asyncHandler( async(req,res) => {
    //take data from req.body
    //username/email
    //find the user
    //check password
    //access and refresh token
    //send cookie
    
    const { email, username, password } = req.body
    
    // if(username && email) throw new ApiError(400, "Username or Password is required");
    if(!username && !email) {
        throw new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne( {
        $or: [ { username }, { email } ]
    } )

    if(!user) throw new ApiError(404, "User does not Exist");

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401, 'Invalid User Credentials');


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).
    select(" -password -refreshToken ")

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:  loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )


 } )

 const logoutUser = asyncHandler( async ( req, res ) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }           
        },
         {
            // new:true
            returnDocument: 'after'
        }
    )
    const options = {
        httpOnly:true,
        secure: true
    }

    return res.status(200)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json(new ApiResponse(200, {} , "User Logged Out Successfully"))
 } )

 const refreshAccessToken = asyncHandler ( async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken
    if(!incomingRefreshToken) {
        throw new ApiError(401, " Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
             process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user) throw new ApiError(401, "Invalid Refresh Token ");
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401," Refresh Token is Expired or used")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    
        return res.
        status(200)
        .cookie("accessToken", accessToken, options )
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
 } )

 const changeCurrentPassword = asyncHandler( async(req,res) => {
    
    const { oldPassword, newPassword } = req.body
    
    const user = await User.findById(req.body?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
    if(!isPasswordCorrect) throw new ApiError(400, "Invalid Old Password");

    user.password = newPassword
    
    await user.save({ validateBeforeSave: false }) // since in model !isModified but here we are modifying the passwd so validateBeforeSave is false  

    return res
     .status(200)
     .json(new ApiResponse(200, {}, "Password Changed Successfully"))

 })

 const getCurrentUser = asyncHandler ( async (req,res) => {
    return res.status(200)
     .json(200, req.user, "Current User Fetched Successfully")     //since in middleware we had  req.user = user 
 })


const updateAccountDetails = asyncHandler( async (req,res) => {
    const { fullName, email } = req.body

    if(!fullName || !email) throw new ApiError(400,"ALl Fields Are Required");

    const user = await User.findByIdAndUpdate( 
        req.user._id,
        {
            $set: {
                fullName:fullName,
                email:email
            }
        },
        { new:true }
    ).select(" -password")


    return res
    .status(200)
    .json(new ApiResponse(200, user, "Accout details Updated Successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res) => {
    const avatarLocalPath = req.file?.path   //in multer middleware
    if(!avatarLocalPath) throw new ApiError(400, "Avatar File is Missing");


     //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url) throw new ApiError(400, "Error while Uploading on Avatar");
  //GEt the OLD image url before updating the database
  const oldAvatarUrl = req.user?.avatar

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set:{
                avatar: avatar.url
            }
        },
        { new: true}
    ).select("-password")
    //Delete old image from cloudinary
    if(oldAvatarUrl){
        await deleteFromCloudinary(oldAvatarUrl)
    }  
    
    return res
    .status(200)
    .json( new ApiResponse(200, user, "Avatar Image Updated Successfully"))
})

const  updateUserCoverImage = asyncHandler ( async (req,res) => {
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath) throw new ApiError(400, 'Cover Image File is Missing');

     //TODO: delete old image - assignment

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!coverImage.url) throw new ApiError(400,"Error While Uploading Cover Image");

    //GET old cover image url
    const oldCoverImageUrl = req.user?.coverImage

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    if(oldCoverImageUrl){
        await deleteFromCloudinary(oldCoverImageUrl)
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover Image Updated Successfully")
    )
    
})





export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser,
     updateAccountDetails , updateUserAvatar, updateUserCoverImage
}