import express from 'express';
const Router = express.Router();
import { addProduct } from '../controllers/productControllers.js';


import { isLoggedIn } from '../middlewares/usermiddleware.js';

import { coustomRole } from '../middlewares/usermiddleware.js';




//admin
Router.get('/admin/addproduct',isLoggedIn,coustomRole('admin'),addProduct)




export default Router;