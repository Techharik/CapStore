import 'dotenv/config'
import express from 'express';
import app from './index.js'

const PORT= process.env.PORT



app.listen(PORT,()=>{
    console.log('Server Started Successfully');
})