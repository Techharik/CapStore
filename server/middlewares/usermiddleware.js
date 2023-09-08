import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const isLoggedIn =async function (req,res,next){
    const token  = req.cookies.token || ''


    if( !token && req.header("Authorization")){
        token = req.header('Authorization')?.replace('Bearer ','')
    }


    if(!token){
        return next(new Error('Not have access, Please login First'))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded.userId)
    req.user = await User.findById(decoded.userId)
    
    next()


}

const coustomRole =(...roles)=>{
   return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
              next(new Error("You don't have access to this dashboard" ))
        }
         next()
    }
}








export {
    isLoggedIn,
    coustomRole
}





