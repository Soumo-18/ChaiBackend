import mongoose, {Schema} from 'mongoose'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//For Encryption we need help from  MONGOOSE MIDDLEWARE there are hooks -> Pre

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, // this'll be Cloudinary url
            required:true,
        },
        coverImage:{
            type:String
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true, "Password is Required"],
            trim:true,
        },
        refreshToken:{
            type:String
        }
    },
    {timestamps:true})

// userSchema.pre("save", () => {} )  // Since in Arrow function we can't have this ref we dont use this
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
   return await  bcrypt.compare(password,this.password)  //returns true / false 
}


userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        }, 
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
         }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
         process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: REFRESH_TOKEN_EXPIRY
          }
    )
}






export const User = mongoose.model("User", userSchema)