import BigPromises from "../middlewares/BigPromises.js"
import {v2 as cloudinary} from 'cloudinary';
import cookieToken from "../utils/cookieToken.js"
import User from '../models/user.js'
import mailer from "../utils/mailer.js";
import crypto from 'crypto'

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


//?Login route
const login = BigPromises(async(req,res,next)=>{


 const { email, password } = req.body;

 if (!email || !password) {
   return next(new Error("Email and password are required", 400));
  }
  
  const user =await  User.findOne({email}).select('+password')
  
  console.log(user)
  if(!user){
    return next(new Error('User not found', 404))
  }
 
  const checkPassword =await user.isValidatePassword(password)

  if(!checkPassword){
    return next(new Error('Password Incorrect', 401))
  }

  cookieToken(user,res)
  
})


const logout = BigPromises(async(req,res,next)=>{
   

  res.status(200).cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
  }).json({
    success:true,
    message:'User Logged Out Successfully'
})

})



const forgotPassword = BigPromises(async (req,res,next) =>{
  const {email} = req.body

 const user = await User.findOne({email})

 if(!user){
  return next(new Error('user not found, Enter a valid Email Adress',400))
 }

  const forgotToken = await user.getForgotPasswordToken()

  await user.save({ validateBeforeSave: false })

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Please copy the link and paste it in the browser to rest your password. ${myUrl}`;

  try{
  const sendMail = await mailer({
    email:user.email,
    subject:'Password rest link is send in this Email',
    message
  })

  await res.status(404).json({
    success:true,
    messgae:'Reset Link send Successfully'
  })

  }catch(e){
   
    user.forgottedPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return next(new Error(e,400))
  }



})



const passwordReset = BigPromises( async (req, res, next )=>{
 const resetToken = req.params.token
 const {newpassword} = req.body
 const decodeToken = await crypto
 .createHash("sha256")
 .update(resetToken)
 .digest("hex")
 console.log(decodeToken)

 const user =await User.findOne({
  forgottedPasswordToken:decodeToken,
  forgotPasswordExpiry:{ $gt: Date.now() }
 })

 if(!user){
  return next(new Error('Check the token given or genrate new token',404))
 }
 
 user.password = newpassword;

 user.forgotPasswordToken = undefined;
 user.forgotPasswordExpiry = undefined;

 await user.save();

 res.status(200).json({
  success:true,
  message:'Password Reseted Successfully'
 })

 
})


const userDetails = BigPromises(async (req, res, next) =>{
    const id = req.user.id;

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success:true,
      user
    })

})

const updatePassword = BigPromises(async(req,res, next)=>{
  const id = req.user.id;

  const user = await User.findById(id).select("+password");

 const oldPasswordCheck = user.isValidatePassword(req.body.oldPassword)

  if(!oldPasswordCheck){
    return next(new Error("Old password is incorrect",402))
  }

  const newPassword = req.body.newpassword

  user.password = newPassword;

  await user.save();
  
  res.status(200).json({
    success:true,
    message:'Password Updated Successfully',
    user
  })
})


const updateDetails = BigPromises(async(req, res, next)=>{
  
   const newDetails = {
    name:req.body.name,
    email:req.body.email
   }

  if(req.files){
    const user = await User.findById(req.user.id);

    const ImageId = user.photo.id;

    const destoryImage = await cloudinary.uploader.destroy(ImageId)

    const uploadNewImage = await cloudinary.uploader.upload(req.files.photo.tempFilePath,{
      folder: "userCoustomers",
      width: 150,
      crop: "scale",
    })

    const photo = {
      id: uploadNewImage.public_id,
      secureUrl:uploadNewImage.secure_url
    }

    newDetails.photo = photo;


  }
  const user = await User.findByIdAndUpdate(req.user.id,newDetails,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  await user.save()
 
  res.status(200).json({
    success:true,
    message:'Successfully Updated User Details',
    user
  })

})










export {
    signup,
    login,
    logout,
    forgotPassword,
    passwordReset,
    userDetails,
    updatePassword,
    updateDetails
}