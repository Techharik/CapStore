import BigPromises from "../middlewares/BigPromises.js";
import {v2 as cloudinary} from 'cloudinary';
import Products from "../models/product.js";
import WhereClause from "../utils/WhereClause.js";




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


const getSingleProduct = BigPromises(async(req,res,next)=>{
  const product  = await Products.findById(req.params.id);

  if(!product){
    return next(new Error("Product not found",404))
  }

  res.status(200).json({
    success:true,
    product
  })
})

//review products:

const addReviewproduct = BigPromises(async(req,res,next)=>{
   

  const {comment, rating , productId } = req.body;

 const review = {
  user: req.user._id,
  name:req.user.name,
  rating:Number(rating),
  comment
 }

 const product  = await Products.findById(productId)

 const AlreadyReviewed  = product.reviews.find(
  (rev) => rev.user.toString() === req.user._id.toString()
 )
 console.log(AlreadyReviewed)
 
 if(AlreadyReviewed){
   product.reviews.forEach((rev)=>{
    rev.rating = rating;
    rev.comment = comment
   })
 }else{
   product.reviews.push(review)
   product.numberOfReviews = product.reviews.length
 }

 product.ratings = product.reviews.reduce((acc,item)=> item.rating +acc,0 ) / product.reviews.length

 await product.save({validateBeforeSava:false})

 res.status(200).json({
  success:true,
  message: 'Review add successfully',
  product
 })

})

const deleteReview = BigPromises(async(req,res,next)=>{
   

  const {productId } = req.query;


 const product  = await Products.findById(productId)

 const reviews = product.reviews.filter(
  (rev)=> rev.user.toString() !== req.user._id.toString()
 )

const numberOfReviews = reviews.length;

 product.ratings = reviews.reduce((acc,item)=>item.rating + acc,0) / numberOfReviews

const deleteReview = await Products.findByIdAndUpdate(productId,{
  reviews,
  numberOfReviews
},
{
  new: true,
  runValidators: true,
  useFindAndModify: false,
}
)

 res.status(200).json({
  success:true,
  message: 'Review deleted successfully',
  deleteReview
 })

})


//admin controllers

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
    console.log('hi')

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



const adminGetAllProducts = BigPromises(async(req,res,next)=>{
  const products  = await Products.find();

  if(!products){
    return next(new Error("Product not found",404))
  }

  res.status(200).json({
    success:true,
    products
  })
})

const adminUpdateOnProducts = BigPromises(async(req,res,next)=>{
  const product  = await Products.findById(req.params.id);

  if(!product){
    return next(new Error("Product not found",404))
  }

  let imgArr = []

  if(req.files){
    for (let index = 0; index < product.photos.length; index++) {
      const deleteres = await cloudinary.uploader.destroy(product.photos[index].id)
      
    }

    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath,{
        folder: "products",
    })
      
 
      imgArr.push({
        id : result.public_id,
        secure_url : result.secure_url,
  
     })
   
         
    }
    
  }
  req.body.photos = imgArr

 let Updatedproduct = await Products.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    newFindandModify:false
   })

   res.status(200).json({
    success:true,
    message:"Products Updated Successfully",
    Updatedproduct
   })


})


const deleteProduct = BigPromises(async(req,res,next)=>{
  const product = await Products.findById(req.params.id)

  if(!product){
    return next(new Error('Product not found Admin',404))
  }
  
  for( let i = 0; i < product.photos.lengthL; i++){
    const deleteImg = await cloudinary.uploader.destroy(product.photos[i].id)
  }

  await Products.findByIdAndRemove(req.params.id)


  res.status(200).json({
    success:true,
    message:'Product successfully removed'
  })

})


export {
    addProduct,
    userSearchProduct,
    getSingleProduct,
    adminGetAllProducts,
    adminUpdateOnProducts,
    deleteProduct,
    addReviewproduct,
    deleteReview
}