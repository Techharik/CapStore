import express from 'express';

const Router = express.Router();


Router.get('/product',(req,res)=>{
    res.send('Hello world Product')
})




export default Router;