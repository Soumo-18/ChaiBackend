import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// whenever we use middleware we use app.use or for config settings

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'16kb'})) // take data from FORM

app.use(express.urlencoded({extended:true, limit:'16kb'})) // take data from URL | extended means obj inside obj

app.use(express.static('public')) //store file,folder

app.use(cookieParser())


















export { app }