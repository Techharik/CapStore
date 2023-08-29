import express from 'express';
const app = express()

import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';


//swagger-API
import swaggerUi from 'swagger-ui-express';
import fs from "fs"
import YAML from 'yaml'

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }
))

//morgan middleware
app.use(morgan("tiny"));



import home from './server/routes/userRoutes.js'
import product from './server/routes/productRoutes.js'




app.use('/api/v1',home)
app.use('/api/v1',product)










app.get('/',(req,res)=>{
    res.status(201).json({message:'Welcome to Api '})
})





export default app;