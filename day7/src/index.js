// require ('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { DB_NAME } from './constants.js'
import connectDB from './db/index.js'
import { app } from './app.js'
dotenv.config({
    path:'./.env'
})

connectDB() // whenever a asynchronour method completes it returns a promise 
  .then(()=>{
    //listen for express app error before starting the server 
    app.on('error',(error)=>{
        console.error("Express App Error", error)
        throw error
    })
    app.listen(process.env.PORT ||8000 , () => {
        console.log(`Server is Running at PORT ${process.env.PORT || 8000}`)
    }) 
  })
   .catch((err)=>{
    console.log("MongoDB Connection Failed",err)
    process.exit(1)
   })












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