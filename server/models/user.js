import { Schema,model } from "mongoose";
import bcrypt from 'bcryptjs'
import validator from 'validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema = new Schema({
    name:{
        type:String,
        required:[true,'Please provide the name'],
        maxlenght:30
    },
    email:{
        type:String,
        required:[true,'Please provide the Email'],
        validate: [validator.isEmail, "Please enter email in correct format"],
        maxlenght:30
    },
    password:{
        type:String,
        required:[true,'Please provide the password'],
        validate:[validator.isStrongPassword,'Please provide a stron password to login'],
        select:false
    },
    role:{
        type:String,
        default:'user'
    },
    photo:{
        id:{
           type:String,
           required:true
        },
        secureUrl:{
            type:String,
            required:true
        }
    },
    forgottedPasswordToken:String,
    forgotPasswordExpiry:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

//pre hooks and methods:

//encrypt password

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    this.password =await bcrypt.hash(this.password,10)
})

//validating the user password
userSchema.methods.isValidatePassword = async function(usersendpassword){
    return await bcrypt.compare(usersendpassword,this.password)
}


//sign Json Web Token
userSchema.methods.getJwtToken=function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    })
}

//genrate forgotpassword token:
userSchema.methods.getForgotPasswordToken=function(){
    const forgotToken = crypto.randomBytes(20).toString("hex");

    this.forgottedPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //time of token
     this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

     return forgotToken;

}



const User = new model('user',userSchema)

export default User;


