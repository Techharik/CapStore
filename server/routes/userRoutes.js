import express from 'express';

const Router = express.Router();
import {signup,login,logout,forgotPassword} from '../controllers/userControllers.js'

Router.post('/signup',signup)
Router.post('/login',login)
Router.get('/logout',logout)
Router.post('/forgotpassword',forgotPassword)




export default Router;