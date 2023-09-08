import express from 'express';
const Router = express.Router();
import { addProduct ,userSearchProduct} from '../controllers/productControllers.js';


import { isLoggedIn } from '../middlewares/usermiddleware.js';

import { coustomRole } from '../middlewares/usermiddleware.js';




Router.get('/searchproducts',isLoggedIn,userSearchProduct)

//admin
Router.post('/admin/addproduct',isLoggedIn,coustomRole('admin'),addProduct)




export default Router;