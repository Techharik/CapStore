import express from 'express';

const Router = express.Router();
import {signup,login,logout,forgotPassword,passwordReset,userDetails} from '../controllers/userControllers.js'

import { isLoggedIn } from '../middlewares/usermiddleware.js';

Router.post('/signup',signup)
Router.post('/login',login)
Router.get('/logout',logout)
Router.post('/forgotpassword',forgotPassword)
Router.post('/password/reset/:token',passwordReset)
Router.get('/userdashboard',isLoggedIn,userDetails)




export default Router;