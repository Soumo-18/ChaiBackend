import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

// NOTE: We deleted the cloudinary.config() block entirely!
// The SDK will automatically use the CLOUDINARY_URL from your .env file.

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // SUCCESS: Remove the local file AFTER a successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log('File Uploaded on Cloudinary:', response.url);
        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error Details:", error.message);
        // Remove the local file if it exists to keep your server clean
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };



























// import { v2 as cloudinary } from "cloudinary"

// import fs from "node:fs"


// // (async function() {
// console.log("--- ENV CHECK ---");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Secret Exists?:", process.env.CLOUDINARY_API_SECRET ? "YES" : "NO");

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
//     });


// const uploadOnCloudinary = async (localFilePath)=>{
//     try {
//         if(!localFilePath) return null
        
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type:"auto"
//         })
//         // SUCCESS: Remove the local file AFTER a successful upload
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         //file has been uploaded
//         console.log('File Uploaded on Cloudinary', response.url)
//         return response
//     } catch (error) {
//         // the file is on the server, if the file is not uploaded, 
//         // for a safe cleaning purpose we should remove it from our server because there can be malicious or corrupted files
//         // fs.unlinkSync(localFilePath) // Removes the locally saved temp file as the upload config return failed
//         console.error("Cloudinary Upload Error Details:", error.message);
//         // Remove the local file if it exists to keep your server clean
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         return null;
        
//     }
// }

// export  { uploadOnCloudinary }

// cloudinary.v2.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg"), {
//     public_id:'shoes'},
//     function (error, result) {console.log(result)}





    
    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();