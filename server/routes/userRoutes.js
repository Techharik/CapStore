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
    updateDetails,
    adminAllUsers,
    getSingleUser,
    updateSingleUser,
    deleteSingleUser} from '../controllers/userControllers.js'

import { isLoggedIn } from '../middlewares/usermiddleware.js';

import { coustomRole } from '../middlewares/usermiddleware.js';

Router.post('/signup',signup)
Router.post('/login',login)
Router.get('/logout',logout)
Router.post('/forgotpassword',forgotPassword)
Router.post('/password/reset/:token',passwordReset)
Router.get('/userdashboard',isLoggedIn,userDetails)
Router.post('/updatepassword',isLoggedIn,updatePassword)
Router.post('/updatedetails',isLoggedIn,updateDetails)

//!admin routes

Router.get('/adminallusers',isLoggedIn,coustomRole('admin'),adminAllUsers)
Router.get('/admin/users/:id',isLoggedIn,coustomRole('admin'),getSingleUser)
Router.put('/admin/users/:id',isLoggedIn,coustomRole('admin'),updateSingleUser)
Router.delete('/admin/users/:id',isLoggedIn,coustomRole('admin'),deleteSingleUser)






export default Router;