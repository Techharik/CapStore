import express from 'express';
const Router = express.Router();
import { addProduct ,userSearchProduct,getSingleProduct,adminGetAllProducts,
    adminUpdateOnProducts,deleteProduct,addReviewproduct} from '../controllers/productControllers.js';


import { isLoggedIn } from '../middlewares/usermiddleware.js';

import { coustomRole } from '../middlewares/usermiddleware.js';




Router.get('/searchproducts',isLoggedIn,userSearchProduct)
Router.get('/user/getoneproduct/:id',isLoggedIn,getSingleProduct)
Router.post('/user/addreview/',isLoggedIn,addReviewproduct)

//admin
Router.post('/admin/addproduct',isLoggedIn,coustomRole('admin'),addProduct)
Router.get('/admin/getallproducts',isLoggedIn,coustomRole('admin'),adminGetAllProducts)
Router.put('/admin/updateoneproduct/:id',isLoggedIn,coustomRole('admin'),adminUpdateOnProducts)
Router.delete('/admin/deleteproduct/:id',isLoggedIn,coustomRole('admin'),deleteProduct)







export default Router;