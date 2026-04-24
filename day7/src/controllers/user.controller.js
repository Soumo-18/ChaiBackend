import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '.././utils/apiError.js'
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../routes/cloudinary.js";

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

    console.log( 'Req.Body: ' ,req.body)

    const existedUser = await User.findOne({          //this return whatever the 1st document jo match karta hai is username email ko
        $or: [ { username }, { email } ] //$or: [{},{}] -> this is or parameter we check as many object as we want to
    })

    console.log( 'Existing User: ' ,existedUser)

    if(existedUser){
         throw new ApiError(409, "User with email or username already exists")
    }

    //since we added middleware in routes, it give more fields inside requests  

    //req.body by default given by express, multer gives req.files
    
    console.log("Multer req.files",req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path

    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    
//If the user doesn't upload a cover image, req.files.coverImage will be undefined.
//  Trying to access [0] on undefined will crash your server.
// To fix this, add one more optional chaining question mark before the array bracket:
    // Add a '?' before [0]
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path; // Add a '?' before [0]

    if(! avatarLocalPath ) {
        throw new ApiError(400, 'Avatar File is Required')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400, 'Avatar File is Required')
    }

    //entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || " ",
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



export {registerUser}