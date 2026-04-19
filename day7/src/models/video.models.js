import mongoose, {Schema} from "mongoose";

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2' //Aggregation Pipeline

const videoSchema = new Schema(
    {
        videoFile:{
            type:String, //cloudinary url
            required:[true, "Cloudinary URL is Required"]
        },
        thumbnail:{
            type:String,
            required:true, 
        },
        title:{
            type:String,
            required:true, 
        },
        description:{
            type:String,
            required:true,
        },
        duration:{  //whenver cloudinary uploads a file after that is sends file information(url,duration) same as on AWS they have same mechanism
            type:Number,
            required:true
        },
        view:{
            type:Number,
            default:0,
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    },{timestamps:true})


    videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)