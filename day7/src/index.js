// require ('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { DB_NAME } from './constants.js'
import connectDB from './db/index.js'

dotenv.config({
    path:'./env'
})

connectDB()












/*
import express from 'express'

const app = express()

(async () => {
    try{
       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on('error', (err)=>{
        console.log("Error: ", err)
        throw err 
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App Listening on PORT ${PORT}`)
       })
    }catch(err){
        console.log("Error : ", err)
        throw err
    }
} ) ()
*/