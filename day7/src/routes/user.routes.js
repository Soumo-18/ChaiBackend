import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
 
import {upload} from '.././middlewares/multer.middleware.js'

const router = Router ()

router.route('/register').post(
    upload.fields( [                  ////fields->Returns middleware that processes multiple files associated with the given form fields.
        {
            name:'avatar',
            maxCount: 1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ] ), 

    registerUser
)
 

export default router 