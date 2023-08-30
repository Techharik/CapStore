import BigPromises from "../middlewares/BigPromises.js"
import {v2 as cloudinary} from 'cloudinary';
import cookieToken from "../utils/cookieToken.js"
import User from '../models/user.js'


const signup = BigPromises(async(req,res,next)=>{

 if (!req.files){
    return next(new Error('photo files is required'))
 }


 const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new Error("Name, email and password are required", 400));
  }

  const userExits = User.findOne({email})

  if(!userExits){
    return next(new Error('User is already Exited'))
  }

  let file = req.files.photo;

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "userCoustomers",
    width: 150,
    crop: "scale",
  });

  const user = new User({
    name,
    email,
    password,
    photo:{
        id:result.public_id,
        secureUrl:result.secure_url
    }
  }) 
   await user.save()

  cookieToken(user,res)
})




















export {
    signup
}