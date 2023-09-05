import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const isLoggedIn =async function (req,res,next){
    const token  = req.cookies.token || ''

console.log(token )
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








export {
    isLoggedIn
}





