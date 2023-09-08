import BigPromises from "../middlewares/BigPromises";
import {v2 as cloudinary} from 'cloudinary';
import Products from "../models/product";


const addProduct = BigPromises(async (req,res,next)=>{
    // const {name,price,discription,category,brand,stock,user} = req.body;

  if(!name && !price && !discription && !photos &&!category && !brand && !stock && !user){
    return next(new Error('All the filed"s are Required'))
  }

  if(!req.files){
    return next(new Error('Photos are Reuqired - Admin'))
  }

   //Image Handling
   imgArray=[]

   req.files.photos.forEach((photo)=>{
     const img = await cloudinary.uploader.upload(photo.tempFilePath,{
        folder:'products'
     })

     imgArray.push({
        id:img.public_id,
        secure_url:img.secure_url
     })
   })

   req.body.photos = imgArray;
   req.body.user = req.user.id

   const newProduct = await Products.create(req.body)
   
   res.status(200).json({
    message:'New Product Added Successfully',
    sucess:true,
    newProduct
   })

})






export {
    addProduct
}