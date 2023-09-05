import express from 'express';

const Router = express.Router();
import {signup,login,logout,forgotPassword,passwordReset} from '../controllers/userControllers.js'

Router.post('/signup',signup)
Router.post('/login',login)
Router.get('/logout',logout)
Router.post('/forgotpassword',forgotPassword)
Router.post('/password/reset/:token',passwordReset)




export default Router;