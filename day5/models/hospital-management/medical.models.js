import mongoose from "mongoose";

const medialRecordSchema = new mongoose.Schema({},{timestamps:true})


export const MedicalRecord = mongoose.model('MedicalRecord', medialRecordSchema)