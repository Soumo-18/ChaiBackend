import mongoose from 'mongoose'

//doctor stays in which hospital total number of hours
const doctorShiftSchema = new mongoose.Schema({
    hospitalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
        required:true,
    },
    totalHours:{
        type:Number,
        default:0,
        required:true,
    },
    shiftTiming:{
        type:String,
        enum: [ 'Morning', 'AfterNoon', 'Evening'],
        required:true
    }
 },
   {_id:false} //this prevents creating extra ID for sub documents
)

const doctorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true, 
        },
        salary:{
            type:String,
            required:true,
        },
        qualification:{
            type:String,
            required:true,
        },
        experienceInYears:{
            type:Number,
            default:0
        },
        worksInHospitals:[doctorShiftSchema]
    }
    ,{timestamps:true})


export const Doctor = mongoose.model('Doctor', doctorSchema)