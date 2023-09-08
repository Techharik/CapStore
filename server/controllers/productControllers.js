import BigPromises from "../middlewares/BigPromises.js";
import {v2 as cloudinary} from 'cloudinary';
import Products from "../models/product.js";
import WhereClause from "../utils/WhereClause.js";

const addProduct = BigPromises(async (req,res,next)=>{
    const {name,price,discription,category,brand,stock,user} = req.body;

  if(!name && !price && !discription && !photos &&!category && !brand && !stock && !user){
    return next(new Error('All the filed"s are Required'))
  }

  if(!req.files){
    return next(new Error('Photos are Reuqired - Admin'))
  }

   //Image Handling
   const imgArray=[]

   if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imgArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }


   req.body.photos = imgArray;
   req.body.user = req.user.id

   const newProduct = await Products.create(req.body)

   res.status(200).json({
    message:'New Product Added Successfully',
    sucess:true,
    newProduct
   })

})


const userSearchProduct = BigPromises(async (req,res,next)=>{
  const resultperPage = 2;

  const productsObj = new WhereClause(Products.find(),req.query).search().filter()

  let products = await productsObj.base;
  const filteredProductsNumber = products.length;

  productsObj.pager(resultperPage)
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    messgage:'Your fildered and searched products',
    products,
    filteredProductsNumber
  });



})





export {
    addProduct,
    userSearchProduct
}