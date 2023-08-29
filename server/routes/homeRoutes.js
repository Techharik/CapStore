import express from 'express';

const Router = express.Router();


Router.get('/home',(req,res)=>{
    res.send('Hello world')
})




export default Router;