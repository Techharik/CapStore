import express from 'express';

const Router = express.Router();
import {
    signup,
    login,
    logout,
    forgotPassword,
    passwordReset,
    userDetails,
    updatePassword,
    updateDetails} from '../controllers/userControllers.js'

import { isLoggedIn } from '../middlewares/usermiddleware.js';

Router.post('/signup',signup)
Router.post('/login',login)
Router.get('/logout',logout)
Router.post('/forgotpassword',forgotPassword)
Router.post('/password/reset/:token',passwordReset)
Router.get('/userdashboard',isLoggedIn,userDetails)
Router.post('/updatepassword',isLoggedIn,updatePassword)
Router.post('/updatedetails',isLoggedIn,updateDetails)




export default Router;