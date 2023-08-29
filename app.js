import 'dotenv/config'
import express from 'express';
import app from './index.js'
import dbConnect from './server/db/config.js/config.js';
import {v2 as cloudinary} from 'cloudinary';

const PORT= process.env.PORT
cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME , 
    api_key:process.env.CLOUD_API, 
    api_secret:process.env.CLOUD_SECRET
  });


dbConnect()

app.listen(PORT,()=>{
    console.log('Server Started Successfully');
})