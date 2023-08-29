import express from 'express';

const Router = express.Router();
import {signup} from '../controllers/userControllers.js'

Router.post('/signup',signup)




export default Router;