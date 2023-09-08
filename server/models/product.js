import mongoose, { Schema,model } from "mongoose";



const productSchema = new Schema({
name:{
    type: String,
    required:[true,"Please enter the name of the Product"]
},
price:{
    type:Number,
    required:[true, "Please enter the price of the Product"]
},
discription:{
    type:String,
    required:[true, "Please enter the discription of the Product"]
},
photos:[
    {
        id:{
            type: String,
            required:true
        },
        secure_url:{
            type: String,
            required:true
        }
    }
],
category:{
    type:String,
    enum:['cotton','leather','Woolen','Vegan'],
    required:[true,"Please select the cap from the given category"]
},
brand:{
 type:String,
 required:true
},
stock:{
    type:Number,
    required:true
},
ratings:{
    type:Number,
    default:0
},
numberOfReviews:{
    type:Number,
    default:0
},
reviews:[
    {
      user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
       },
       name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    }
],
user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
},
createdAt:{
    type:Date,
    default:Date.now
}

})


const Products = new model('products',productSchema)

export default Products;