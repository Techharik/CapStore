import express from 'express';
const Router = express.Router();
import { 
    createOrder,
    getOneOrder ,
    getLoggedInOrders,
    getAllOrders,
    adminUpdateOrder,
    adminDeleteOrder
} from '../controllers/orderControllers.js';


import { isLoggedIn } from '../middlewares/usermiddleware.js';

import { coustomRole } from '../middlewares/usermiddleware.js';


Router.post('/order/create',isLoggedIn,createOrder)
Router.get('/order/:id',isLoggedIn,getOneOrder)
Router.get('/myorder',isLoggedIn,getLoggedInOrders)


//admin
Router.get('/admin/getallorders',isLoggedIn,coustomRole("admin"),getAllOrders)
Router.put('/admin/order/:id',isLoggedIn,coustomRole("admin"),adminUpdateOrder)
Router.delete('/admin/order/:id',isLoggedIn,coustomRole("admin"),adminDeleteOrder)

export default Router
